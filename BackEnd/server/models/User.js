const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
    id: {
        type: String,
        maxlength: 20,
    },
    name: {
        type: String,
        maxlength: 10,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
    },
    //토큰 유효기간
    tokenExp: {
        type: Number,
    },
});

//user 모델에 정보를 저장하기 전에 함수 수행
userSchema.pre("save", function (next) {
  var user = this;

  //password를 변경시킬 때만 암호화를 해준다!
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      //myPlaintextPassword = user.password : 실제 비밀번호
      //hash : 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    //다른것을 바꿀때는 그냥 next
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567 암호화된 비밀번호 :
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token 을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secreatToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //user._id + '' = token
  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decode) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
    user.findOne({ " _id": decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
