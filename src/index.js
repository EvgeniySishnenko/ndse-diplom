const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const MongoStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const socketIO = require("socket.io");
const http = require("http");
const { start } = require("./config/");
const authRouter = require("./routes/auth");
const User = require("./models/user");

const verify = async (email, password, done) => {
  try {
    const candidate = await User.findOne({ email });
    if (!candidate) return done(null, false);

    const areSame = await bcrypt.compare(password, candidate.passwordHash);
    if (!areSame) return done(null, false);

    return done(null, candidate);
  } catch (error) {
    return done(error);
  }
};

const options = {
  usernameField: "email",
  passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser(async (id, cb) => {
  try {
    const candidate = await User.findById(id);
    if (!candidate) cb(null, false);
    cb(null, candidate);
  } catch (error) {
    cb(error);
  }
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRouter);

const PORT = start.PORT;

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
    // await mongoose.connect("mongodb://root:example@mongo:27017/");

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
