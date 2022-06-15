const express=require('express')
const router=express.Router();
const User=require('../models/user')
const catchAsync=require('../utils/catchAsync')
const passport = require('passport');
const users=require('../controllers/users')


router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.register))


router.route('/login')
.get(users.renderLogin)
.post(passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login'}),users.login)






router.post('/logout',(req,res)=>{
    // req.session.user_id=null;
    req.logout(()=>{
        req.flash('success','Goodbye')
    })
    
    // req.session.destroy()
  
    res.redirect('/campgrounds');
})



module.exports=router;