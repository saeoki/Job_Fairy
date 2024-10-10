from google.cloud import bigquery
from pymongo import MongoClient, errors
import os
from dotenv import load_dotenv

load_dotenv('/')

client = bigquery.Client()

query = """
        SELECT *
        FROM eloquent-vector-423514-s2.raw_data.all_job_posting
"""
query_job = client.query(query) # bigquery에 쿼리를 날려서 결과를 반환
rows = list(query_job.result()) # 순회하기 위해 list로 변환

mongo_uri = os.getenv('MONGO_URI')
mongo_client = MongoClient(mongo_uri)

# database 선택
db = mongo_client['Job_Fairy']
# collenction 선택
collection = db['all-job-posting']

# 컬렉션 비우기
collection.delete_many({})

# 'id' 필드에 고유성 인덱스 생성
collection.create_index("id", unique=True)

documents = [dict(row) for row in rows]
try:
    # ordered=False : 오류 발생해도 나머지 도큐먼트 삽입
    collection.insert_many(documents, ordered=False)
    print(f"{len(documents)}개의 도큐먼트가 성공적으로 MongoDB에 삽입되었습니다.")

except errors.BulkWriteError as bwe:
    print(f"BulkWriteError 발생: {bwe.details}")
    n_inserted = bwe.details['nInserted']
    print(f"총 {len(documents)}개 중 {n_inserted}개의 도큐먼트가 삽입되었습니다.")
