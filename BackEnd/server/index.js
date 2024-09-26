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


// 채용 데이터 불러오기 API
app.post("/api/Recruitment/JobPostingList", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { jobs, locations, experiences } = req.body;
    
    console.log("필터 데이터: ", {jobs, locations, experiences});

    const query = {};

    // 직무 필터
    if (jobs && jobs.length > 0) {
      query["position.job_code.name"] = {
        $regex: new RegExp(jobs.join('|')),  // jobs 배열의 값을 정규식으로 연결
        $options: "i"  // 대소문자 구분 없이 검색 (필요할 경우)
      };
    }


    // 지역 필터
    if (locations && locations.length > 0) {
      query["position.location.name"] = {
        $regex: new RegExp(locations.join('|')),  // locations 배열을 정규식으로 변환
        $options: "i"  // 대소문자 구분 없이 검색
      };
    }

    // 경력 필터
    if (experiences && experiences.length > 0) {
      // 각 경력 옵션에 따른 min/max 범위를 설정합니다.
      const experienceRanges = {
        "신입": { min: 0, max: 0 },            // 신입은 경력 0년
        "1~3년": { min: 1, max: 3 },           // 1~3년 경력
        "4~8년": { min: 4, max: 8 },           // 4~8년 경력
        "9년 이상": { min: 9, max: Infinity }  // 9년 이상 경력
      };

      // 각 경력 조건에 맞는 쿼리 생성
      const experienceConditions = experiences.map(exp => {
        const range = experienceRanges[exp];  // 선택한 경력 범위에 맞는 값
        if (range) {
          return {
            $and: [
              { "position.experience_level.min": { $lte: range.max } },  // 최소 경력이 선택한 범위의 최대값 이하
              { "position.experience_level.max": { $gte: range.min } }   // 최대 경력이 선택한 범위의 최소값 이상
            ]
          };
        }
        return null;
      }).filter(condition => condition !== null);  // null 값 제거

      // 경력무관인 항목은 항상 포함
      query.$or = [
        { "position.experience_level.name": "경력무관" },
        ...experienceConditions
  ];
}


    const total = await JobPosting.countDocuments(query);
    const jobPostings = await JobPosting.find(query)
      .select({
        "bbs_gb": 1,
        "company.detail.name": 1,
        "company.detail.href": 1,
        "position.location.name": 1,
        "position.experience_level.name": 1,
        "position.experience_level.min": 1,
        "position.experience_level.max": 1,
        "position.job_code.name": 1,
        "position.job_mid_code.name": 1,
        "position.title": 1,
        "posting_timestamp": 1,
        "expiration_timestamp": 1,
        "salary": 1,
        "url": 1
      })
      .skip(skip)
      .limit(limit);

    if (jobPostings.length === 0) {
      return res.status(200).json({
        jobPostings: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      });
    }

    res.status(200).json({
      jobPostings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    console.error("Error in /api/Recruitment/JobPostingList:", err);
    res.status(500).json({ message: "채용 정보를 가져오는 중 오류가 발생했습니다.", error: err.message });
  }
});






const port = 5000;
app.listen(port, () => console.log(`${port}`));
