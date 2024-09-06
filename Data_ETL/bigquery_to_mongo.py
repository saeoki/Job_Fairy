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
query_job = client.query(query)
rows = list(query_job.result()) # 순회하기 위해 list로 변환

mongo_uri = os.getenv('MONGO_URI')
mongo_client = MongoClient(mongo_uri)

# database 선택
db = mongo_client['recruitment']
# collenction 선택
collection = db['all-job-posting']

# # 데이터를 한 번에 삽입
# document = [dict(row) for row in rows]
# collection.insert_many(document)

# 컬렉션 비우기
collection.delete_many({})

# 'id' 필드에 고유성 인덱스 생성
collection.create_index("id", unique=True)

for row in rows :
    document = dict(row)
    try :
        collection.insert_one(document)

    except errors.DuplicateKeyError :
        print("중복된 id 필드가 발견되어 문서를 삽입하지 않았습니다.")

    except Exception as e :
        print(f"Document 삽입 실패: {e}")

print("Data가 MongoDB에 성공적으로 삽입되었습니다.")
