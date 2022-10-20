const express = require("express");
const passport = require("passport");
const router = express.Router();
const UserModule = require("../modules/user-module");
const Advertisements = require("../models/advertisements");
// const AdvertisementsModule = require("../modules/advertisements-module");

router.post("/advertisements", async (req, res) => {
  const { shortText, description, tags } = req?.body;

  try {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "авторизуйтесь" });
    const userId = req.user._id.toString();
    let images;

    if (req?.file) {
      const { path } = req?.file;
      images = path;
    }
    const advertisements = new Advertisements({ shortText, userId, description, images, tags });
    await advertisements.save();
    res.json({ data: advertisements, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
