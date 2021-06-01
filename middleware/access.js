module.exports = {
  ensureAdminMod: function (req, res, next) {
    const userRole = req.user.role;
    if (userRole == "admin" || userRole == "moderator") {
      return next();
    } else {
      res.redirect("/access/denied");
    }
  },
  ensureAdmin: function (req, res, next) {
    const userRole = req.user.role;
    if (userRole == "admin") {
      return next();
    } else {
      res.redirect("/access/mod");
    }
  },
};
