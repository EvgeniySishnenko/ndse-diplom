const express = require("express");
const passport = require("passport");
const parser = require("body-parser");
const router = express.Router();
const Advertisements = require("../models/advertisements");
const AdvertisementsModule = require("../modules/advertisements-module");

// router.post("/advertisements", passport.authenticate("local", { failureMessage: true }), async (req, res) => {
router.post("/advertisements", async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.status(401).json({ msg: "Автоизуйтесь" });
    const userId = req.user._id.toString();
    const path = req?.file.path;
    const advertisements = await AdvertisementsModule.create({ data: req?.body, userId, path });
    res.json({ data: advertisements, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/advertisement", async (req, res) => {
  try {
    const advertisement = await Advertisements.find(req?.body);
    res.json({ data: advertisement, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.delete("/advertisements/:id", passport.authenticate("local", { failureMessage: true }), async (req, res) => {
router.delete("/advertisements/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.isAuthenticated()) return res.status(401).json({ msg: "Автоизуйтесь" });
    const result = await AdvertisementsModule.remove({ id, userId: req.user._id.toString() });

    if (result) return res.json({ data: { isDeleted: true }, status: "ok" });

    res.status(403).json({ msg: "Произошла ошибка при обновлении" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/advertisements", async (req, res) => {
  try {
    const advertisements = await Advertisements.find({ isDeleted: false });
    res.json({ data: advertisements, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/advertisements/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const advertisement = await Advertisements.findById(id);
    res.json({ data: advertisement, status: "ok" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
