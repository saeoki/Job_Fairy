from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

model = load_model('./face_emotion.h5')
shape_x, shape_y = 48, 48

emotion_labels = {
    0: 'Angry',
    1: 'Disgust',
    2: 'Fear',
    3: 'Happy',
    4: 'Sad',
    5: 'Surprise',
    6: 'Neutral'
}

def detect_face(frame):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    detected_faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=6, minSize=(shape_x, shape_y), flags=cv2.CASCADE_SCALE_IMAGE)
    coord = []
    for x, y, w, h in detected_faces:
        if w > 100:
            sub_img = frame[y:y+h, x:x+w]
            coord.append([x, y, w, h])
    return gray, detected_faces, coord

def extract_face_features(gray, detected_faces, coord, offset_coefficients=(0.075, 0.05)):
    new_face = []
    for det in detected_faces:
        x, y, w, h = det
        horizontal_offset = int(np.floor(offset_coefficients[0] * w))
        vertical_offset = int(np.floor(offset_coefficients[1] * h))
        extracted_face = gray[y+vertical_offset:y+h, x+horizontal_offset:x-horizontal_offset+w]
        new_extracted_face = cv2.resize(extracted_face, (shape_x, shape_y))
        new_extracted_face = new_extracted_face.astype(np.float32)
        new_extracted_face /= float(new_extracted_face.max())
        new_face.append(new_extracted_face)
    return new_face

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['image']
        npimg = np.frombuffer(file.read(), np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        gray, detected_faces, coord = detect_face(frame)
        face_zoom = extract_face_features(gray, detected_faces, coord)
        face_zoom = np.reshape(face_zoom[0].flatten(), (1, 48, 48, 1))
        pred = model.predict(face_zoom)
        pred_result = np.argmax(pred)
        
        emotion_label = emotion_labels[pred_result]
        probabilities = pred[0].tolist()
        
        # 각 라벨과 그에 해당하는 확률을 함께 출력
        result = {emotion_labels[i]: probabilities[i] for i in range(len(emotion_labels))}
        
        print("Emotion Label:", emotion_label)
        print("Probabilities:", result)
        
        return jsonify({
            'emotion_label': emotion_label,
            'probabilities': result
        })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
