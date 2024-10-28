import requests
import json
from datetime import datetime
from dotenv import load_dotenv
import os
import time
from google.cloud import storage
from google.cloud import bigquery
from google.cloud.bigquery import SourceFormat


load_dotenv('/')
access_key=os.getenv('SARAMIN_API_KEY')


def upload_to_gcs(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)
    print(f"File {source_file_name} uploaded to {destination_blob_name} in bucket {bucket_name}.")

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
def fetch_jobs(start, count, bbs_gb=None) :
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
        print(f"Error : {response.status_code}, {response.text}")
        return None
    
# 위의 fetch_jobs를 사용하는 메인급 호출함수
def fetch_and_save_jobs(public_total_results, non_public_total_results, local_file, max_count) :
    first_batch = True
    job_ids_set = set() # 중복 방지 체크를 위한 id set

    with open(local_file, 'w', encoding='utf-8') as f :
        f.write('[')

    # 공채 데이터 fetch
    for start in range(0, public_total_results, 1) :
        public_data = fetch_jobs(start = start, count = max_count, bbs_gb = 1)
        if public_data and 'jobs' in public_data and 'job' in public_data['jobs'] :
            jobs = public_data['jobs']['job'] # data['jobs]['job]은 JSON 객체 리스트
            if not jobs:
                print(f"Warning: 공채 데이터 job 리스트에 데이터가 없습니다.")
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

            print(f"공채 데이터 중 {public_total_results}개의 {start}번째 실행 완료.")

            if received_count < max_count :
                print(f"Warning: 예상보다 적은 공채 데이터 {received_count}개를 받았습니다. 종료합니다.")
                break
        
        else :
            print(f"Warning: 공채 데이터 {start}번째 응답에서 데이터가 없습니다.")
            break

        time.sleep(2.5)
        
        
    # 비공채 데이터 fetch
    for start in range(0, non_public_total_results, 1) :
        non_public_data = fetch_jobs(start = start, count = max_count, bbs_gb = None)
        if non_public_data and 'jobs' in non_public_data and 'job' in non_public_data['jobs'] :
            jobs = non_public_data['jobs']['job'] # data['jobs]['job]은 JSON 객체 리스트
            if not jobs :
                print(f"Warning: 비공채 데이터 job 리스트에 데이터가 없습니다.")
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

            print(f"비공채 데이터 중 {non_public_total_results}개의 {start}번 째 실행 완료.")

            if received_count < max_count :
                print(f"Warning: 예상보다 적은 비공채 데이터({received_count}개)를 받았습니다. 종료합니다.")
                break

        else :
            print(f"Warning: 비공채 데이터 {start}번째 응답에서 데이터가 없습니다.")
            break

        time.sleep(2.5)

    with open(local_file, 'a', encoding='utf-8') as f:
        f.write(']')


public_initial_data = fetch_jobs(start=0, count=1, bbs_gb=1)
non_public_initial_data = fetch_jobs(start=0, count=1)

if public_initial_data and non_public_initial_data :
    public_total_results = 2 # int(public_initial_data['jobs']['total'])
    non_public_total_results = 2 # int(non_public_initial_data['jobs']['total'])
    print(f"public_total : {public_total_results} & non_public_total : {non_public_total_results}")

    today_date = datetime.now().strftime("%Y%m%d")
    local_file = f'all_jobs_saramin_{today_date}.json'

    fetch_and_save_jobs(public_total_results, non_public_total_results, local_file, max_count=110)

else : 
    print('Failed to fetch initial data')



# JSON to NDJSON
with open(local_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(local_file, 'w', encoding='utf-8') as f:
    for entry in data:
        json.dump(entry, f, ensure_ascii=False) # ensure_ascii옵션 설정을 안하면 한글이 다른 문자열로 변환됨
        f.write('\n')


# Upload file to GCS
bucket_name = 'jobfairy-gcs'
destination_blob_name = local_file
upload_to_gcs(bucket_name, local_file, destination_blob_name)
os.remove(local_file)
print(f"\n{local_file}이 내 환경에서 삭제되었습니다.")




# GCS to BigQuery
# 설정 변수
project_id = os.getenv('BIGQUERY_PROJECT_ID')
dataset_id = os.getenv('BIGQUERY_DATASET_ID')
table_id = os.getenv('BIGQUERY_TABLE_ID') # 테이블이 존재하지 않으면 해당 이름으로 자동 생성
gcs_bucket_name = bucket_name
gcs_file_name = destination_blob_name
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

print(f"Loading data from {gcs_uri} into {table_ref}")

# 작업 완료 대기
load_job.result()

# 로드된 테이블 정보 확인
destination_table = bigquery_client.get_table(table_ref)
print(f"Loaded {destination_table.num_rows} rows into {table_ref}.")

