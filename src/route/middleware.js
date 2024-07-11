const express = require("express");

const router = express.Router();

const dateTime = (req, res, next) => {
  req.datetime = new Date();
  req.name = " minh dep trai so 1 the gioi ";
  next();
};

router.use(dateTime);

router.get("/", (req, res) => {
  res.send(req.name);
});

module.exports = router;
