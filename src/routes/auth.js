const express = require("express");
const passport = require("passport");
const router = express.Router();
const UserModule = require("../modules/user-module");

router.post("/signup", async (req, res) => {
  try {
    const candidate = await UserModule.findByEmail(req?.body);
    if (!candidate) {
      const user = await UserModule.create(req?.body);
      if (user.error) {
        return res.status(400).json({
          error: user.error,
          status: "error",
        });
      }
      res.json({ data: user, status: "ok" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/signin", passport.authenticate("local", { failureMessage: true }), (req, res) => {
  res.json({ auth: req.isAuthenticated() });
});

module.exports = router;
