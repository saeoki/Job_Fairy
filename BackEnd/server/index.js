const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
// const config = require("./config/key");
const { auth } = require("./middleware/auth");
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
  // .connect("mongodb+srv://jobfairy3:hknucapstone1%401@job-fairy.3c684u9.mongodb.net/Job_Fairy?retryWrites=true&w=majority&appName=job-fairy")
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//app.use("/api", test);
app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});

app.post("/api/users/register", (req, res) => {
  //회원 가입 할 때 필요한 정보를 client 에서 가져오면 그것을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
app.post("/api/users/login", (req, res) => {
  //요청된 아이디를 데이터베이스에서 있는지 찾는다
  User.findOne({ id: req.body.id }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
      });
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호가 맞다면 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //token을 저장한다. 어디에? 쿠키 , 로컬스토리지, 세션 - > 나는 쿠키에 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//auth는 미들웨어
//미들웨어 : 리퀘스트 받고 콜백전 중간에서 해주는것
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 이야기를 auth가 true라는 말
  res.status(200).json({
    _id: req.user._id,
    //role이 0이면 일반유저, 0이 아니면 관리자로 표현
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    name: req.user.name,
    location: req.user.location,
    military: req.user.military,
    position: req.user.position,
    salary: req.user.salary,
    role: req.user.role,
  });
});

app.post('/api/auth/kakao', async (req, res) => {
  const { kakaoId, nickname } = req.body;

  try {
    let user = await User.findOne({ kakaoId });

    if (user) {
        // 사용자 정보 업데이트
        user.nickname = nickname;
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
const port = 5000;
app.listen(port, () => console.log(`${port}`));
