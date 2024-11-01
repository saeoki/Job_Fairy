import requests
import json
import os
import time
from google.cloud import storage
from google.cloud import bigquery
from google.cloud.bigquery import SourceFormat

from airflow import DAG
from airflow.decorators import task
from datetime import datetime, timedelta
import logging
from airflow.models import Variable
from airflow.operators.trigger_dagrun import TriggerDagRunOperator

access_key = Variable.get("saramin_api_key")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = Variable.get("gcp_credentials_path")

# 오늘 날짜 기준 파일명 정의
today_date = datetime.now().strftime("%Y%m%d")
local_file = f'/var/lib/airflow/dags/all_jobs_saramin_{today_date}.json'

# 재귀적으로 딕셔너리의 키에서 '-'를 '_'로 바꾸는 함수
def replace_hyphens(obj):
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            new_key = k.replace('-', '_')  # '-'를 '_'로 바꿈
            new_obj[new_key] = replace_hyphens(v)  # 재귀적으로 모든 값에 대해 반복
        return new_obj
    elif isinstance(obj, list):
        return [replace_hyphens(item) for item in obj]
    else:
        return obj

# fetch만을 위한 함수객체
def fetch(start, count, bbs_gb=None) :
    url = 'https://oapi.saramin.co.kr/job-search'
    params = {
        'access-key' : access_key,
        'start' : start,
        'count' : count,
        'job_mid_cd' : 2,
    }
    if bbs_gb is not None:
        params['bbs_gb'] = bbs_gb

    headers = {
        'Accept': 'application/json'
    }

    response = requests.get(url, params=params, headers=headers) #JSON 형식으로 반환
    if response.status_code == 200 :
        data = response.json() #JSON 형식의 응답 데이터를 파이썬 구조 객체로
        return replace_hyphens(data) # 필드명을 '-'에서 '_'로 변경
    else :
        logging.info(f"Error : {response.status_code}, {response.text}")
        return None

@task
def fetch_initial_data() :
    public_initial_data = fetch(start=0, count=1, bbs_gb=1)
    non_public_initial_data = fetch(start=0, count=1)

    if public_initial_data and non_public_initial_data :
        public_total_results = int(public_initial_data['jobs']['total'])
        non_public_total_results = int(non_public_initial_data['jobs']['total'])
        logging.info(f"public_total : {public_total_results} & non_public_total : {non_public_total_results}")
        return (public_total_results, non_public_total_results)
    else :
        raise ValueError("API 호출 실패: 초기 데이터 가져오기 실패")


# fetch함수를 사용하는 메인급 호출함수
@task
def extract_jobs(total_results) :
    public_total_results, non_public_total_results = total_results
    max_count = 110
    first_batch = True
    job_ids_set = set() # 중복 방지 체크를 위한 id set

    with open(local_file, 'w', encoding='utf-8') as f :
        f.write('[')

    # 공채 데이터 fetch
    for start in range(0, public_total_results, 1) :
        public_data = fetch(start = start, count = max_count, bbs_gb = 1)
        if public_data and 'jobs' in public_data and 'job' in public_data['jobs'] :
            jobs = public_data['jobs']['job'] # data['jobs]['job]은 JSON 객체 리스트
            if not jobs:
                logging.info(f"Warning: 공채 데이터 job 리스트에 데이터가 없습니다.")
                break
            
            received_count = len(jobs)

            # 중복 제거: 중복된 데이터는 리스트에서 제외
            jobs = [job for job in jobs if job['id'] not in job_ids_set]

            for job in jobs : # 여기서 job은 JSON 객체 하나
                job_ids_set.add(job['id'])
                job['bbs_gb'] = 1 # JSON 객체에 bbs_gb필드 추가, 값은 1

            with open(local_file, 'a', encoding='utf-8') as f:
                if not first_batch :
                    f.write(',')
                else :
                    first_batch = False
                f.write(json.dumps(jobs, ensure_ascii=False)[1:-1])

            logging.info(f"공채 데이터 중 {public_total_results}개의 {start}번째 실행 완료.")

            if received_count < max_count :
                logging.info(f"Warning: 예상보다 적은 공채 데이터 {received_count}개를 받았습니다. 종료합니다.")
                break
        
        else :
            logging.info(f"Warning: 공채 데이터 {start}번째 응답에서 데이터가 없습니다.")
            break

        time.sleep(1)
        
        
    # 비공채 데이터 fetch
    for start in range(0, non_public_total_results, 1) :
        non_public_data = fetch(start = start, count = max_count, bbs_gb = None)
        if non_public_data and 'jobs' in non_public_data and 'job' in non_public_data['jobs'] :
            jobs = non_public_data['jobs']['job'] # data['jobs]['job]은 JSON 객체 리스트
            if not jobs :
                logging.info(f"Warning: 비공채 데이터 job 리스트에 데이터가 없습니다.")
                break

            received_count = len(jobs)

            # 중복 제거: 중복된 데이터는 리스트에서 제외
            jobs = [job for job in jobs if job['id'] not in job_ids_set]

            for job in jobs : # 여기서 job은 JSON 객체 하나
                job_ids_set.add(job['id'])
                job['bbs_gb'] = 0 # JSON 객체에 bbs_gb필드 추가, 값은 0

            with open(local_file, 'a', encoding='utf-8') as f:
                if not first_batch :
                    f.write(',')
                else :
                    first_batch = False
                f.write(json.dumps(jobs, ensure_ascii=False)[1:-1])

            logging.info(f"비공채 데이터 중 {non_public_total_results}개의 {start}번 째 실행 완료.")

            if received_count < max_count :
                logging.info(f"Warning: 예상보다 적은 비공채 데이터({received_count}개)를 받았습니다. 종료합니다.")
                break

        else :
            logging.info(f"Warning: 비공채 데이터 {start}번째 응답에서 데이터가 없습니다.")
            break

        time.sleep(1)

    with open(local_file, 'a', encoding='utf-8') as f:
        f.write(']')


# JSON to NDJSON
@task
def transform_json(local_file) :
    with open(local_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(local_file, 'w', encoding='utf-8') as f:
        for entry in data:
            json.dump(entry, f, ensure_ascii=False) # ensure_ascii옵션 설정을 안하면 한글이 다른 문자열로 변환됨
            f.write('\n')



# Upload file to GCS and remove os file
@task
def load_to_gcs(local_file) :
    storage_client = storage.Client()
    bucket_name = Variable.get("gcs_bucket_name")
    destination_blob_name = os.path.basename(local_file) # 경로 떼고 파일 이름만 추출
    
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(local_file)
    
    logging.info(f"File {local_file} uploaded to {destination_blob_name} in bucket {bucket_name}.")
    
    os.remove(local_file)
    logging.info(f"\n{local_file}이 내 환경에서 삭제되었습니다.")
    
    return (bucket_name, destination_blob_name)


# GCS to BigQuery
@task
def bulkload_to_bigquery(bucket_info) :
    project_id = Variable.get("bigquery_project_id")
    dataset_id = Variable.get("bigquery_dataset_id")
    table_id = Variable.get("bigquery_table_id") # 테이블이 존재하지 않으면 해당 이름으로 자동 생성
    gcs_bucket_name, gcs_file_name = bucket_info
    gcs_uri = f"gs://{gcs_bucket_name}/{gcs_file_name}"

    # BigQuery 클라이언트 생성
    bigquery_client = bigquery.Client(project=project_id)

    # LoadJobConfig 생성
    job_config = bigquery.LoadJobConfig(
        source_format=SourceFormat.NEWLINE_DELIMITED_JSON,
        autodetect=True,  # 자동으로 스키마 감지 (옵션)
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
    )

    # 데이터셋과 테이블 참조 생성
    table_ref = f"{project_id}.{dataset_id}.{table_id}"

    # GCS에서 BigQuery로 데이터 로드
    load_job = bigquery_client.load_table_from_uri(
        gcs_uri,
        table_ref,
        job_config=job_config,
    )  # API 요청

    logging.info(f"Loading data from {gcs_uri} into {table_ref}")

    # 작업 완료 대기를 위함
    load_job.result()

    # 로드된 테이블 정보 확인
    destination_table = bigquery_client.get_table(table_ref)
    logging.info(f"Loaded {destination_table.num_rows} rows into {table_ref}.")


default_args = {
    'owner': 'sewook',
    'start_date': datetime(2024, 10, 1),
    #'email': ['dnrtp9256@gmail.com'],
    'execution_timeout': timedelta(minutes=20),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='jobpostings_ETL',
    tags=['saramin_api'],
    default_args=default_args,
    schedule_interval='0 15 * * *',
    catchup=False,
) as dag: 

    initial_data = fetch_initial_data()
    extract = extract_jobs(initial_data)
    transform = transform_json(local_file)
    load = load_to_gcs(local_file)
    bulkload = bulkload_to_bigquery(load)

    trigger_bq_to_mg = TriggerDagRunOperator(
        task_id='trigger_bq_to_mg_bulkload',
        trigger_dag_id='bq_to_mg_bulkload',
        wait_for_completion=False # True 설정시 트리거된 dag의 완료를 기다림
    )

    initial_data >> extract >> transform >> load >> bulkload >> trigger_bq_to_mg