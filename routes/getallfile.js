'use strict';
var express = require('express');
var router = express.Router();
var sp_commonjs = require('@pnp/sp-commonjs');
const { libraryMapping } = require('./Constants');

router.post('/', function (req, res) {
    if (!req.body) {
        res.send({
            status: false,
            message: 'No body found'
        });
    } else {
        if (req.body.lastName) {
            var libraryName = libraryMapping[req.body.lastName[0].toLowerCase()];
            if (req.body.customerNumber) {
                if (req.body.path) {
                    getAllItems(req.body.path, req.body.isWriter, function (val) {
                        res.send({
                            status: true,
                            items: val
                        });
                    });
                    
                } else {
                    getAllItems(libraryName + "/" + req.body.customerNumber, req.body.isWriter, function (val) {
                        res.send({
                            status: true,
                            items: val
                        });
                    });
                }
            } else {
                res.send({
                    status: false,
                    message: 'No path found'
                });
            }
        } else {
            res.send({
                status: false,
                message: 'No lastName found'
            });
        }
    }
});

function getAllItems(path,isWriter,callback) {
    var finalArray;
    try {
        var count = 2;
        var value1;
        var value2;
        sp_commonjs.sp.web.getFolderByServerRelativePath(path).folders.get().then((val) => {
            count--;
            value1 = val;
            if (count == 0) {
                finalArray = value1.concat(value2);
                if (!isWriter) {
                    finalArray = finalArray.filter((t) => { return t["Name"] !== "notes" });
                }
                callback (finalArray);
            }
        });
        sp_commonjs.sp.web.getFolderByServerRelativePath(path).files.get().then((val2) => {
            count--;
            value2 = val2;
            if (count == 0) {
                finalArray = value1.concat(value2);
                if (!isWriter) {
                    finalArray = finalArray.filter((t) => { return t["Name"] !== "notes" });
                }
                callback (finalArray);
            }
        });
    } catch (e) {
        return (e);
    }
}

module.exports = router;