// const { type } = require('express/lib/response');
const mongoose=require('mongoose')
const Review=require('./review')
const Schema=mongoose.Schema;
const CampgroundSchema=new Schema({
    title:String,
    lat:Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
           
        },
        coordinates: {
            type: [Number],
       
        }
    },
    images:[{
        url:String,
        filename:String,
    }],
    price:Number,
    description:String,
    location:String,
    author:{ 
        type:Schema.Types.ObjectId,
        ref:'User'  
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }
    ],
    isBooked:{ 
        type:Boolean,
        default:false,  
    },

    
});


module.exports = mongoose.model('Campground', CampgroundSchema);


