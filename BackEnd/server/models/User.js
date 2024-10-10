const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
    kakaoId: {
        type: String,
        maxlength: 30,
        required : true,
        unique: true
    },
    nickname: { type: String, maxlength: 10 },
    location: { type: [String], maxlength: 40, default: ""},
    military: { type: String, maxlength: 8, default: ""},
    position: { type: [String], maxlength: 50, default: ""},
    salary: { type: [String], maxlength: 40, default: [2000,12000] },
    role: { type: Number, default: 0, },
    token: { type: String, },
    isUpdate: { type: Boolean, default: false, }
}, { collection: 'userinfo' });


// userSchema.statics.findByToken = function (token, cb) {
//   var user = this;
//   //user._id + '' = token
//   //토큰을 decode 한다.
//   jwt.verify(token, "secretToken", function (err, decode) {
//     //유저 아이디를 이용해서 유저를 찾은 다음에
//     //클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
//     user.findOne({ " _id": decode, token: token }, function (err, user) {
//       if (err) return cb(err);
//       cb(null, user);
//     });
//   });
// };

const User = mongoose.model("User", userSchema);
module.exports = { User };
