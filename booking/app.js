const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const ejs = require("ejs");
var passport = require('passport');
var mongoose = require('mongoose');
const session = require('express-session');
const userRouter=require('./Routes/Users');
const DoctorRouter=require('./Routes/Doctors');
const AdminRouter=require('./Routes/Admin');

const User=require('./Models/User');
const Hospital=require('./Models/Hospital');
const Doctor=require('./Models/Doctor');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Express Middleware for serving static files
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret:"secret",
  resave:false, //this means session variables are not resaved if nothing/ is changed
  saveUninitialized:false, //this means we dont want to save empty value in session if there is no value 
 cookie:{maxAge:315360000}
}))

app.use(passport.initialize());
app.use(passport.session());
const flash = require('connect-flash');
//const { isNull } = require("lodash");
app.use(flash());
const initializePassport=require('./Authentication/passport-config')(passport);
const auth=require('./Authentication/authenticate');
app.use(function(req, res, next) {
  // make all error and success flash messages available from all templates
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  // make user session data available from within view templates
  res.locals.user = req.user;
  next();
})


app.get("/",function(req,res){
    res.render("home");
});  

app.use('/user', userRouter);
app.use('/doctor', DoctorRouter);
app.use('/admin', AdminRouter);

app.get("/booking",function(req,res){
  res.render("book");
});  
app.get("/doctors",function(req,res){
  Doctor.find().populate('doctor_id','name').populate('hospital_id').then((doctors,err)=>{
    console.log(doctors[1]);
    res.render("doctors",{doctors:doctors});
  }).catch(err=>   req.flash('error',"Something went wrong!Try again!"));
})
app.post("/time_slots",function(req,res){
  let date=req.body.text;
  console.log(date);
  items=User.find().then((slots,err)=>{
    let data=JSON.stringify(slots);
   return res.json({slots: data})
  }).catch(err=>   req.flash('error',"Something went wrong!Try again!"))
});

app.post("/booking",function(req,res){
  console.log("hurray");
  res.render("book");
}); 

app.get("/checking",auth.checkIsAdmin,function(req,res){
  console.log("admin logged in");
  res.render("home");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
