module.exports = {
  ensureAdminMod: function (req, res, next) {
    const userRole = req.user.role;
    if (userRole == "Admin" || userRole == "Moderator") {
      return next();
    } else {
      res.redirect("/access/denied");
    }
  },
  ensureAdmin: function (req, res, next) {
    const userRole = req.user.role;
    if (userRole == "Admin") {
      return next();
    } else {
      res.redirect("/access/denied");
    }
  },
  ensureMod: function (req, res, next) {
    const userRole = req.user.role;
    if (userRole == "Moderator") {
      return next();
    } else {
      res.redirect("/access/denied");
    }
  },
};
