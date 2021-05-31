const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Job = require("../models/Job");
const User = require("../models/User");

// *@desc Landing page
// *@route GET /
router.get("/", (req, res) => {
  Job.findAll({
    where: { status: "pending" }, // TODO Change to "published"
    order: [["createdAt", "DESC"]],
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("jobs/index", { jobs });
    })
    .catch((err) => {
      console.error(err);
      res.render("error/500");
    });
});

// *@desc Dashboard
// *@route GET /dashboard
router.get("/dashboard", ensureAuth, (req, res) => {
  Job.findAll({
    where: { userId: req.user.id },
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("dashboard", {
        name: req.user.firstName,
        jobs,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("error/500");
    });
});

module.exports = router;
