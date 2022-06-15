const express=require('express')
const app=express();
const router=express.Router()
const User=require('../models/user')  
const{isLoggedIn,isAuthor,validateCampground}=require('../middleware')


// app.get('/payments/:id',async(req,res)=>{
//     const{id}=req.params;
//   const foundProduct= await  Product.findById(id)
  
//   res.render('payments',{foundProduct})
// })














router.get('/user',isLoggedIn,async(req,res)=>{
const users=await User.find({})
res.render('admin/adminindex',{users})

})


router.get('/user/:id',async(req,res)=>{
    const{id}=req.params;
const viewUser=await User.findById(id)
res.render('admin/usershow',{viewUser})
})


router.get('/user/:id/edit',async(req,res)=>{
  const{id}=req.params;
  const user=await User.findById(id)
  res.render("admin/edituser",{user})
})






module.exports=router;