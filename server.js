const http = require('http');
const sp_commonjs = require('@pnp/sp-commonjs');
const nodejs_commonjs = require("@pnp/nodejs-commonjs");
const stream = require("stream");

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const addclient = require('./routes/addclient');
const routes = require('./routes/index');
const addorder = require('./routes/addorder');
const get = require('./routes/get');
var getallfile = require('./routes/getallfile');
var testdrive = require('./routes/testdrive');

app.get('/', routes);
app.use('/addclient', addclient);
app.use('/addorder', addorder);
app.use('/getallfile', getallfile);
app.use('/get', get);
app.use('/testdrive', testdrive);


var server = app.listen(port, function () {
    console.log('Test');
	makeRequest();
	
    //debug('Express server listening on port ' + server.address().port);
});

async function makeRequest() {

    // make a request to get the web's details
  //  const w = await sp_commonjs.sp.web();
  //  console.log(JSON.stringify(w, null, 2));
	
	sp_commonjs.sp.web.get()
		.then( w=> {
		console.log("Url : " + w.Url);
		console.log("Title : " + w.Title +"\nDesc: " + w.Description);
		console.log(JSON.stringify(w));
	  })
	  .catch((e) => {
		  console.log(e);
	  });
}

// get past no await at root of app


sp_commonjs.sp.setup({
    sp: {
        fetchClientFactory: () => {
           // return new nodejs_commonjs.SPFetchClient("https://testinglala.sharepoint.com/", "6d51376f-fc8a-478c-a605-da5bbf4e82d2", "JqbmPoTJ42Wgpc5UiJwgN9zYyXv42EwBunf57EMsUBI=");
            return new nodejs_commonjs.SPFetchClient("https://resumetarget.sharepoint.com/sites/DocsStorage/", //"6d51376f-fc8a-478c-a605-da5bbf4e82d2", "JqbmPoTJ42Wgpc5UiJwgN9zYyXv42EwBunf57EMsUBI=");
			"3ed5f372-b893-41ef-94b5-e51b487d5393", "7e5xL0aJNHym5ZQPnvFbp8f/4v7/Wd1F6FhkOdteVhM=");
        },
    },
});

//const server = http.createServer((req, res) => {
//    if (req.method === 'GET') {
//        if (req.url === '/') {
//            res.end(`<h1>Hello World</h1>`)
//        }
//        if (req.url === '/downloadfile') {
//            sp_commonjs.sp.web.getFileByServerRelativeUrl("/SiteAssets/Document.docx").getBuffer().then((blob)=>{
//            console.log(blob);
//            res.setHeader('Content-disposition', 'attachment; filename=' + 'Document.docx');
//            let readStream = new stream.PassThrough();
//            readStream.end(Buffer.from(blob));
//            return readStream.pipe(res);
//            res.end(`<h1>downloadfile</h1>`)
//            });            
//        }
//    } else if (req.method === 'POST') {
//        if (req.url === '/uploadfile') {
//            res.end(`<h1>UploadFile</h1>`)
//        }
//    }
//    //res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
//})

//server.listen(port, () => {
//    console.log(`Server listening on port ${port}`);
//})