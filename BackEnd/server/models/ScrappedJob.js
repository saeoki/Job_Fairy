const mongoose = require('mongoose');

const ScrappedJobSchema = new mongoose.Schema({
  jobId: { type: Number, required: true },
  kakaoId: { type: String, required: true },
  company: {
    detail: {
      name: String,
      href: String,
    },
  },
  position: {
    title: String,
    location: { name: String },
    experience_level: { name: String },
  },
  url: String,
  expiration_timestamp: Number,
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScrappedJob', ScrappedJobSchema, 'scrapped-job-posting'); // 모델이름 정의, 따를 스키마 정의, 컬렉션 이름 정의
