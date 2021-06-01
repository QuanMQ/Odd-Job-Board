const express = require("express");
const passport = require("passport");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const { ensureAdminMod, ensureAdmin } = require("../middleware/access");
const { ensureAuth } = require("../middleware/auth");

// *@desc Admin page
// *@route GET /access/ad
router.get("/ad", ensureAuth, ensureAdminMod, ensureAdmin, (req, res) => {
  Job.findAll({
    where: { status: "pending" },
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("access/ad-dashboard", {
        name: req.user.firstName,
        jobs,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("error/500");
    });
});

// *@desc Moderator page
// *@route GET /access/mod
router.get("/mod", ensureAuth, ensureAdminMod, (req, res) => {
  Job.findAll({
    where: { status: "pending" },
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("access/mod-dashboard", {
        name: req.user.firstName,
        jobs,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("error/500");
    });
});

// *@desc Publish job
// *@route PUT /access/granted/:id
router.put("/granted/:id", ensureAuth, ensureAdminMod, async (req, res) => {
  try {
    let job = (await Job.findByPk(req.params.id)).dataValues;
    if (!job) {
      return res.render("error/404");
    }
    job = await Job.update(
      { status: "published" },
      { where: { id: req.params.id } }
    );

    if (req.user.role == "admin") {
      res.redirect("/access/ad");
    } else {
      res.redirect("/access/mod");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// *@desc Deny job
// *@route PUT /access/denied/:id
router.put("denied/:id", ensureAuth, ensureAdminMod, async (req, res) => {
  try {
    let job = (await Job.findByPk(req.params.id)).dataValues;
    if (!job) {
      return res.render("error/404");
    }
    job = await Job.update(
      { status: "denied" },
      { where: { id: req.params.id } }
    );

    if (req.user.role == "admin") {
      res.redirect("/access/ad");
    } else {
      res.redirect("/access/mod");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// *@desc Access denied page
// *@route GET /access/denied
router.get("/denied", (req, res) => {
  res.render("error/denied");
});

module.exports = router;
