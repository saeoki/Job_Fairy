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
    response = requests.get(url, params=params)
    if response.status_code == 200 :
        return response.json()
    else :
        print(f"Error : {response.status_code}, {response.text}")
        
initial_data = fetch_jobs(start=0, count=1)
print(initial_data)


if initial_data is not None and 'jobs' in initial_data and 'total' in initial_data['jobs']:
    total_results = int(initial_data['jobs']['total'])
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
            with open('local_file', 'a', encoding='utf-8') as f :
                if not first_batch :
                    f.write(',')
                else :
                    first_batch = False
                f.write(json.dumps(jobs, ensure_ascii=False)[1:-1])
                print(f"{total_results}중의 {start}번 째 실행 완료.")
        else :
            print(f"Warning : {start}번째 응답에서 데이터 없음.")

    with open(local_file, 'a', encoding='utf-8') as f :
        f.write(']')

    print('Success')

else :
    print('Failed to fetch initial data')


local_file = 'all_jobs_saramin.json'

# Upload file to GCS
bucket_name = 'jobfairy-gcs'
destination_blob_name = local_file
upload_to_gcs(bucket_name, local_file, destination_blob_name)

