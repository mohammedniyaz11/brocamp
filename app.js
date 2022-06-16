if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  
}




const dbUrl="mongodb://localhost:27017/bro-camps"
const mongoSanitize = require('express-mongo-sanitize');
const nodemailer=require('nodemailer')
const fast2sms = require('fast-two-sms')
const payment=require('./models/payment')
const express=require('express')
const app=express();
const path=require('path')
const mongoose=require('mongoose')
const catchAsync=require('./utils/catchAsync')
const { title } = require('process');
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const Joi=require('joi')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const LocalStrategy=require('passport-local')
const {camgroundSchema,reviewSchema}=require('./schemas.js')
const User=require('./models/user')
const Campground=require('./models/campground')
const campgrounds=require('./routes/campground')
const review=require('./routes/review')
const user=require('./routes/users')
const multer=require('multer')
const bcrypt=require('bcrypt')
const Admin=require('./models/admin')
const admin=require('./routes/admin')
const Razorpay=require('razorpay')
// const booking=require('./models/booking');
const campground = require('./models/campground');
const { replaceOne, update } = require('./models/user');
const { response } = require('express');
// const booking = require('./models/booking');
const booking = require('./models/booking');
const message=require('./models/message')
const { isLoggedIn } = require('./middleware');

// const payment = require('./models/payment');
// const booking = require('./models/booking');
///database connections

const MongoDBStore = require("connect-mongo");
var instance = new Razorpay({
    key_id: "rzp_test_gDNJhOY4BSTbti",
    key_secret: "K7JzaPqDtuZ4zMbawwSoVQ1t",
  });




mongoose.connect( dbUrl, );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//middlewares template collections
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
//validate from
app.use(express.static('public'))

//validate review


//routes



app.get('/',(req,res)=>{
    res.render('admin/home')
})

// const store=new MongoDBStore({
//     url:dbUrl,
//     secret:'this is houl db url store',
//     touchAfter: 24 * 60 * 60


// })

// store.on('erroe',function(e){
//     console.log('session store error',e)
// })




app.use(methodOverride('_method'))
const sessionConfig={
    store:  MongoDBStore.create({
        mongoUrl:dbUrl,
      }),
    name:'blah',
    secret:'this is shoube a better secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7

    }
}



app.use(session(sessionConfig))
app.use(flash());





app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(mongoSanitize());

app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error')
    next();
   
})



// s


app.use('/campgrounds',campgrounds)
app.use('',review)
app.use('/',user)
app.use('/payment',payment)
app.use('',admin)
///reviews

// //admin part






























app.get('/payments/:id',isLoggedIn,async(req,res)=>{
    const{id}=req.params;
    const campground=await Campground.findById(id)
  
    res.render('campgrounds/payment',{campground})
})





app.post('/payments/:id',isLoggedIn,async(req,res)=>{
  
  
        let date = req.body.date
        let  totalmembers = req.body.totalmembers
        let campid = req.body.campid
        let campprice = req.body.campprice
        let user = req.body.user
    // console.log("---------------------");
    // console.log(req.body.date,"===req.body.date");
    // console.log(req.body.totalmembers,"===req.body.totalmembers");
    // console.log(req.body.campid,"===req.body.campid");
    // console.log(req.body.campprice,"===req.body.campprice");
    // console.log(req.body.user,"===req.body.user");
    
    
     
    
    const{id}=req.params;
        const campground=await Campground.findById(id)
        console.log("campground id is",campground._id)
        booking.campground=campground._id
      
    
    
    
        const camp=new payment({
            campground:campground._id,
            author:req.user._id,
            totalmembers:req.body.totalmembers,
            date:req.body.date,
            campprice:req.body.campprice,
            datenow:req.body.datenow,
            isStatus:"Pending",                         
        })
    
    
    const campBook=await camp.save()
    console.log(campBook,"=======campBook")
    console.log(camp.date)
    console.log(camp.datenow)
    let campiprice=camp.datenow.getDate()-camp.date.getDate()+1
    console.log("campiprice is=====",campiprice)
    const price=campBook.campprice*campiprice;
    const bookstatus= await payment.updateOne({_id:campBook.id},{ $set:{campprice:price} })
    console.log(bookstatus)
    res.redirect(`/booking/${campBook._id}`)
    
    })


// app.get('/califorina',async(req,res)=>{
//   const cali=await Campground.find( {location:"california"})
// res.ren
// })



app.get('/sortlow',isLoggedIn,async (req,res)=>{
 const campgrounds= await Campground.aggregate(
        [
          { $sort : { price : 1 } }
        ]
     )
     res.render('campgrounds/sortlow',{campgrounds})
})








app.get('/sorthigh',isLoggedIn,async (req,res)=>{
    const campgrounds= await Campground.aggregate(
           [
             { $sort : { price : -1 } }
           ]
        )
        res.render('campgrounds/sortlow',{campgrounds})
   })

app.get('/booking/:id',isLoggedIn,async(req,res)=>{
    const{id}=req.params;
    const bookingdetails=await payment.findById(id)
   console.log("payments of  the campground is",bookingdetails)
    res.render('admin/booking',{bookingdetails})
   
})






app.post('/booking/:id',isLoggedIn,async(req,res)=>{
    let date = req.body.date
    let  totalmembers = req.body.totalmembers
    let campid = req.body.campid
    let campprice = req.body.campprice
    let user = req.body.user
console.log("---------------------");
console.log(req.body.date,"===req.body.date");
console.log(req.body.totalmembers,"===req.body.totalmembers");
console.log(req.body.campid,"===req.body.campid");
console.log(req.body.campprice,"===req.body.campprice");
console.log(req.body.user,"===req.body.user");


 

const{id}=req.params;
    const paymentstatus=await payment.findById(id)
    console.log("campground id id",paymentstatus)
    // payement.campground=campground._id
    // console.log("the booking camp is ",booking.campground)


    const camp=new booking({
        campground:paymentstatus.campground,
        author:req.user._id,
        paymentBooking:paymentstatus._id,

        totalmembers:req.body.totalmembers,
        date:paymentstatus.date,
        campprice:req.body.campprice,
        datenow:paymentstatus.datenow,
        isStatus:"Pending",                         
    })

 console.log(paymentstatus)
const campBook=await camp.save()
console.log("=======ater campBook",camp)
console.log(camp.date)
console.log(camp.datenow)
// let campiprice=camp.datenow.getDate()-camp.date.getDate()+1
// console.log("campiprice is=====",campiprice)
// const price=campBook.campprice*campiprice;



// const bookstatus= await booking.updateOne({_id:campBook.id},{ $set:{campprice:price} })
generateRazorPay(campBook._id,campprice).then((response) =>{
    // console.log(typeof campBook.campprice, "price")
    console.log("the response is ",response)
    res.json(response)
  })


})



const generateRazorPay=(orderId,total)=>{
      
    return new Promise((resolve,reject)=>{
           var options ={
               amount:total*100,
               currency: "INR",
               receipt: ""+orderId,
           };
           instance.orders.create(options,function(err,order){
               if(err){
                   console.log(err,"RazorPay Error");
               }
               
               resolve(order)
           })

    })
}


const verifyPayment=(details)=>{
    console.log("========",details)
   

    return new Promise(async(resolve,reject)=>{
         const {
            createHmac
          } = await import('node:crypto');

          let hmac = createHmac('sha256', "K7JzaPqDtuZ4zMbawwSoVQ1t");
          
            hmac.update(details.payment.razorpay_order_id + '|'+details.payment.razorpay_payment_id);
            hmac=hmac.digest('hex')
            if(hmac==details.payment.razorpay_signature){
                console.log("response",response)
                resolve(response)
            } else{
                
                reject()
            }

    })
}

const changePaymentStatus=(bookingId)=>{
    console.log("the booking id",bookingId)
   
   
    return new Promise(async(resolve,reject)=>{
        const bookingis= await booking.findById(bookingId)
        console.log("the booking is",bookingis)
        
        const bookingModel= await booking.updateOne({_id:bookingId},{ $set:{isStatus:"Booked"} })
        console.log("booked campground is,",bookingModel)
        const changePaymentStatus= await payment.updateOne({_id:bookingis.paymentBooking},{ $set:{isStatus:"Booked"} })
        console.log(changePaymentStatus)
        const changecampStatus = await Campground.updateOne({_id:bookingis.campground},{ $set: {isBooked:true}
        
        
    }).then(()=>{

        resolve()
      
    })
})
    
}










app.post('/user/verify-payment',(req,res)=>{

    verifyPayment(req.body).then(()=>{
        console.log(req.body.order.receipt,"=========req.body.order.receipt");
          changePaymentStatus(req.body.order.receipt).then(()=>{

            console.log("payment Sucessful");
           
            res.json({status:true})
            res.send("its success")
          }).catch((err) =>{
              console.log(err.message,"second then error");

          })
    }).catch((err)=>{
      
      res.json({status:false,errMsg:''})
     })
  })


app.get('/campground/success',(req,res)=>{
    const{id}=req.params;
    res.render('campgrounds/success')
})

app.get('/bookeduser',async (req,res)=>{
    const bookingname= await booking.find({isStatus:"Booked"}).populate('author').populate('campground')
   
    res.render('campgrounds/booked',{bookingname})
})


app.get('/report',async (req,res)=>{
    const bookingname= await booking.find({isStatus:"Booked"}).populate('author').populate('campground')
    const count=await booking.find({isStatus:"Booked"}).count()
    const totalCamp=await Campground.find().count()
    const totalCampbooked=await Campground.find({isBooked:true}).count()
    const totalCamponSale=await Campground.find({isBooked:false}).count()
    const totalbookedoverall=await payment.find({isStatus:"Booked"}).count()
    const totalcancel=await  message.find().count()
    console.log("total cancel",totalcancel)






   
    const sum2= await payment.aggregate([  { $match: {isStatus:"Booked" } },     { $group: { _id: null, amount: { $sum: "$campprice" } } } ])
  totalAmountCollected= sum2[0].amount
  console.log("total amount collected",totalAmountCollected)
    const cancellamount=await message.aggregate([{ $group: { _id: null, amount: { $sum: "$campprice" } } } ])
    totalCancelAmount=cancellamount[0].amount
    console.log('total cancel amount',totalCancelAmount)
    totalSum=sum2[0].amount-cancellamount[0].amount;
    console.log('total sum is ======',totalSum)

    const amountrefundedbycancelledclient=await message.aggregate([{ $group: { _id: null, amount: { $sum: "$camppricededucted" } } } ])
     amountRefunded=amountrefundedbycancelledclient[0].amount
    res.render('admin/report',{bookingname,count,totalSum,totalCamp,totalCampbooked,totalCamponSale,totalbookedoverall,totalcancel,amountRefunded,totalAmountCollected})
})







///cancel

app.post('/bookeduser/:id',async(req,res)=>{
    const{id}=req.params;
    const bookingname= await booking.findById(id)
 const  isDeducted= bookingname.campprice*0.3
 console.log("===========",typeof(isDeducted))
 console.log("=============",isDeducted)
 const  isPaid= bookingname.campprice*0.7
 console.log("paid=========",isPaid)
    const cancelBooking=new message({
        campground:bookingname.campground,
        author:bookingname.author,
        totalmembers:bookingname.totalmembers,
        date:bookingname.date,
        datenow:bookingname.datenow,
        campprice:bookingname.campprice,
        camppricededucted:isDeducted,
        campricetopaid:isPaid,
        isStatus:"NotPaid"




    })
    const cancelledBooking=await cancelBooking.save()
    
    console.log("cancel bokking is",cancelledBooking)




  const updateone=  await booking.findByIdAndUpdate(id,{$set:{isStatus:"Pending"} })
const campground= await Campground.updateOne({_id:bookingname.campground}, { $set: {isBooked:false}})

console.log(campground)
  console.log(updateone)
    res.render('admin/cancel',{cancelBooking})
})












app.get('/adminregister',(req,res)=>{
    res.render('users/adminregiester')
})

app.get('/cancelmessage',async(req,res)=>{
    const cancelledBookingMessage=await message.find().populate('campground').populate('author')

    res.render('admin/cancelbooking',{cancelledBookingMessage})
})


app.post('/cancelmessage/:id',async(req,res)=>{
    const{id}=req.params
 
    console.log("hello world")
    const cancelledbooking=await message.findById(id)
    const ispaid= await message.updateOne({_id:cancelledbooking._id}, { $set: {isStatus:"Paid"}})
    console.log("==========is paid id=======",ispaid)
    res.redirect('/cancelmessage')
   
    

})

app.post('hello',(req,res)=>{
    console.log("hellobhai")
})








app.post('/bookeduser/:id/deliverd',async(req,res)=>{
    const{id}=req.params;
    const bookingname= await booking.findById(id)
  const updateone=  await booking.findByIdAndUpdate(id,{$set:{isStatus:"Pending"} })
const campground= await Campground.updateOne({_id:bookingname.campground}, { $set: {isBooked:false}})
const updateoneanddelete=  await booking.findByIdAndDelete(id)

console.log(campground)
  console.log(updateone)
    res.redirect('/bookeduser')
})









app.get('/bookeduser/:id',async(req,res)=>{
    const{id}=req.params;
    const booked= await booking.findById(id).populate('author').populate('campground')
    res.render('campgrounds/viewbookdetails',{booked})
    // res.send("hello world")

})                                                    

//fats t 2 sms
app.post('/sendmessage/:id', async(req, res) => {
const{id}=req.params;
const bookeduser=await booking.findById(id).populate('author');
console.log(bookeduser.author.email)
sendMessage(`hey ${bookeduser.author.username} ,your campground booked on ${bookeduser.date},${bookeduser.datenow} on price${bookeduser.campprice}
${bookeduser.totalmembers}`,
req.body.number,res)  



function sendMessage(message,number,res) {
    var options = {
      authorization:
        "LTnoI5LilwebuFj5y86q7roQUh0IED0tcB61Xd3M6H9O3aXNm2trikSIsQQe",
      message:message,
      numbers: [number],
    };

    // send this message

    fast2sms
      .sendMessage(options)
      .then((response) => {
        res.send("your  Campground Sent Successfully")
      })
      .catch((error) => {
        res.send("Some error taken place")
      });
}
   
 
   
})





//mail send
app.post('/sendmail/:id',isLoggedIn,async(req,res)=>{
    const{id}=req.params;
    const mail=await booking.findById(id).populate('author')
    console.log("the mail",mail)
    const transport=nodemailer.createTransport(
      {
        service: 'gmail',
        auth: {
          user: 'mohemmedniyaz11@gmail.com',
          pass: 'yznnjadtqjfhisxx'
        }
      });
       console.log("reciepents email is ======",req.body)
      var mailOptions = {
        from: 'mohemmedniyaz11@gmail.com',
        to: req.body.email,
        subject: 'Booking is done on Bro-camp',
        text: `hey ${mail.author.username} ,your campground booked on ${mail.date},${mail.datenow} on price${mail.campprice}
        ${mail.totalmembers}`
      };
       
      transport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
         res.send('mail has been sent')
        }
        console.log(req.body)
      }
    )
  
})








 
//Coupon
app.get('/coupon',(req,res)=>{
    res.render('admin/coupon')
})














app.get('/search',async(req,res)=>{
    let key =req.query.search;
    
 
    try{
    let details=await Campground.findOne({
        "$or":[
            {title:{$regex:key}},
            {location:{$regex:key}},
        ]
    })
//    console.log(details._id)

   res.redirect(`campgrounds/${details._id}`)
       
}catch(e){
    req.flash('error',"there no campgrounds")
}

})






app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404))
})

app.use((err,req,res,next)=>{
    const{statusCode=500,message='something went wrong'}=err;
    if(!err.message) err.message="oh no,something went wrong"
    res.status(statusCode).render('error',{err})
   
})

//admin part























app.listen(3000,()=>{
    console.log(`serving on port 3000`)
})

