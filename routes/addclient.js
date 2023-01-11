"use strict";
var express = require("express");
var router = express.Router();
var sp_commonjs = require("@pnp/sp-commonjs");
const { libraryMapping } = require("./Constants");

router.post("/", function (req, res) {
  console.log(req);
  if (!req.body) {
    res.send({
      status: false,
      message: "No body found",
    });
  } else {
    if (req.body.customerNumber) {
      if (req.body.lastName) {
        var libraryName = libraryMapping[req.body.lastName[0].toLowerCase()];
        sp_commonjs.sp.web.lists
          .getByTitle(libraryName)
          .rootFolder.addSubFolderUsingPath(req.body.customerNumber)
          .then((val) => {
            updateProperties(
              libraryName + "/" + req.body.customerNumber,
              req.body
            );
            return res.json({ status: true });
          })
          .catch((err) => {
            return res.json({ status: false, message: err.message });
          });
      } else {
        res.send({
          status: false,
          message: "No lastName found",
        });
      }
    } else {
      res.send({
        status: false,
        message: "No customerNumber found",
      });
    }
  }
});

function updateProperties(path, body) {
  try {
    sp_commonjs.sp.web
      .getFolderByServerRelativePath(path)
      .getItem()
      .then((folderItem) => {
        sp_commonjs.sp.web.lists
          .getByTitle(path.split("/")[0])
          .items.getById(folderItem.ID)
          .update({
            FirstName: body.firstName,
            LastName: body.lastName,
            CustomerNumber: body.customerNumber,
          });
      });
  } catch (e) {
    console.log(e);
  }
}

module.exports = router;
