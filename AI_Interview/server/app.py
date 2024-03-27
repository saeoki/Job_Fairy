from flask import Flask, jsonify
from CheckCameraMicrophone import CheckCameraMicrophone

app = Flask(__name__)
checker = CheckCameraMicrophone()

@app.route('/check_camera_microphone', methods=['GET'])
def check_camera_microphone():
    result = checker.check_camera_and_microphone()
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
