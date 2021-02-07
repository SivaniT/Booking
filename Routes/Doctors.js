const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const sanitizeHtml=require('sanitize-html');
const passport = require("passport");
const User=require('../Models/User');
const Appointment=require('../Models/Appointment');
const Doctor=require('../Models/Doctor');
const auth=require('../Authentication/authenticate');
var moment = require('moment');

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

DoctorRouter.route("/dashboard").get(auth.checkIsDoctor,async function(req,res){
  //var d=moment().format('YYYY-MM-DD');
  var d=new Date('2021-2-17')
  var d=moment(d).format("YYYY-M-D");
  var d_id;
  await Doctor.find({doctor_id:req.user.id}).then((doctor,err)=>{
   d_id=doctor[0].id;
  })
  console.log("doctor dasdboard"+d_id+" "+d);
  await Appointment.find({doctor_id: d_id, appointment_date:d}).populate('user_id','name').then((data,err)=>{
    console.log("doctor data"+data);
    res.render('doctor_dashboard',{data: data});
  })
})
   
module.exports = DoctorRouter;