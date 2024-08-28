"""import requests
import json

# API endpoint and parameters
url = 'https://oapi.saramin.co.kr/job-search'
params = {
    'access-key': '~',  # Replace with your actual access key
}

# Sending GET request to the API
response = requests.get(url, params=params)

# Checking if the request was successful
if response.status_code == 200:
    pre_data = response.json()
    data = json.dumps(pre_data, indent=4, ensure_ascii=False)
    print(data)
else:
    print(f"Error: {response.status_code}, {response.text}")"""


import requests
import json
from google.cloud import storage
from datetime import datetime
from dotenv import load_dotenv
import os
import time
import random

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

url = 'https://oapi.saramin.co.kr/job-search'
max_count = 110

def fetch_jobs(start, count) :
    params = {
        'access-key' : access_key,
        'start' : start,
        'count' : count,
    }
    response = requests.get(url, params=params) #JSON 형식으로 반환
    if response.status_code == 200 :
        return response.json() #JSON 형식의 응답 데이터를 파이썬 구조 객체로
    else :
        print(f"Error : {response.status_code}, {response.text}")
        
initial_data = fetch_jobs(start=0, count=1)
print(initial_data)


# 여기서 데이터 추출을 여러번 나눠 분할을 하든 뭘 하든 하나의 최종 파일로 만들어냄 (dag를 여기서 분할)
if initial_data is not None and 'jobs' in initial_data and 'total' in initial_data['jobs']:
    total_results = int(initial_data['jobs']['total'])
    # total_results = 500
    print(f"total : {total_results}")

    today_date = datetime.now().strftime("%Y%m%d")
    local_file = f'all_jobs_saramin_{today_date}.json'



    with open(local_file, 'w', encoding='utf-8') as f :
        f.write('[')

    first_batch = True

    #max count is 110
    for start in range(0, total_results, max_count) :
        data = fetch_jobs(start=start, count=max_count)

        if data is not None and 'jobs' in data and 'job' in data['jobs']:
            jobs = data['jobs']['job']
            if not jobs : # job리스트에 데이터가 없을 경우
                print(f"Warning: job리스트에 데이터가 없습니다.")
                received_count = 0
                break

            received_count = len(jobs)

            with open(local_file, 'a', encoding='utf-8') as f :
                if not first_batch :
                    f.write(',')
                else :
                    first_batch = False
                f.write(json.dumps(jobs, ensure_ascii=False)[1:-1]) # 파이썬 구조의 객체를 JSON 문자열로
            
            print(f"{total_results}중의 {start}번 째 실행 완료.")

            if received_count < max_count :
                print(f"Warning: 예상보다 적은 데이터({received_count}개)를 받았습니다. 종료합니다.")
                break

        else :
            print(f"Warning : {start}번째 응답에서 데이터가 없습니다.")
            break
        time.sleep(2.5)

    with open(local_file, 'a', encoding='utf-8') as f :
        f.write(']')

    print(f"Success : 첫 번째 Task 호출 데이터 갯수 {start + received_count}개")

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






# GCS to BigQuery

# 설정 변수
project_id = "eloquent-vector-423514-s2"
dataset_id = "raw_data"
table_id = "all_job_posting" # 테이블이 존재하지 않으면 해당 이름으로 자동 생성
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