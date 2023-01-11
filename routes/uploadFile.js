"use strict";
var express = require("express");
var router = express.Router();
var sp_commonjs = require("@pnp/sp-commonjs");
var stream_1 = require("stream");
var multer_1 = require("multer");
var fs = require("fs");

var { sp, Web } = require("@pnp/sp-commonjs");

const UPLOAD_PATH = "uploads";
const upload = multer_1({ dest: `${UPLOAD_PATH}/` });

// sp_commonjs.sp.setup({
//   sp: {
//     fetchClientFactory: () => {
//       return new sp_commonjs.SPFetchClient(
//         "https://resumetarget.sharepoint.com/sites/DocsStorage",
//         "3ed5f372-b893-41ef-94b5-e51b487d5393",
//         "7e5xL0aJNHym5ZQPnvFbp8f/4v7/Wd1F6FhkOdteVhM="
//       );
//     },
//   },
// });

// var siteUrl = "https://resumetarget.sharepoint.com/sites/DocsStorage";

// var ctx = new sp.ClientContext(siteUrl);
// ctx.credentials = new sp.SharePointOnlineCredentials(
//   "developer@resumetarget.com",
//   "DevRT20220"
// );

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
  } else {
    try {
      console.log(req.body);

      if (req.body.path) {
        let file = req.file;
        const filePath = file.path;

        // Get the folder by folderName
        // const folder = await sp.web.getFolderByServerRelativeUrl(
        //   `/${libraryName}/${folderName}`
        // );
        const folder = await sp.web.getFolderByServerRelativeUrl(req.body.path);

        // Read the contents of the file to be uploaded
        const fileBuffer = await fs.readFileSync(filePath);
        // Add the file to the folder
        await folder.files.add(filePath, fileBuffer, true);

        res.json({ message: "File uploaded successfully" });
      } else {
        res.send({
          status: false,
          message: "No path found",
        });
      }
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: error.message, error: error });
    }

    // if (req.body.path) {
    // const data = fs_1.readFileSync(req.file.path);
    // sp_commonjs.sp.web
    //   .getFolderByServerRelativeUrl(req.body.path)
    //   .files.add(req.file.originalname, data, true)
    //   .then(() => {
    //     fs_1.unlinkSync(req.file.path);
    //     return res.json({ status: true });
    //   })
    //   .catch((err) => {
    //     return res.json({ status: false, message: err.message });
    //   });
    // } else {
    //   res.send({
    //     status: false,
    //     message: "No path found",
    //   });
    // }
  }
});

module.exports = router;

//  const path = "_spPageContextInfo.siteAbsoluteUrl/https://resumetarget.sharepoint.com/sites/DocsStorage";

// https://resumetarget.sharepoint.com/:w:/r/sites/DocsStorage/Shared%20Documents/Draft/Sharda%20Mohan%20Soomai%20Cover%20Letter%20DRAFT.docx?d=w19518b0f46cf4e2f97d9ff7ac8c582d9&csf=1&web=1&e=c84Pm0
