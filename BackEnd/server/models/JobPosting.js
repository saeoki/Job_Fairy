const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema({
    bbs_gb: Number,  // 공채 구분

    company: {
      detail: {
        name: String,  // 기업 이름
        href: String,  // 기업 정보 링크
      }
    },
    position: {
      location: {
        name: String  // 위치
      },
      required_education_level: {
        name: {
          type: String,
          alias: 'required-education-level'  // 하이픈 포함 필드 별칭
        }
      },
      experience_level: {
        name: {
          type: String,
          alias: 'experience-level-name'  // 경력 기준
        },
        max: {
          type: Number,
          alias: 'experience-level-max'  // 최대 경력
        },
        min: {
          type: Number,
          alias: 'experience-level-min'  // 최소 경력
        }
      },
      job_code: {
        name: {
          type: String,
          alias: 'job-code-name'  //  직무명
        }
      },
      job_mid_code: {
        name: {
          type: String,
          alias: 'job-mid-code-name'  // 중간 직종
        }
      },
      job_type: {
        name: {
          type: String,
          alias: 'job-type-name'  // 직종 유형
        }
      },
      title: String,  // 공고 제목
    },
    posting_timestamp: Number, // 게시 날짜 (Unix timestamp
    modification_timestamp: Number, // 수정 날짜 (Unix timestamp)
    expiration_timestamp: Number, // 마감 기한 (Unix timestamp)
    salary: String, // 연봉 정보
    active: Number, // 공고 진행 여부 (1:진행중, 0:마감)
    url: String  // 공고 링크
}, { collection: 'all-job-posting' });


const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
module.exports = { JobPosting };
