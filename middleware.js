const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    const{id}=req.params;
    const camground=await Campground.findById(id);
    if(!camground.author.equals(req.user._id)){
        req.flash("error","you do not have any permission to do that!!")
        return res.redirect(`/campgrouds/${id}`)
    }
    next()

}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const{reviewId}=req.params;
    const review=await Review.findById(id);
    if(!review.author.equals(req.user._id)){
        req.flash("error","you do not have any permission to do that!!")
        return res.redirect(`/campgrouds/${id}`)
    }
    next()

}





