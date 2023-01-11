"use strict";
var express = require("express");
var router = express.Router();
var sp_commonjs = require("@pnp/sp-commonjs");
var stream_1 = require("stream");

/* GET users listing. */
router.post("/", function (req, res) {
  if (!req.body) {
    res.send({
      status: false,
      message: "No body found",
    });
  } else {
    if (req.body.path) {
      var tempfileName = req.body.path.split("/");
      var fileName = tempfileName[tempfileName.length - 1];
      sp_commonjs.sp.web
        .getFileByServerRelativeUrl(req.body.path)
        .getBuffer()
        .then((blob) => {
          res.setHeader(
            "Content-disposition",
            "attachment; filename=" + fileName
          );
          let readStream = new stream_1.PassThrough();
          readStream.end(Buffer.from(blob));
          return readStream.pipe(res);
        })
        .catch((err) => {
          return res.json({ status: false, message: err.message });
        });
    } else {
      res.send({
        status: false,
        message: "No path found",
      });
    }
  }
});

module.exports = router;
