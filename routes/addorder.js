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
        if (req.body.customerNumber) {
            if (req.body.lastName) {
                var libraryName = libraryMapping[req.body.lastName[0].toLowerCase()];
                sp_commonjs.sp.web.lists.getByTitle(libraryName).rootFolder.addSubFolderUsingPath(req.body.customerNumber + "/" + req.body.orderNumber).then((val) => {
                    updateProperties(libraryName + "/" + req.body.customerNumber + "/" + req.body.orderNumber, req.body);
                    AddOtherFolders(libraryName, req.body);
                    return res.json({ status: true });
                }).catch((err) => {
                    return res.json({ status: false, message: err.message });
                });
            } else {
                res.send({
                    status: false,
                    message: 'No lastName found'
                });
            }
        } else {
            res.send({
                status: false,
                message: 'No customerNumber found'
            });
        }
    }
});

function AddOtherFolders(libraryName, body) {
    sp_commonjs.sp.web.lists.getByTitle(libraryName).rootFolder.addSubFolderUsingPath(body.customerNumber + "/" + body.orderNumber + "/drafts");
    sp_commonjs.sp.web.lists.getByTitle(libraryName).rootFolder.addSubFolderUsingPath(body.customerNumber + "/" + body.orderNumber + "/final");
    sp_commonjs.sp.web.lists.getByTitle(libraryName).rootFolder.addSubFolderUsingPath(body.customerNumber + "/" + body.orderNumber + "/notes");
}

function updateProperties(path, body) {
    try {
        sp_commonjs.sp.web.getFolderByServerRelativePath(path).getItem().then((folderItem) => {
            sp_commonjs.sp.web.lists.getByTitle(path.split('/')[0]).items.getById(folderItem.ID).update({
                "PackageName": body.packageName
            });
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = router;