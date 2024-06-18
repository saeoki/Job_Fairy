const express = require("express");
const app = express();
const test = require("./Router/test");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있다.
app.use(bodyParser.urlencoded({ extended: true }));

//json 타입으로 된 것을 분석해서 가져올 수 있다.
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "입력한 이메일에 해당하는 정보가 없습니다.",
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
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
const port = 5000;
app.listen(port, () => console.log(`${port}`));
