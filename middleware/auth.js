module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/auth/login");
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role == "Admin") {
        res.redirect("/access/ad");
      } else if (req.user.role == "Moderator") {
        res.redirect("/access/mod");
      } else {
        res.redirect("/dashboard");
      }
    } else {
      return next();
    }
  },
};
