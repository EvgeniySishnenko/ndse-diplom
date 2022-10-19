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
const { start, MONGODB_URI, SESSION_SECRET } = require("./config/");
const authRouter = require("./routes/auth");
const advertisementsRouter = require("./routes/advertisements");
const User = require("./models/user");
const UserModule = require("./modules/user-module");

const verify = async (email, password, done) => {
  try {
    const user = await UserModule.findByEmail({ email });
    if (!user) return done(null, false);

    const areSame = await bcrypt.compare(password, user.passwordHash);
    if (!areSame) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const options = {
  usernameField: "email",
  passwordField: "password",
};

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    if (!user) cb(null, false);
    return cb(null, user);
  } catch (error) {
    cb(error);
  }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
    resavePath: true,
    saveUnitialized: false,
    store: store,
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
