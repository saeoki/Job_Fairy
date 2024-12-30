from airflow import DAG
from airflow.decorators import task
import logging
from airflow.models import Variable
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
from google.cloud import bigquery
import os
from datetime import datetime, timedelta

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = Variable.get("gcp_credentials_path")

QUERY = """
        CREATE OR REPLACE TABLE analytics.refined_job_posting AS
        WITH decoded AS (
            SELECT
                id,
                salary.name AS salary_name,
                company.detail.name AS company_name,
                position.experience_level.name AS experience_level,
                position.location.name AS location_name,
                position.industry.name AS industry_name,
                Position.job_code.name AS job_code_name,
                opening_timestamp,
                posting_timestamp,
                expiration_timestamp,
                modification_timestamp,
                REPLACE(position.location.name, '&gt;', '>') AS decoded_location
            FROM
                `eloquent-vector-423514-s2.raw_data.all_job_posting`
        )

        SELECT
            id,
            salary_name,
            company_name,
            experience_level,
            industry_name,
            DATE(SAFE.TIMESTAMP_SECONDS(opening_timestamp)) AS opening_date,
            DATE(SAFE.TIMESTAMP_SECONDS(posting_timestamp)) AS posting_date,
            DATE(SAFE.TIMESTAMP_SECONDS(expiration_timestamp)) AS expiration_date,
            DATE(SAFE.TIMESTAMP_SECONDS(modification_timestamp)) AS modification_date,
            IF(
                location_name IS NULL OR location_name = '',
                '위치 정보 없음',
                REGEXP_REPLACE(
                TRIM(
                    CONCAT(
                    REGEXP_EXTRACT(decoded_location, r'^([^>]+)'),
                    ' ',
                    IFNULL(REGEXP_EXTRACT(decoded_location, r'^[^>]+>([^,>]+)'), '')
                    )
                ),
                r'\s+',
                ' '
                )
            ) AS formatted_location,
            IF(
                job_code_name IS NULL OR job_code_name = '',
                '직무 정보 없음',
                REGEXP_EXTRACT(job_code_name, r'^([^,]+)')
            ) AS first_job_code,
            CASE 
                WHEN job_code_name LIKE '%프론트엔드%' THEN '프론트엔드'
                WHEN job_code_name LIKE '%백엔드%' OR job_code_name LIKE '%서버개발%' THEN '백엔드/서버개발'
                WHEN job_code_name LIKE '%웹개발%' THEN '웹개발'
                WHEN job_code_name LIKE '%기술지원%' THEN '기술지원'
                WHEN job_code_name LIKE '%유지보수%' THEN '유지보수'
                WHEN job_code_name LIKE '%데이터엔지니어%' THEN '데이터엔지니어'
                WHEN job_code_name LIKE '%DBA%' THEN 'DBA'
                WHEN job_code_name LIKE '%데이터분석가%' THEN '데이터분석가'
                WHEN job_code_name LIKE '%데이터 사이언티스트%' THEN '데이터 사이언티스트'
                WHEN job_code_name LIKE '%앱개발%' THEN '앱개발'
                WHEN job_code_name LIKE '%게임개발%' THEN '게임개발'
                WHEN job_code_name LIKE '%SE%' THEN 'SE(시스템엔지니어)'
                WHEN job_code_name LIKE '%개발PM%' THEN '개발PM'
                ELSE '기타'
            END AS job_category
        FROM
            decoded;
        """

@task
def elt_refined_job_posting() :
    client = bigquery.Client()

    query_job = client.query(QUERY)
    query_result = query_job.result() # 쿼리 실행 결과 반환, 완료까지 대기

    logging.info(f"{query_result}\n쿼리가 실행 완료되었습니다.")

default_args = {
    'owner': 'sewook',
    'start_date': datetime(2024, 12, 1),
    #'email': ['dnrtp9256@gmail.com'],
    'execution_timeout': timedelta(minutes=15),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='elt_refined_job_posting',
    tags=['datamart_refined_job_posting'],
    default_args=default_args,
    schedule_interval='0 1 * * *',
    catchup=False
) as dag:

    elt_refined_job_posting()