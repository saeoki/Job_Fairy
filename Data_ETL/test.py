import requests
import json

# API endpoint and parameters
url = 'https://oapi.saramin.co.kr/job-search'
params = {
    'access-key': '',  # Replace with your actual access key
    'bbs_gb': 1
}
headers = {
    'Accept' : 'application/json'
}

# Sending GET request to the API
response = requests.get(url, params=params, headers=headers)

# Checking if the request was successful
if response.status_code == 200:
    pre_data = response.json()
    data = json.dumps(pre_data, indent=4, ensure_ascii=False)
    print(data)
else:
    print(f"Error: {response.status_code}, {response.text}")


