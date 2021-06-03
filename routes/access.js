const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const {
  ensureAdminMod,
  ensureAdmin,
  ensureMod,
} = require("../middleware/access");
const { ensureAuth } = require("../middleware/auth");
const { Op } = require("sequelize");

// *@desc Administration routing
// *@route GET /access
router.get("/", ensureAuth, (req, res) => {
  const userRole = req.user.role;
  if (userRole == "Admin") {
    res.redirect("/access/ad");
  } else if (userRole == "Moderator") {
    res.redirect("/access/mod");
  } else {
    res.redirect("/access/denied");
  }
});

// *@desc Admin page
// *@route GET /access/ad
router.get("/ad", ensureAuth, ensureAdmin, async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  try {
    // *Get all pending jobs
    const jobs = (
      await Job.findAll({
        where: { status: "pending" },
        include: User,
      })
    ).map((job) => job.dataValues);

    // *Get all users
    const users = (
      await User.findAll({
        where: {
          role: {
            [Op.or]: ["User", "Moderator"],
          },
        },
      })
    ).map((user) => user.dataValues);

    res.render("access/ad-dashboard", {
      name: req.user.firstName,
      jobs,
      users,
      isAuthenticated,
    });
  } catch (err) {
    console.error(err);
    return res.render("error/500", { isAuthenticated });
  }
});

// *@desc Edit role
// *@route PUT /access/role/:userId
router.put("/role/:userId", ensureAuth, ensureAdmin, async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  try {
    let user = (await User.findByPk(req.params.userId)).dataValues;
    if (!user) {
      return res.render("error/404", { isAuthenticated });
    }
    user = await User.update(
      { role: req.body.role },
      { where: { id: req.params.userId } }
    );

    res.redirect("/access/ad");
  } catch (err) {
    console.error(err);
    return res.render("error/500", { isAuthenticated });
  }
});

// *@desc Moderator page
// *@route GET /access/mod
router.get("/mod", ensureAuth, ensureMod, (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  Job.findAll({
    where: { status: "pending" },
    include: User,
  })
    .then((jobsArr) => {
      const jobs = jobsArr.map((job) => job.dataValues);
      res.render("access/mod-dashboard", {
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

// *@desc Publish job
// *@route PUT /access/granted/:id
router.put("/granted/:id", ensureAuth, ensureAdminMod, async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  try {
    let job = (await Job.findByPk(req.params.id)).dataValues;
    if (!job) {
      return res.render("error/404", { isAuthenticated });
    }
    job = await Job.update(
      { status: "published" },
      { where: { id: req.params.id } }
    );

    if (req.user.role == "Admin") {
      res.redirect("/access/ad");
    } else {
      res.redirect("/access/mod");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500", { isAuthenticated });
  }
});

// *@desc Deny job
// *@route PUT /access/denied/:id
router.put("/denied/:id", ensureAuth, ensureAdminMod, async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  try {
    let job = (await Job.findByPk(req.params.id)).dataValues;
    if (!job) {
      return res.render("error/404", { isAuthenticated });
    }
    job = await Job.update(
      { status: "denied" },
      { where: { id: req.params.id } }
    );

    if (req.user.role == "Admin") {
      res.redirect("/access/ad");
    } else {
      res.redirect("/access/mod");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500", { isAuthenticated });
  }
});

// *@desc Access denied page
// *@route GET /access/denied
router.get("/denied", (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  res.render("error/denied", { isAuthenticated });
});

module.exports = router;
