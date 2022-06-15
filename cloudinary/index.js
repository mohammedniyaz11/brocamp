const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const campground = require('../models/campground');

cloudinary.config({
    cloud_name:"engin",
    api_key:"836114483171118",
    api_secret:"TmrX_Ny9nW0Z7WGG24Xmc80JI2M",

})
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'yelpcamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
}
})
module.exports = {
    cloudinary,

    storage
}