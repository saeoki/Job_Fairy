from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import pandas as pd

chrome_options = Options()
#chrome_options.add_argument("--headless")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
driver.implicitly_wait(5)

company_names = []
locations = []
company_reviews = []
company_ratings = []
average_salaries = []

for page in range(1, 622):
    url = f"https://www.jobplanet.co.kr/companies?industry_id=700&page={page}"
    driver.get(url)

    for i in range(1, 11):
        try:
            company_names.append(driver.find_element(By.XPATH, f'//*[@id="listCompanies"]/div/div[1]/section[{i}]/div/div/dl[1]/dt/a').text)
            locations.append(driver.find_element(By.XPATH, f'//*[@id="listCompanies"]/div/div[1]/section[{i}]/div/div/dl[1]/dd[1]/span[3]').text)
            company_reviews.append(driver.find_element(By.XPATH, f'//*[@id="listCompanies"]/div/div[1]/section[{i}]/div/div/dl[2]/dt').text)
            company_ratings.append(driver.find_element(By.XPATH, f'//*[@id="listCompanies"]/div/div[1]/section[{i}]/div/div/dl[2]/dd[1]/span').text)
            average_salaries.append(driver.find_element(By.XPATH, f'//*[@id="listCompanies"]/div/div[1]/section[{i}]/div/div/dl[2]/dd[2]/a/strong').text)
        except :
            print(f"Element not found on page {page}, section {i}. Skipping...")
    
# 모든 페이지 처리가 완료된 후 드라이버 종료
driver.quit()

data = {
    "company_name" : company_names,
    "location" : locations,
    "company_review" : company_reviews,
    "company_rating" : company_ratings,
    "average_salary" : average_salaries
}

df = pd.DataFrame(data)
print(df)
