const User=require('../models/user')



module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}


module.exports.register=async(req,res,next)=>{
    

    try{
    const{email,username,password,number}=req.body;



   const user= new User({email,username,number});
   if(req.body.adminCode==="secretcode123"){
       user.isAdmin=true;
   }
   const registerUser=await User.register(user,password);
   req.login(registerUser,err=>{
       if(err) return next(err);
       req.flash('success','welcome to yelpcamp')
       res.redirect('/campgrounds')
   })

    }catch(e){
        req.flash('error',e.message)
        res.redirect('register')
    }




}



module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}


module.exports.login=(req,res)=>{
    req.flash('success','welcomeback')
    // console.log(req.body.username)
    res.redirect('/campgrounds')

}









