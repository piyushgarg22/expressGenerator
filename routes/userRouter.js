const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const authenticate = require("../authenticate");
const cors = require("./cors");
var User = require("../models/users");
var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  function (req, res, next) {
    // res.send("respond with a resource");
    User.find({}).then((users) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(users);
    });
  }
);

userRouter.post("/signup", cors.corsWithOptions, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});

userRouter.post(
  "/login",
  cors.corsWithOptions,
  passport.authenticate("local"),
  (req, res, next) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      status: "You are Successfully logged in !",
      token: token,
    });
  }
);

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

userRouter.get(
  "/facebook/token",
  passport.authenticate('facebook-token'),
  (req, res) => {
    if (req.user) {
      var token = authenticate.getToken({ _id: req.user._id }).toString();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "You are Successfully logged in !",
        token: token,
      });
    }
  }
);

module.exports = userRouter;
