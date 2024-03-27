import cv2
import pyaudio
import numpy as np
from threading import Thread

class CheckCameraMicrophone:
    def __init__(self):
        self.camera = cv2.VideoCapture(0)
        self.p = pyaudio.PyAudio()
        self.running = True

    def check_camera_and_microphone(self):
        if not self.camera.isOpened():
            print("카메라를 찾을 수 없습니다.")
            return
        else:
            print("카메라를 찾았습니다.")

        mic_count = self.p.get_device_count()
        if mic_count == 0:
            print("마이크를 찾을 수 없습니다.")
            return
        else:
            print(f"총 {mic_count}개의 마이크를 찾았습니다.")

        self.stream = self.p.open(format=pyaudio.paInt16,
                                   channels=1,
                                   rate=44100,
                                   input=True,
                                   frames_per_buffer=1024)

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        while self.running:
            ret, frame = self.camera.read()
            if not ret:
                print("비디오 스트림에서 프레임을 읽을 수 없습니다.")
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

            try:
                audio_data = np.frombuffer(self.stream.read(1024), dtype=np.int16)
                volume = np.abs(audio_data).mean()
                cv2.rectangle(frame, (20, 20), (20 + int(volume / 100), 40), (0, 255, 0), -1)
            except KeyboardInterrupt:
                break

            # 한글 폰트 경로
            font_path = 'NanumBarunGothic.ttf'
            # 한글 텍스트 추가
            cv2.putText(frame, "Press 's' to stop", (int(frame.shape[1]*0.7), 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1, cv2.LINE_AA)
            cv2.imshow('Camera', frame)

            if cv2.waitKey(1) & 0xFF == ord('s'):
                self.stop()
                break

    def stop(self):
        self.running = False

if __name__ == "__main__":
    print("카메라와 마이크 점검 시작...")
    checker = CheckCameraMicrophone()
    thread = Thread(target=checker.check_camera_and_microphone)
    thread.start()

    thread.join()
    checker.camera.release()
    cv2.destroyAllWindows()
    checker.stream.stop_stream()
    checker.stream.close()
    checker.p.terminate()
