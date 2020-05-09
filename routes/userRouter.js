const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

var User = require("../models/users");
var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

userRouter.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

userRouter.post("/login", passport.authenticate("local"), (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, status: "You are Successfully logged in !" });
});

userRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in !");
    res.status = 403;
    next(err);
  }
});

module.exports = userRouter;
