const express=require('express')
const router=express.Router()
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground=require('../models/campground');
const {camgroundSchema,reviewSchema}=require('../schemas.js')
const{isLoggedIn,isAuthor,validateCampground}=require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const campgrounds=require('../controllers/campgrounds')

// var instance = new Razorpay({
//     key_id: "rzp_test_wY8hZxuwmPBktH",
//     key_secret: "418xyezUCP3gUl1Fm3S419Um",
//   });




router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(upload.array('image'),catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body,req.file)
    //     res.send('its worked')
    // })

    router.get('/new',isLoggedIn,campgrounds.renderNewForm)

    
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,upload.array('image'),catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,catchAsync(campgrounds.deleteCampground))

    // router.get('/new',isLoggedIn,campgrounds.renderNewForm)
// router.post('/',catchAsync(campgrounds.createCampground))

router.get('/booking',(req,res)=>{
    res.send("booking")
})





// router.get('/:id',isLoggedIn,catchAsync(campgrounds.showCampground))




 router.get('/:id/edit',isLoggedIn,catchAsync(campgrounds.renderEditForm))





//  router.put('/:id',isLoggedIn,catchAsync(campgrounds.updateCampground))






// router.delete('/:id',isLoggedIn,catchAsync(campgrounds.deleteCampground))


module.exports=router;