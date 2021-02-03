const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const sanitizeHtml=require('sanitize-html');
const passport = require("passport");
const User=require('../Models/User');
const Doctor=require('../Models/Doctor');
const auth=require('../Authentication/authenticate');

const DoctorRouter = express.Router();
DoctorRouter.use(bodyParser.json());
DoctorRouter.use(passport.initialize());
DoctorRouter.use(passport.session());

function sanitize(text){
    var ans=sanitizeHtml(text,{
      allowedTags: [ ],
      allowedAttributes: {}
    });
    return ans;
}

DoctorRouter.route("/dashboard").get(auth.checkIsDoctor,function(req,res){
    res.render('doctor_dashboard');
    })
   
module.exports = DoctorRouter;