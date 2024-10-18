const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const { Problem } = require("./models/Problem")
const { Jasose } = require("./models/Jasoses")
const { Favorite } = require('./models/Favorites')

// const config = require("./config/key");
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env 파일 로드
const { JobPosting } = require("./models/JobPosting")


const app = express();
//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있다.
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors({
  origin: ['https://jobfairy.netlify.app', 'http://localhost:3000'], // 클라이언트 도메인 명시
  credentials: true // 자격 증명(쿠키 등) 포함 허용
})); // cors 미들웨어 사용

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get('/', (req,res) => {
  res.send('server root page');
});

// 로그인
app.post('/api/auth/kakao', async (req, res) => {
  const { kakaoId, nickname, location, military, position, salary } = req.body;
  const secretKey = process.env.JWT_SECRET_KEY;
  try {
    let user = await User.findOne({ kakaoId });
    if (user) {
      // isUpdate 상태를 확인하여 로직 처리
      if (user.isUpdate === false) {
        const token = jwt.sign({ kakaoId, nickname }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Redirect', redirectUrl: '/Register', token });
      }
      // 사용자 정보 업데이트
      // await user.save();
      const token = jwt.sign({ kakaoId, nickname, location, military, position, salary }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: 'User login successfully', token });
    } else {
      // 사용자 정보 저장
      const newUser = new User({ kakaoId, nickname });
      const userFavorite = new Favorite({kakaoId, nickname})
      await newUser.save();
      await userFavorite.save()
      const token = jwt.sign({ kakaoId, nickname }, secretKey, { expiresIn: '1h' });
      return res.status(201).json({ message: 'User created successfully', redirectUrl: '/Register', token });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/kakao/register', async (req, res) => {
  const { kakaoId, nickname, location, military, position, salary } = req.body;
  try {
    let user = await User.findOne({ kakaoId });
    let userFavorite = await Favorite.findOne({kakaoId})

    if (user&&userFavorite) {
        // 사용자 정보 업데이트
        user.nickname = nickname || user.nickname; // 기존 닉네임 유지;
        user.location = location || user.location; // 기존 위치 유지
        user.military = military || user.military; // 기존 군대 정보 유지
        user.position = position || user.position; // 기존 직위 유지
        user.salary = salary !== undefined ? salary : user.salary; // salary가 주어지면 업데이트
        user.isUpdate = true;
        await user.save();
        userFavorite.nickname = nickname || userFavorite.nickname;
        await userFavorite.save()
        return res.status(200).json({ message: 'User updated successfully' });
    } else {
        // 오류 반환
        return res.status(304).json({ error: 'Not Modified' });
    }
} catch (err) {
    return res.status(500).json({ error: 'Database error' });
}
});

app.post('/api/auth/info', async (req,res)=> {
  const {kakaoId} = req.body
  try{
    const user = await User.findOne({ kakaoId });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.json(user)
  } catch(err){
    return res.status(500).json({ error: 'Database error' });
  }
})

app.post('/api/favorites/get', async (req,res) => {
  const { kakaoId, nickname } = req.body; 
  try{
    const userFavorite = await Favorite.findOne({ kakaoId, nickname });

    if (!userFavorite) {
      return res.status(404).json({ message: 'User data not found' });
    }
    res.json(userFavorite)
  }catch(error){
    return res.status(500).json({ error: 'Database error' });
  }
})

app.post('/api/favorites/add', async (req, res) => {
  const { kakaoId, nickname, id, type } = req.body; 
  try {
    const userFavorite = await Favorite.findOne({ kakaoId, nickname });

    if (!userFavorite) {
      return res.status(404).json({ message: 'User data not found' });
    }

    if (type === 'jasose') {
      userFavorite.data.jasose.push(id);
    } else if (type === 'myeonjoeb') {
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


app.post('/api/favorites/remove', async (req, res) => {
  const { kakaoId, nickname, id, type } = req.body; 

  try {
    const userFavorite = await Favorite.findOne({ kakaoId, nickname });

    if (!userFavorite) {
      return res.status(404).json({ message: 'User data not found' });
    }

    if (type === 'jasose') {
      userFavorite.data.jasose.pull(id);
    } else if (type === 'myeonjoeb') {
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
      time: Date.now() // 전달된 시간이 없을 경우 현재 시간을 기본값으로 사용
    });

    await newJasose.save();
    res.status(200).json({ success: true, message: '자기소개서가 저장되었습니다.' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/jasose/get', async (req, res) => {
  const { kakaoId, nickname } = req.body; // req.body 대신 req.query를 사용하는 것이 더 일반적일 수 있습니다.
  
  try {
    // 조건에 맞는 문서를 검색하고 최신순으로 정렬
    let query = {};

    // kakaoId와 nickname이 있을 경우에만 조건을 추가
    if (kakaoId) query.kakaoId = kakaoId;
    if (nickname) query.nickname = nickname;

    let jasose = await Jasose.find(query).sort({ time: -1 }); // time을 기준으로 내림차순 정렬

    if(!jasose){
      return res.status(404).json({success: false, error:"저장된 데이터가 없습니다."})
    }
    res.status(200).json({ success: true, data: jasose });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
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
    // console.error('Error fetching problem:', error);
    res.status(500).json({ message: error.message });
  }
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
app.listen(port, () => {
  console.log(`${port}`)
});
