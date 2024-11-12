const mongoose = require('mongoose');

// 각 질문 및 답변의 스키마
const questionAnswerSchema = new mongoose.Schema([{
  question: { type: String, required: true },                     // 질문 텍스트
  answer: { type: String, default: "No answer provided" },  // 답변 텍스트 (기본값 추가)
  evaluation: { type: String },                   // 답변에 대한 평가
}]);

// 전체 면접 결과의 스키마
const interviewResultSchema = new mongoose.Schema({
  kakaoId: { type: String, required: true, maxlength: 30 },       // 카카오 ID (필수, 최대 30자)
  nickname: { type: String, maxlength: 10 },      // 사용자 닉네임 (필수, 최대 10자)
  questionsAndAnswers: { type: [questionAnswerSchema] }, // 질문과 답변 배열
  accumulatedEmotions: {                                           // 전체 감정 점수 요약
    type: Map,
    of: Number,
  },
  emotionFeedback: { type: String },               // 감정 점수에 대한 평가
  createdAt: { type: Date, default: Date.now }                     // 생성 날짜
});

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);

module.exports = { InterviewResult };
