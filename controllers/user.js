const User = require("../models/user");

const userController = {
  signupform: (req, res) => {
    res.render("users/signup");
  },

  createUser: async (req, res) => {
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
  },

  loginform: (req, res) => {
    res.render("users/login");
  },

  loggedInuser: async (req, res) => {
    req.flash("success", `Welcome, ${req.user.username}.Happy Searching!`);
    const redirectUrl = res.locals.redirectUrl || "/listings"; // Fallback here

    res.redirect(redirectUrl);
  },

  logoutUser: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Logged out");
      res.redirect("/listings");
    });
  },
};

module.exports = userController;
