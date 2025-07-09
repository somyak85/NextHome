const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const registeredUser = await User.register(newuser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", `Welcome, ${req.user.username}.Happy Searching!`);
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", `Welcome, ${req.user.username}.Happy Searching!`);
    const redirectUrl = res.locals.redirectUrl || "/listings"; // Fallback here

    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logged out");
    res.redirect("/listings");
  });
});

module.exports = router;
