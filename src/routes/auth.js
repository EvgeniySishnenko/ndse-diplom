const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req?.body;

  try {
    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({
        error: "email занят",
        status: "error",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, contactPhone: phone });
    await user.save();

    res.json({ data: user, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/signin", passport.authenticate("local", { failureMessage: true }), (req, res) => {
  res.json("авторизован");
});

module.exports = router;
