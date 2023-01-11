"use strict";
var debug = require("debug");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var sp_commonjs = require("@pnp/sp-commonjs");
var nodejs_commonjs = require("@pnp/nodejs-commonjs");
var { SPFetchClient } = require("@pnp/nodejs-commonjs");

var routes = require("./routes/index");
var downloadFile = require("./routes/downloadFile");
var uploadFile = require("./routes/uploadFile");
var addclient = require("./routes/addclient");
var addorder = require("./routes/addorder");
var deletefile = require("./routes/deletefile");
var getallfile = require("./routes/getallfile");
var testdrive = require("./routes/testdrive");
//var get = require('./routes/get');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/addclient", addclient);
app.use("/addorder", addorder);
app.use("/downloadfile", downloadFile);
app.use("/uploadfile", uploadFile);
app.use("/deletefile", deletefile);
app.use("/getallfile", getallfile);
app.use("/testdrive", testdrive);
//app.use('/get', get);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  res.send({ status: false });
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

sp_commonjs.sp.setup({
  sp: {
    fetchClientFactory: () => {
      return new nodejs_commonjs.SPFetchClient(
        "https://resumetarget.sharepoint.com/sites/DocsStorage",
        "5e9d09ba-8184-4c76-aab2-b563993a59c1",
        "DwZ1WFuvx4I+fj59cpwNY9Eq3PXa3leJAsbblrwIi0w="
      );
    },
  },
});

async function makeRequest() {
  // make a request to get the web's details
  //  const w = await sp_commonjs.sp.web();
  //  console.log(JSON.stringify(w, null, 2));

  sp_commonjs.sp.web
    .get()
    .then((w) => {
      console.log("Url : " + w.Url);
      console.log("Title : " + w.Title + "\nDesc: " + w.Description);
      console.log(JSON.stringify(w));
    })
    .catch((e) => {
      console.log(e);
    });
}

// makeRequest();

app.set("port", process.env.PORT || 8080);

var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + server.address().port);
  makeRequest();
});

// new Client Id = "5e9d09ba-8184-4c76-aab2-b563993a59c1"
// old Client Id = "3ed5f372-b893-41ef-94b5-e51b487d5393"

// new Client_Secret = "DwZ1WFuvx4I+fj59cpwNY9Eq3PXa3leJAsbblrwIi0w="
// old Client_Secret = "7e5xL0aJNHym5ZQPnvFbp8f/4v7/Wd1F6FhkOdteVhM="

// The app identifier has been successfully created.
// Client Id:  	5e9d09ba-8184-4c76-aab2-b563993a59c1
// Client Secret:  	DwZ1WFuvx4I+fj59cpwNY9Eq3PXa3leJAsbblrwIi0w=
// Title:  	11Jant2023App
// App Domain:  	www.localhost.com
// Redirect URI:  	https://localhost.com

{
  /* <AppPermissionRequests AllowAppOnly="true">
  <AppPermissionRequest
    Scope="http://sharepoint/content/sitecollection"
    Right="FullControl"
  />
</AppPermissionRequests>; */
}

// tannet Id = i:0i.t|ms.sp.ext|5e9d09ba-8184-4c76-aab2-b563993a59c1@517f3a4c-6d3c-4136-b48c-149ec4ed6acb

//resource  = 00000003-0000-0ff1-ce00-000000000000/resumetarget.sharepoint.com@5e9d09ba-8184-4c76-aab2-b563993a59c1
