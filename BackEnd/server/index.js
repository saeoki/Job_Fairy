const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const { Problem } = require("./models/Problem")
// const config = require("./config/key");
const cors = require('cors');

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
  // .connect(process.env.MONGO_URI)
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


const port = 5000;
app.listen(port, () => console.log(`${port}`));
