
const mongoose=require('mongoose')
var DateOnly = require('mongoose-dateonly')(mongoose);
const paymentSchema = new mongoose.Schema({
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
    isStatus:{
        type:String
    },
    createdAt: {type: Date, default: Date.now}

});
module.exports = mongoose.model('Payment', paymentSchema);