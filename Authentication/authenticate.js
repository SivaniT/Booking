function checkAuthenticated(req, res, next) {
  if (req.user && req.user.role=="patient") {
    next();
  }
  else {
    req.flash('error','You are not logged in.Please login');
    res.redirect("/user/login");
  }
}
function checkIsAdmin(req,res,next){
  if(req.user && req.user.role=="admin"){
    next();
  }
  else{
    req.flash('error','You are not logged in as admin.Please login');
    res.redirect("/user/login");
  }
}

function checkIsDoctor(req,res,next){
  if(req.user && req.user.role=="doctor"){
    next();
  }
  else{
    req.flash('error','You are not logged in as admin.Please login');
    res.redirect("/user/login");
  }
}
module.exports = {
  checkAuthenticated:checkAuthenticated ,
  checkIsAdmin:checkIsAdmin,
  checkIsDoctor:checkIsDoctor
};

