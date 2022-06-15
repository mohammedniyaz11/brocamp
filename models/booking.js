
const mongoose=require('mongoose')
var DateOnly = require('mongoose-dateonly')(mongoose);
const bookingSchema = new mongoose.Schema({
    campground : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    paymentBooking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
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
module.exports = mongoose.model('Booking', bookingSchema);