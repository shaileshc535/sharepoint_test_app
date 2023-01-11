"use strict";
var express = require("express");
var router = express.Router();
var sp_commonjs = require("@pnp/sp-commonjs");
const { libraryMapping } = require("./Constants");

router.post("/", function (req, res) {
  res.send({
    status: false,
    message: "No lastName found",
  });
});

module.exports = router;
