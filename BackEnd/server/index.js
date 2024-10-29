require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { WebSocketServer } = require('ws'); // WebSocket 서버를 위한 모듈
const speech = require('@google-cloud/speech'); // Google Speech API 모듈
const cors = require('cors');
const jwt = require('jsonwebtoken');
const getCreationDateFromId = (id) => {
  return new Date(new ObjectId(id).getTimestamp());
};

// MongoDB 모델 임포트
const { User } = require("./models/User");
const { Problem } = require("./models/Problem");
const { Jasose } = require("./models/Jasoses");
const { Favorite } = require('./models/Favorites');
const { JobPosting } = require("./models/JobPosting");
const { InterviewResult } = require('./models/InterviewResult'); // 모델 추가
const ObjectId = require('mongoose').Types.ObjectId;

const app = express();
const port = 5000; // 통합된 포트


// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Middleware 설정
app.use(bodyParser.json());
app.use(cors({
  origin: ['https://jobfairy.netlify.app', 'http://localhost:3000'], // 클라이언트 도메인 명시
  credentials: true // 자격 증명(쿠키 등) 포함 허용
}));

// Google Speech API 클라이언트
const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// 기본 API 라우팅
app.get('/', (req, res) => {
  res.send('server root page');
});

// 로그인 API
app.post('/api/auth/kakao', async (req, res) => {
  const { kakaoId, nickname, location, military, position, salary } = req.body;
  const secretKey = process.env.JWT_SECRET_KEY;
  try {
    let user = await User.findOne({ kakaoId });
    if (user) {
      if (user.isUpdate === false) {
        const token = jwt.sign({ kakaoId, nickname }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Redirect', redirectUrl: '/Register', token });
      }
      const token = jwt.sign({ kakaoId, nickname, location, military, position, salary }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: 'User login successfully', token });
    } else {
      const newUser = new User({ kakaoId, nickname });
      const userFavorite = new Favorite({ kakaoId, nickname });
      await newUser.save();
      await userFavorite.save();
      const token = jwt.sign({ kakaoId, nickname }, secretKey, { expiresIn: '1h' });
      return res.status(201).json({ message: 'User created successfully', redirectUrl: '/Register', token });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// 사용자 등록 API
app.post('/api/auth/kakao/register', async (req, res) => {
  const { kakaoId, nickname, location, military, position, salary } = req.body;
  try {
    let user = await User.findOne({ kakaoId });
    let userFavorite = await Favorite.findOne({ kakaoId });

    if (user && userFavorite) {
      user.nickname = nickname || user.nickname;
      user.location = location || user.location;
      user.military = military || user.military;
      user.position = position || user.position;
      user.salary = salary !== undefined ? salary : user.salary;
      user.isUpdate = true;
      await user.save();
      userFavorite.nickname = nickname || userFavorite.nickname;
      await userFavorite.save();
      return res.status(200).json({ message: 'User updated successfully' });
    } else {
      return res.status(304).json({ error: 'Not Modified' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// 사용자 정보 조회 API
app.post('/api/auth/info', async (req, res) => {
  const { kakaoId } = req.body;
  try {
    const user = await User.findOne({ kakaoId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// 즐겨찾기 조회 API
app.post('/api/favorites/get', async (req, res) => {
  const { kakaoId, nickname } = req.body;
  try {
    const userFavorite = await Favorite.findOne({ kakaoId, nickname });
    if (!userFavorite) {
      return res.status(404).json({ message: 'User data not found' });
    }
    res.json(userFavorite);
  } catch (error) {
    return res.status(500).json({ error: 'Database error' });
  }
});

// 즐겨찾기 추가 API
app.post('/api/favorites/add', async (req, res) => {
  const { kakaoId, nickname, id, type } = req.body;
  try {
    const userFavorite = await Favorite.findOne({ kakaoId, nickname });
    if (!userFavorite) {
      return res.status(404).json({ message: 'User data not found' });
    }

    if (type === 'jasose') {
      userFavorite.data.jasose.push(id);
    } else if (type === 'myeonjeob') {
      userFavorite.data.myeonjoeb.push(id);
    } else if (type === 'employment') {
      userFavorite.data.employment.push(id);
    }

    await userFavorite.save();
    return res.status(200).json({ message: 'Favorite added successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// 즐겨찾기 제거 API
app.post('/api/favorites/remove', async (req, res) => {
  const { kakaoId, nickname, id, type } = req.body;
  try {
    const userFavorite = await Favorite.findOne({ kakaoId, nickname });
    if (!userFavorite) {
      return res.status(404).json({ message: 'User data not found' });
    }

    if (type === 'jasose') {
      userFavorite.data.jasose.pull(id);
    } else if (type === 'myeonjeob') {
      userFavorite.data.myeonjoeb.pull(id);
    } else if (type === 'employment') {
      userFavorite.data.employment.pull(id);
    }

    await userFavorite.save();
    return res.status(200).json({ message: 'Favorite removed successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// 자기소개서 저장 API
app.post('/api/jasose/save', async (req, res) => {
  const { kakaoId, nickname, jasose, keyJasose, job, keyword } = req.body;
  try {
    const newJasose = new Jasose({
      kakaoId,
      nickname,
      data: {
        jasose,
        keyJasose,
        job,
        keyword
      },
      time: Date.now()
    });
    await newJasose.save();
    res.status(200).json({ success: true, message: '자기소개서가 저장되었습니다.' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 자기소개서 조회 API
app.post('/api/jasose/get', async (req, res) => {
  const { kakaoId, nickname } = req.body;

  try {
    let query = {};
    if (kakaoId) query.kakaoId = kakaoId;
    if (nickname) query.nickname = nickname;

    let jasose = await Jasose.find(query).sort({ time: -1 });
    if (!jasose) {
      return res.status(404).json({ success: false, error: "저장된 데이터가 없습니다." });
    }
    res.status(200).json({ success: true, data: jasose });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 자기소개서 삭제 API
app.post('/api/jasose/remove', async (req, res) => {
  const { kakaoId, nickname, id } = req.body;
  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const result = await Jasose.findOneAndDelete({
      kakaoId: kakaoId,
      nickname: nickname,
      _id: objectId
    });

    if (result) {
      return res.status(200).json({ message: '성공적으로 삭제되었습니다.' });
    } else {
      return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
    }
  } catch (err) {
    return res.status(500).json({ error: '데이터베이스 오류' });
  }
});

app.post('/api/myeonjeob/get', async (req, res) => {
  const { kakaoId, nickname } = req.body;
  
  try {
    // 조건에 맞는 문서를 검색하고 최신순으로 정렬
    let query = {};

    // kakaoId와 nickname이 있을 경우에만 조건을 추가
    if (kakaoId) query.kakaoId = kakaoId;
    if (nickname) query.nickname = nickname;

    let myeonjoeb = await InterviewResult.find(query).sort({ time: -1 }); 

    if(!myeonjoeb){
      return res.status(404).json({success: false, error:"저장된 데이터가 없습니다."})
    }
    res.status(200).json({ success: true, data: myeonjoeb });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/myeonjeob/remove', async (req, res) => {
  const { kakaoId, nickname, id } = req.body;

  try {
    const objectId = new mongoose.Types.ObjectId(id);

    // 해당 조건으로 데이터 삭제
    const result = await InterviewResult.findOneAndDelete({
      kakaoId: kakaoId,
      nickname: nickname,
      _id: objectId
    });

    if (result) {
      return res.status(200).json({ message: '성공적으로 삭제되었습니다.' });
    } else {
      return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
    }
  } catch (err) {
    return res.status(500).json({ error: '데이터베이스 오류' });
  }
});

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

// 특정 문제 번호로 문제와 테스트셋 가져오기 API
app.get('/api/problem/:no', async (req, res) => {
  try {
    const problem = await Problem.findOne({ no: req.params.no });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 채용 데이터 필터링 API
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
        $regex: new RegExp(jobs.join('|')),
        $options: "i"
      };
    }

    // 지역 필터
    if (locations && locations.length > 0) {
      query["position.location.name"] = {
        $regex: new RegExp(locations.join('|')),
        $options: "i"
      };
    }

    // 경력 필터
    if (experiences && experiences.length > 0) {
      const experienceRanges = {
        "신입": { min: 0, max: 0 },
        "1~3년": { min: 1, max: 3 },
        "4~8년": { min: 4, max: 8 },
        "9년 이상": { min: 9, max: Infinity }
      };

      const experienceConditions = experiences.map(exp => {
        const range = experienceRanges[exp];
        if (range) {
          return {
            $and: [
              { "position.experience_level.min": { $lte: range.max } },
              { "position.experience_level.max": { $gte: range.min } }
            ]
          };
        }
        return null;
      }).filter(condition => condition !== null);

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

    const jobPostingsWithCreationDate = jobPostings.map(job => ({
      ...job.toObject(),
      creationDate: getCreationDateFromId(job._id)
    }));


    if (jobPostings.length === 0) {
      return res.status(200).json({
        jobPostings: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      });
    }

    res.status(200).json({
      jobPostings: jobPostingsWithCreationDate,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    console.error("Error in /api/Recruitment/JobPostingList:", err);
    res.status(500).json({ message: "채용 정보를 가져오는 중 오류가 발생했습니다.", error: err.message });
  }
});

app.post("/api/Recruitment/Custom", async (req, res) => {
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { jobs, locations, salary } = req.body;

    const query = {};
  
    // 직무 필터
    if (jobs && jobs.length > 0) {
      const jobMappings = {
      "프론트엔드": "프론트엔드",
      "백엔드": "백엔드/서버개발",
      "풀스택": "웹개발, 백엔드/서버개발, 프론트엔드",
      "데브옵스": "기술지원, 유지보수",
      "데이터 엔지니어": "데이터엔지니어, DBA",
      "데이터 분석가": "데이터분석가",
      "데이터 사이언티스트": "데이터 사이언티스트",
      "모바일 앱": "앱개발",
      "게임개발": "게임개발",
      "시스템 엔지니어": "SE(시스템엔지니어)",
      "개발PM": "개발PM"
    };


    // 변환된 직무 배열 생성
    const transformedJobs = new Set(); // 중복 제거를 위한 Set 사용

    jobs.forEach(job => {
      const mappedJob = jobMappings[job] || job; // 매핑된 직무
      // 매핑된 직무가 쉼표로 구분된 문자열일 경우 분리하여 Set에 추가
      mappedJob.split(',').forEach(mapped => transformedJobs.add(mapped.trim()));
    });

    // Set을 배열로 변환하여 정규식 쿼리 생성
    query["position.job_code.name"] = {
      $regex: new RegExp(Array.from(transformedJobs).join('|')), // 중복 제거된 직무로 정규식 생성
      $options: "i"
    };
  }

  // 지역 필터
  if (locations && locations.length > 0) {
    query["position.location.name"] = {
      $regex: new RegExp(locations.join('|')),  // locations 배열을 정규식으로 변환
      $options: "i"  // 대소문자 구분 없이 검색
    };
  }

  // 급여 필터
  if (salary) {
    if (salary === 2000) {
      query["salary.code"] = { $in: [0, 9, 10,11,12,13,14,15,16,17,18,19,20,21,22 ,99] };
    } else if (salary === 3000) {
      query["salary.code"] = { $in: [0,11,12,13,14,15,16,17,18,19,20,21,22 ,99] };
    } else if (salary === 4000) {
      query["salary.code"] = { $in: [0,16,17,18,19,20,21,22 ,99] };
    } else if (salary === 5000) {
      query["salary.code"] = { $in: [0,17,18,19,20,21,22 ,99] };
    } else if (salary === 6000) {
      query["salary.code"] = { $in: [0,18,19,20,21,22 ,99] };
    } else if (salary === 7000) {
      query["salary.code"] = { $in: [0,19,20,21,22 ,99] };
    } else if (salary === 8000) {
      query["salary.code"] = { $in: [0,20,21,22 ,99] };
    } else if (salary === 9000) {
      query["salary.code"] = { $in: [0,21,22 ,99] };
    } else if (salary >= 10000) {
      query["salary.code"] = { $in: [0, 22 ,99] };
    } else {
      query["salary.code"] = { $in: [0, 99] };
    }
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
  console.error(err);
  res.status(500).json({ message: "채용 정보를 가져오는 중 오류가 발생했습니다.", error: err.message });
}
});

// 면접 결과 저장 API
app.post('/api/interview/save', async (req, res) => {
  const { kakaoId, nickname, questionsAndAnswers, accumulatedEmotions, emotionFeedback } = req.body;

  // 필수 데이터 누락 시 에러 반환
  if (!kakaoId || !nickname || !questionsAndAnswers || !accumulatedEmotions || !emotionFeedback) {
    return res.status(400).json({ message: "Required data missing." });
  }

  try {
    const newInterviewResult = new InterviewResult({
      kakaoId,
      nickname,
      questionsAndAnswers,
      accumulatedEmotions,
      emotionFeedback,  // 감정 피드백 추가
      createdAt: new Date()
    });
    await newInterviewResult.save();
    res.status(200).json({ message: "Interview result saved successfully!" });
  } catch (error) {
    console.error("Failed to save interview result:", error.message); // 에러 메시지 출력
    res.status(500).json({ message: "Failed to save interview result.", error: error.message });
  }
});

// 면접 결과 조회 API
app.post('/api/interview/get', async (req, res) => {
  const { kakaoId, nickname } = req.body;

  if (!kakaoId || !nickname) {
    return res.status(400).json({ message: "kakaoId and nickname are required." });
  }

  try {
    const interviewResults = await InterviewResult.find({ kakaoId, nickname }).sort({ createdAt: -1 });
    if (!interviewResults.length) {
      return res.status(404).json({ message: 'No interview results found' });
    }
    res.status(200).json({ success: true, data: interviewResults });
  } catch (error) {
    console.error("Failed to retrieve interview results:", error.message); // 에러 메시지 출력
    res.status(500).json({ message: "Failed to retrieve interview results.", error: error.message });
  }
});





// WebSocket 설정 (Speech-to-Text 처리)
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  let recognizeStream = null;

  ws.on('message', (message) => {
    if (!recognizeStream) {
      recognizeStream = client
        .streamingRecognize({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'ko-KR',
          },
          interimResults: true, // true
        })
        .on('error', (err) => {
          console.error('Error in recognizeStream:', err);
          ws.send(JSON.stringify({ error: err.message }));
        })
        .on('data', (data) => {
          if (data.results[0] && data.results[0].alternatives[0] && data.results[0]) { // isFinal 조건 추가
            ws.send(
              JSON.stringify({ transcription: data.results[0].alternatives[0].transcript })
            );
          }
        });
      }

    recognizeStream.write(Buffer.from(message));
  });

  ws.on('close', () => {
    if (recognizeStream) {
      recognizeStream.end();
    }
    console.log('Client disconnected');
  });
});
