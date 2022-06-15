const express=require('express')
const router=express.Router()
const Campground=require('../models/campground')



router.get('/',async(req,res)=>{
    const campground=await Campground.find({})
    res.render('payment',{campground})
    console.log(campground)
})


module.exports=router;