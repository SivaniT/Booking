const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const sanitizeHtml=require('sanitize-html');
const nodemailer = require('nodemailer');
const passport = require("passport");
const User=require('../Models/User');
const auth=require('../Authentication/authenticate');
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
      phone: sanitize(req.body.phone),
      role: sanitize(req.body.role)
    })
   await user.save(); 
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
  }
});

// Step 2
let mailOptions = {
  from: process.env.EMAIL, // TODO: email sender
  to: req.body.email, // TODO: email receiver
  subject: 'Thank you for registering',
  text: 'Your username is '+req.body.name+' and your password is '+req.body.password+'. Have a nice day!'
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
    req.flash('error',"Your account is created successfully!Could not send email!");
    console.log(err);
    res.redirect('/user/login');
      }
  else{
  req.flash('success',"Your account is created successfully!Password is sent to your mail");
  res.redirect('/user/login');
  }
});
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
  
UserRouter.route("/booking").get(auth.checkAuthenticated,function(req,res){
  
});
module.exports = UserRouter;