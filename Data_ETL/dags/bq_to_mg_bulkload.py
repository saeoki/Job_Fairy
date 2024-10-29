from google.cloud import bigquery
from pymongo import MongoClient, errors
import os

from airflow import DAG
from airflow.decorators import task
from datetime import datetime, timedelta
import logging
from airflow.models import Variable

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = Variable.get("gcp_credentials_path")

CHUNK_SIZE = 1000  # 한 번에 삽입할 도큐먼트 수

@task
def bulkload_to_mongo() :
    # INFO 레벨 이하 로그 비활성화
    # logging.disable(logging.INFO)

    client = bigquery.Client()
    query = """
            SELECT *
            FROM eloquent-vector-423514-s2.raw_data.all_job_posting
    """
    query_job = client.query(query) # bigquery에 쿼리를 날려서 결과를 반환
    rows = list(query_job.result()) # 순회하기 위해 list로 변환

    mongo_uri = Variable.get("mongo_authorization_uri")
    mongo_client = MongoClient(mongo_uri)
    db = mongo_client['Job_Fairy']
    collection = db['all-job-posting']

    # 컬렉션 비우기
    collection.delete_many({})
    # 'id' 필드에 고유성 인덱스 생성
    collection.create_index("id", unique=True)

    # 청크로 데이터를 나누어 MongoDB에 삽입(메모리 최적화)
    for i in range(0, len(rows), CHUNK_SIZE):
        chunk = [dict(row) for row in rows[i:i + CHUNK_SIZE]]
        try:
            collection.insert_many(chunk, ordered=False)
            logging.info(f"{len(chunk)}개의 도큐먼트를 성공적으로 MongoDB에 삽입했습니다.")
        except errors.BulkWriteError as bwe:
            logging.info(f"BulkWriteError 발생: {bwe.details}")
            n_inserted = bwe.details.get('nInserted', 0)
            logging.info(f"{len(chunk)}개 중 {n_inserted}개의 도큐먼트가 삽입되었습니다.")
        except Exception as e:
            logging.error(f"문서 삽입 실패: {e}")

    logging.info("Data가 MongoDB에 성공적으로 삽입되었습니다.")
    mongo_client.close()


default_args = {
    'owner': 'sewook',
    'start_date': datetime(2024, 10, 1),
    #'email': ['dnrtp9256@gmail.com'],
    'execution_timeout': timedelta(minutes=20),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='bq_to_mg_bulkload',
    tags=['mongo_bulkload'],
    default_args=default_args,
    schedule_interval=None,
    catchup=False
) as dag:
    
    bulkload_to_mongo()