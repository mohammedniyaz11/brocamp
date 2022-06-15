
const mongoose=require('mongoose')
var DateOnly = require('mongoose-dateonly')(mongoose);
const messageSchema = new mongoose.Schema({
    campground : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
   

    totalmembers:{
        type:Number,
    },
    date:{
        type:Date,
    },
    datenow:{
       type:Date,
    },
    campprice:{
        type:Number,
    },
   camppricededucted:{
       type:Number,
   },
   campricetopaid:{
       type:Number
   },


    isStatus:{
        type:String
    },
    createdAt: {type: Date, default: Date.now}

});
module.exports = mongoose.model('Message',messageSchema);