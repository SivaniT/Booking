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
const Appointment=require('./Models/Appointment');
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
  Doctor.find().populate('doctor_id','name id').populate('hospital_id').then((doctors,err)=>{
    res.render("book",{doctor:doctors});
  }).catch(err=>   req.flash('error',"Something went wrong!Try again!"));
});  
app.get("/doctors",function(req,res){
 
})
app.post("/time_slots",function(req,res){
 
  items=Appointment.find({doctor_id: mongoose.Types.ObjectId(req.body.doctor), appointment_date:new Date(req.body.app_date)}).then((slots,err)=>{
    let data=JSON.stringify(slots);
    console.log("hi");
    console.log(req.body.doctor+" "+req.body.app_date);
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
//var a=new Appointment({hospital_id:mongoose.Types.ObjectId('600d3c106c153f06743eddc1'),doctor_id:mongoose.Types.ObjectId('600d5c5b8508ae1c18114975'),user_id:mongoose.Types.ObjectId('600c57276784ec3b3488f2e6'),time_slot:"5:30-6:30",appointment_date:new Date("2021-2-18")})
//a.save()
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//mongoose.Types.ObjectId('4edd40c86762e0fb12000003');