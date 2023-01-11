'use strict';
var express = require('express');
var router = express.Router();
var sp_commonjs = require('@pnp/sp-commonjs');

router.post('/', function (req, res) {
    if (!req.body) {
        res.send({
            status: false,
            message: 'No body found'
        });
    } else {
        if (req.body.path) {
            sp_commonjs.sp.web.getFileByServerRelativePath(req.body.path).delete().then(() => {
                return res.json({ status: true });
            }).catch((err) => {
                return res.json({ status: false, message: err.message });
            });
        } else {
            res.send({
                status: false,
                message: 'No path found'
            });
        }
    }
});

module.exports = router;