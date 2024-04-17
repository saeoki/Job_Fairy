from flask import Flask, render_template

app = Flask(__name__)

@app.route('/AI_interview_progress')  # React 앱을 렌더링할 경로 설정
def index():
    return render_template('index.html')  # React 앱의 메인 페이지 렌더링

if __name__ == '__main__':
    app.run(debug=True)
