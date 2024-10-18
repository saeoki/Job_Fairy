const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);
module.exports = { User };
