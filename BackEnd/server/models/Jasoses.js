const mongoose = require('mongoose');

const JasosesSchema = mongoose.Schema({
    kakaoId: {
        type: String,
        maxlength: 30,
        required : true,
    },
    nickname: { type: String, maxlength: 10 },
    data:{
        jasose: String,
        keyJasose: String,
        job: [String],
        keyword: [String]
    },
    time: { type: Number, default: Date.now() }
},{ collection: 'jasoses' });

const Jasose = mongoose.model('Jasoses', JasosesSchema);
module.exports ={ Jasose }