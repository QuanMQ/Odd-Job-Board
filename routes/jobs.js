const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Job = require("../models/Job");

// *@desc Show add page
// *@route GET /jobs/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("jobs/add");
});

// *@desc Process add form
// *@route POST /jobs
router.post("/", ensureAuth, async (req, res) => {
  let { title, reward, location, description, contact_email, contact_phone } =
    req.body;
  let errors = [];

  // *Validate Fields
  if (!title) {
    errors.push({ text: "Please add a title" });
  }
  if (!reward) {
    errors.push({ text: "Please add some reward" });
  }
  if (!location) {
    errors.push({ text: "Please add a location" });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact email" });
  }
  if (!contact_phone) {
    errors.push({ text: "Please add a contact phone" });
  }

  // *Check for errors;
  if (errors.length > 1) {
    res.render("jobs/add", {
      errors,
      title,
      reward,
      location,
      description,
      contact_email,
      contact_phone,
    });
  } else {
    try {
      req.body.userId = req.user.id;
      await Job.create(req.body);
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
});

module.exports = router;
