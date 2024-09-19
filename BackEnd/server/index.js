const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const { Problem } = require("./models/Problem")
// const config = require("./config/key");
const cors = require('cors');
const { JobPosting } = require("./models/JobPosting")

const app = express();
//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있다.
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // 클라이언트 도메인 명시
  credentials: true // 자격 증명(쿠키 등) 포함 허용
})); // cors 미들웨어 사용

mongoose
  .connect("mongodb+srv://jobfairy3:hknucapstone1%401@job-fairy.3c684u9.mongodb.net/Job_Fairy?retryWrites=true&w=majority&appName=job-fairy")
  //.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//app.use("/api", test);
app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});



app.post('/api/auth/kakao', async (req, res) => {
  const { kakaoId, nickname } = req.body;

  try {
    let user = await User.findOne({ kakaoId });

    if (user) {
        // 사용자 정보 업데이트
        // user.nickname = nickname;
        await user.save();
        return res.status(200).json({ message: 'User updated successfully' });
    } else {
        // 사용자 정보 저장
        const newUser = new User({ kakaoId, nickname });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    }
} catch (err) {
    return res.status(500).json({ error: 'Database error' });
}
});

app.post('/api/auth/kakao/register', async (req, res) => {
  const { kakaoId, nickname, location, military, position, salary, isUpdate } = req.body;

  try {
    let user = await User.findOne({ kakaoId });

    if (user) {
        // 사용자 정보 업데이트
        user.nickname = nickname;
        user.location = location;
        user.military = military;
        user.position = position;
        user.salary = salary;
        user.isUpdate = isUpdate;
        await user.save();
        return res.status(200).json({ message: 'User updated successfully' });
    } else {
        // 오류 반환
        return res.status(304).json({ error: 'Not Modified' });
    }
} catch (err) {
    return res.status(500).json({ error: 'Database error' });
}
});
// 레벨별 그룹화 반환
app.get('/api/problem/level', async (req, res) => {
  try {
    const problemsByLevel = await Problem.aggregate([
      {
        $group: {
          _id: "$level",  // level 필드 기준으로 그룹화
          problems: { $push: "$$ROOT" }  // 해당 레벨의 문제들을 배열로 묶음
        }
      },
      { $sort: { _id: 1 } }  // 레벨 순으로 정렬 (오름차순)
    ]);

    res.json(problemsByLevel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 문제와 테스트셋을 가져오는 API
app.get('/api/problem/:no', async (req, res) => {
  try {
    const problem = await Problem.findOne({ no: req.params.no });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/run', (req, res) => {
  const { code } = req.body;
  // 여기에 코드 실행 로직 작성
  const result = `Running code: ${code}`; // 임시 결과
  res.json({ result });
});


// 페이지네이션 API
app.get("/api/Recruitment/JobPostingList", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // 페이지 번호 (기본값 1)
    const limit = 10;  // 한 페이지에 표시할 데이터 수
    const skip = (page - 1) * limit;  // 건너뛸 데이터 수

    const total = await JobPosting.countDocuments(); // 전체 데이터 수
    const jobPostings = await JobPosting.find({}, {
      "bbs_gb": 1,  // 공채 구분

      "company.detail.name": 1,  // 기업 이름
      "company.detail.href": 1,  // 기업 정보 링크
    
      "position.location.name": 1,  // 위치
      "position.required-education-level.name": 1,  // 학력 기준
      "position.experience-level.name": 1,  // 경력 기준
      "position.experience-level.max": 1,  // 최대 경력
      "position.experience-level.min": 1,  // 최소 경력
      "position.job-mid-code.name": 1,  // 중간 직종
      "position.job-type.name": 1,  // 직종 유형 (예: 정규직)
      "position.title": 1,  // 공고 제목
    
      "posting-timestamp": 1,  // 게시 날짜
      "modification-timestamp": 1,  // 수정 날짜
      "expiration-timestamp": 1,  // 마감 기한
      "salary": 1,  // 연봉 정보
      "active": 1,  // 공고 진행 여부
      "url": 1  // 공고 링크
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      jobPostings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching job postings", error: err });
  }
});





const port = 5000;
app.listen(port, () => console.log(`${port}`));
