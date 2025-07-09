module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.session);
  console.log(req);
  if (!req.isAuthenticated()) {
    //redirect OriginalUrl after loggingIn
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to become a host");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
