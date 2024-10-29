const mongoose = require('mongoose');

const FavoritesSchema = mongoose.Schema({
    kakaoId: {
        type: String,
        maxlength: 30,
        required : true,
    },
    nickname: { type: String, maxlength: 10 },
    data:{
        jasose: { 
            type: [String], // 자기소개서 ID 배열
            default: [] 
        },
        myeonjoeb: { 
            type: [String], 
            default: [] 
        },
        employment: { 
            type: [String], 
            default: [] 
        }
    },
},{ collection: 'favorites' });

const Favorite = mongoose.model('Favorites', FavoritesSchema);
module.exports = { Favorite }