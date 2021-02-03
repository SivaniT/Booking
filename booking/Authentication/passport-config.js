const LocalStrategy = require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const User=require('../Models/User');
function initialize(passport) {
  const authenticateUser =(req,email, password,done)=> {
    User.findOne({email:email}).then(user=>{
      if(!user){
      //   req.flash('error','This email is not registered');
        return done(null,false,req.flash('error','This email is not registered'));
      }
      //Match password
      bcrypt.compare(password,user.password,(err,isMatch)=>{
        if(err){
           //  req.flash('error','Something went wrong!Please try again.');
          throw err;
        }
        if(isMatch){
          return done(null,user); 
        }
        else{
           req.flash('error','Password Incorrect');
          return done(null,false, req.flash('error','Password Incorrect'));
        }
      });
    }).catch(err=> req.flash('error','Something went wrong!Please try again.') );
  }

  passport.use(new LocalStrategy({ usernameField: 'email' , passReqToCallback : true}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id,(err,user)=>{
    done(err,user);
    })
  })
}

module.exports = initialize;