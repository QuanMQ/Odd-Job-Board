const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Job = require("../models/Job");
const User = require("../models/User");

// *@desc Landing page
// *@route GET /
router.get("/", (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  Job.findAll({
    where: { status: "published" },
    order: [["createdAt", "DESC"]],
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("jobs/index", { jobs, req, isAuthenticated });
    })
    .catch((err) => {
      console.error(err);
      res.render("error/500", { isAuthenticated });
    });
});

// *@desc Dashboard
// *@route GET /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  Job.findAll({
    where: { userId: req.user.id },
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("dashboard", {
        name: req.user.firstName,
        jobs,
        isAuthenticated,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("error/500", { isAuthenticated });
    });
});

module.exports = router;
