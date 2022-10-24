const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const MongoStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const socketIO = require("socket.io");
const http = require("http");
const { start, MONGODB_URI, SESSION_SECRET } = require("./config/");
const authRouter = require("./routes/auth");
const advertisementsRouter = require("./routes/advertisements");
const User = require("./models/user");
const UserModule = require("./modules/user-module");
const fileMulter = require("./middleware/file");

const verify = (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    bcrypt.compare(password, user.passwordHash, (err, res) => {
      if (err) return done(err);
      if (res === false) return done(null, false, { message: "Некорректный пароль" });
      return done(null, user);
    });
  });
};

const options = {
  usernameField: "email",
  passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  return cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

const app = express();
app.use(fileMulter.single("images"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("src/public/img", express.static(path.join(__dirname, "/public/img")));

app.use(
  session({
    secret: SESSION_SECRET,
    resavePath: true,
    saveUnitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRouter);
app.use("/api", advertisementsRouter);

const PORT = start.PORT;

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
