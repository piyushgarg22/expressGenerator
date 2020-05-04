const express = require("express");
const bodyParser = require("body-parser");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send all the promotions to you !");
  })
  .post((req, res, next) => {
    res.end(
      "Will add the promoition: " +
        req.body.name +
        " with description : " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on promotions");
  })
  .delete((req, res, next) => {
    res.end("Deleting all the promotions.");
  });

promotionRouter
  .route("/:promoId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will get the details of promotion : " + req.params.promoId);
  })
  .post((req, res, next) => {
    res.statusCode = 200;
    res.end("POST not supported on /promotion/" + req.params.promoId);
  })
  .put((req, res, next) => {
    res.write("Updating the Promotion of " + req.params.promoId + "\n");
    res.end(
      "With the details of name : " +
        req.body.name +
        " and description " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("Deleting the promotion: " + req.params.promoId);
  });

module.exports = promotionRouter;
