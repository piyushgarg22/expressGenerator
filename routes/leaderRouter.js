const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will get all the leaders for you !");
  })
  .post((res, req, next) => {
    res.end(
      "Will add the leader with the name : " +
        req.body.name +
        " and description " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on leaders");
  })
  .delete((req, res, next) => {
    res.end("Deleting all the leaders for you !");
  });

leaderRouter
  .route("/:leaderId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "index/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will get the leader: " + req.params.leaderId);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on /leaders/");
  })
  .put((req, res, next) => {
    res.write("Updatng the leader : " + req.params.leaderId + '\n');
    res.end(
      "Updating the leader  Name : " +
        req.body.name +
        " and details : " +
        req.body.description
    );
  })
  .delete((req,res,next)=>{
      res.end("Deleting the leader : " + req.params.leaderId)
  });

module.exports = leaderRouter;
