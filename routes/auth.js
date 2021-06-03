const express = require("express");
const passport = require("passport");
const router = express.Router();
const { ensureGuest } = require("../middleware/auth");

// *@desc Login page
// *@route GET /auth/login
router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// *@desc Auth with Google
// *@route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// *@desc Google auth callback
// *@route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (req.user.role == "Admin") {
      res.redirect("/access/ad");
    } else if (req.user.role == "Moderator") {
      res.redirect("/access/mod");
    } else {
      res.redirect("/dashboard");
    }
  }
);

// *@desc Logout user
// *@route GET /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
