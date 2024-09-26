# import asyncio
# import websockets
# import json
# from google.cloud import speech
# import os
# import base64

# # 서비스 계정 키 파일 경로 설정
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r"C:\Users\wyzmq\OneDrive\바탕 화면\capstone\Job_Fairy\job-fairy-402b8bb6defd.json"

# # 음성 인식 클라이언트 생성
# client = speech.SpeechClient()

# # 음성 인식 설정
# config = speech.RecognitionConfig(
#     encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#     sample_rate_hertz=16000,
#     language_code='ko-KR',
# )

# # 스트리밍 음성 인식 설정
# streaming_config = speech.StreamingRecognitionConfig(
#     config=config,
#     interim_results=True  # 중간 결과를 받을지 여부
# )

# async def recognize_speech(websocket, path):
#     print("Client connected")

#     # 요청 생성기 함수
#     async def request_generator():
#         while True:
#             try:
#                 message = await websocket.recv()
#                 data = json.loads(message)
#                 audio_base64 = data.get('audio_data')

#                 if audio_base64:
#                     # Base64로 인코딩된 오디오 데이터를 디코딩
#                     audio_data = base64.b64decode(audio_base64)
#                     yield speech.StreamingRecognizeRequest(audio_content=audio_data)
#             except websockets.exceptions.ConnectionClosed:
#                 break

#     # 음성 인식 요청 및 응답 처리
#     try:
#         requests = request_generator()
#         responses = client.streaming_recognize(streaming_config, requests)

#         async for response in responses:
#             for result in response.results:
#                 transcription = result.alternatives[0].transcript
#                 is_final = result.is_final

#                 # 클라이언트로 전송할 데이터 생성
#                 response_data = {
#                     'transcription': transcription,
#                     'isFinal': is_final
#                 }

#                 await websocket.send(json.dumps(response_data))

#     except Exception as e:
#         print(f"Error: {e}")

#     print("Client disconnected")

# # WebSocket 서버 시작
# start_server = websockets.serve(recognize_speech, 'localhost', 5001)

# print("WebSocket server started on ws://localhost:5001")
# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()
