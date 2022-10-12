const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const socketIO = require("socket.io");
const http = require("http");
const { start } = require("./config/");

const app = express();

const server = http.Server(app);
const io = socketIO(server);

const PORT = start.PORT;

app.get("/", (req, res) => {
  res.json({ title: "done" });
});

async function bootstrap() {
  try {
    await mongoose.connect("mongodb://root:example@mongo:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

    server.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
