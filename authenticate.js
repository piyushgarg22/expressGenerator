var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var User = require("./models/users");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");

var config = require("./config");

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600,
  });
};

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: " + jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
          console.log('1')
        return done(err, false);
      } else if (user) {
        console.log('2')
        return done(null,user);
      } else {
        console.log('3')
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
