const Campground=require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const  mapBoxToken = "pk.eyJ1IjoiamFuY3lkZXZhc3N5IiwiYSI6ImNsM214MXMzYzA3d2gzbXM2bmhwcjZiOW8ifQ.kR00rELLyppOPQ6fqaMnYQ";
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary}=require('../cloudinary')






module.exports.index=async(req,res)=>{
const campgrounds=await Campground.find({isBooked:false})
  res.render('campgrounds/index',{campgrounds})
  
  
}
module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground=async(req,res,next)=>{

       const geoData= await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground=new Campground(req.body.campground);
    console.log(geoData.body.features[0])

    campground.geometry=geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
   
    campground.author=req.user._id;
     await campground.save();
     console.log(campground)
   
     req.flash('success','Successfully masde a new campground')
 
      res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async(req,res)=>{

    const campground=await Campground.findById(req.params.id).populate({path:'reviews',
   populate:{
       path:'author'
   }}).populate('author')
   

    if(!campground){
        req.flash('error','cant find that campground');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}


module.exports.renderEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    if(!campground){
        req.flash("error ","its alredy deleted")
    }
    res.render('campgrounds/edit',{campground})
    // console.log(campground._id)
 }


module.exports.updateCampground=async(req,res)=>{
    const{id}=req.params;
   const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
   const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
   campground.images.push(...imgs);
   await campground.save();
   req.flash('success','successfully updated campground')
   res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground=async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('error','successfully deleted campground')
    res.redirect('/campgrounds')
}


