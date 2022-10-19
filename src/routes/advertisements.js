const express = require("express");
const passport = require("passport");
const router = express.Router();
const UserModule = require("../modules/user-module");
const { route } = require("./auth");
// const AdvertisementsModule = require("../modules/advertisements-module");

route.post("/advertisements", async (req, res) => {
  const { shortText, description, images, tags } = req.body;
  try {
    const advertisements = new Advertisements({ shortText, description, images, tags });
    // await advertisements.save();
    // res.json({ data: user, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
