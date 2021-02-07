const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const sanitizeHtml=require('sanitize-html');
const passport = require("passport");
const User=require('../Models/User');
const Doctor=require('../Models/Doctor');
const Appointment=require('../Models/Appointment');
const auth=require('../Authentication/authenticate');
const mail=require('../Mail');
require('dotenv').config();

const UserRouter = express.Router();
UserRouter.use(bodyParser.json());
UserRouter.use(passport.initialize());
UserRouter.use(passport.session());

function sanitize(text){
  var ans=sanitizeHtml(text,{
    allowedTags: [ ],
    allowedAttributes: {}
  });
  return ans;
}

 UserRouter.route("/register").get(function(req,res){
  res.render('register');
  })
  .post(async function(req,res){
  try{
   await  User.findOne({email: sanitize(req.body.email)})
    .then(async (user) => {
      if(user != null) {
         req.flash('error',"Email already exists.Try with another email");
        res.redirect('/user/register');
      }
      else{
    const hashedPassword=await bcrypt.hash( sanitize(req.body.password),10);
    const user=new User({
      name: sanitize(req.body.name),
      email: sanitize(req.body.email),
      password: sanitize(hashedPassword),
      phone: sanitize(req.body.phone)
    })
   await user.save(); 
   mail(req,res,req.body.email,'Your username is '+req.body.name+' and your password is '+req.body.password+'. Have a nice day!',"Your account is created successfully!Password is sent to your mail",'/user/login',"Your account is created successfully!Could not send email!",'/user/register');  
  }
    })}
    catch(err){
       req.flash('error',"WRONGGG!Try again!");
       console.log(err);
       res.redirect('/user/register');
    };
});
UserRouter.route("/login").get(function(req,res){
    res.render('login');
  })
  .post(passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash:true
  }))
  
UserRouter.route("/logout").get(auth.checkAuthenticated,function(req,res){
    req.flash('success',"You logged out successfully");
     req.session.destroy();
     res.clearCookie('session-id');
     res.redirect('/');
});

UserRouter.route("/dashboard").get(auth.checkAuthenticated,function(req,res){
  Appointment.find({user_id: req.user.id}).populate({
    path: 'doctor_id',
    model: 'Doctor',
    populate: {
      path: 'doctor_id',
      model: 'User'
    }
  }).populate('hospital_id').then((data,err)=>{
    res.render('patient_dashboard',{data: data});
  })
});
UserRouter.route("/filter").post(async function(req,res){
  console.log(req.body.gender+" "+req.body.doctor);
  var e=req.body.experience;
  if(e== "elow"){
    Doctor.find({ gender: req.body.gender||"Male", speciality:req.body.doctor }).sort([["experience",1]]).populate('doctor_id','name id').populate('hospital_id').then((doctors,err)=>{
      console.log(doctors);
       res.render("book",{doctor:doctors});
     }).catch(err=>   req.flash('error',"Something went wrong!Try again!"));
  }
  else{
  Doctor.find({ gender: req.body.gender||"Male", speciality:req.body.doctor }).sort([["experience",-1]]).populate('doctor_id','name id').populate('hospital_id').then((doctors,err)=>{
   console.log(doctors);
    res.render("book",{doctor:doctors});
  }).catch(err=>   req.flash('error',"Something went wrong!Try again!"));
}
})

module.exports = UserRouter;

  
