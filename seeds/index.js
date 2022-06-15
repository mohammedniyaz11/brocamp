const express=require('express')
const app=express();
const path=require('path')
const mongoose=require('mongoose')
const Campground=require('../models/campground');
const { title } = require('process');
const cities=require('./cities')
const {places,descriptors}=require('./seed-Helpers')


mongoose.connect('mongodb://localhost:27017/yelp-campground', );

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        for(let i=0;i<50;i++){
            const random1000=Math.floor(Math.random()*1000)
            const price=Math.floor(Math.random()*20)+10;
            const camp=new Campground({
                author:"628d9ef8531a299bfabc4c40",
                title:`${sample(descriptors)},${sample(places)}`,
                location:`${cities[random1000].city},${cities[random1000].state}`,
              
                description:"Lorem ipsum dolor, sit ame fvgyhjokojhbgyfvgbhnjmk",
                price,
                geometry:{
                    type:'Point',
                    coordinates:[cities[random1000].longitude,cities[random1000].latitude]
                },
                images:[
                    {
                        url: 'https://res.cloudinary.com/engin/image/upload/v1653628387/yelpcamp/mm5bp5bni72crfcrbcfi.png',
                        filename: 'yelpcamp/mm5bp5bni72crfcrbcfi',
                    },
                    {
                        url: 'https://res.cloudinary.com/engin/image/upload/v1653628066/yelpcamp/lfsjfan6h1jnkdciqowy.png',
                        filename: 'yelpcamp/lfsjfan6h1jnkdciqowy',
                    }
                ]
               
            })
            await camp.save()
        }
    }                                         
}
// seedDB().then(()=>{
//     mongoose.connection.close()
// })  

seedDB()