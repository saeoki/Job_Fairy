const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리 하는 곳
  //클라이언트 쿠키에서 토큰을 가져옴 (cookie parser이용)
  let token = req.cookies.x_auth;

  //토큰을 복호화 한 후 user을 찾는다.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, err: true });

    req.token = token;
    req.user = user;

    next();
  });
  //user가 있으면 인증 okay
  //유저가 없으면 인증 no!
};

module.exports = { auth };
