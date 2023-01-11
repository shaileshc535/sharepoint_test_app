"use strict";
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send({ status: "true111111" });
  //res.render('index', { title: 'Express' });
});

router.get("/test", function (req, res) {
  res.send({ status: "sam0212122121" });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
