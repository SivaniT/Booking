const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');
const sanitizeHtml=require('sanitize-html');
const passport = require("passport");
const User=require('../Models/User');
const auth=require('../Authentication/authenticate');

const AdminRouter = express.Router();
AdminRouter.use(bodyParser.json());
AdminRouter.use(passport.initialize());
AdminRouter.use(passport.session());

function sanitize(text){
    var ans=sanitizeHtml(text,{
      allowedTags: [ ],
      allowedAttributes: {}
    });
    return ans;
}

module.exports = AdminRouter;