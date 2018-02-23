//##########
//## Copyright 2017 Jamf
//##
//## Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
//## documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
//## the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
//## and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//## The above copyright notice and this permission notice shall be included in all copies or substantial portions 
//## of the Software.
//##
//## THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//## TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
//## THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
//## CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
//## IN THE SOFTWARE.
//##########


//# set up very simple cors/https proxy.
//# http is optionally available, but is insecure and should only be
//# used in specific circumstances.
// express            : https://expressjs.com
// express-http-proxy : https://github.com/villadora/express-http-proxy
// cors               : https://github.com/expressjs/cors 
// morgan             : https://github.com/expressjs/morgan 

var app = require('express')();
var proxy = require('express-http-proxy');
var cors = require('cors');
var logger = require('morgan');

//### http/s usage ###
// The http proxy listener is by it's nature insecure.  All credentials are 
// sent to the proxy are done in plain text.  In general, it should not be
// used.
//
// However, if the proxy is being run on a local system with the intent of
// testing only, it may be acceptable to turn it on.
//
// The connection to a cloud instance JSS API is https only.
//
// The port numbers and instance name used here are examples.  They can be
// changed as needed.

var fs = require('fs');
//var http = require('http');  // http, insecure
//var http_port = 8000;  // http, insecure
var https = require('https');
var https_port = 8889;

var remote = "test.testing.org"

//### set https credentials ###
var ca_cert = fs.readFileSync('ca.pem', 'utf8');
var private_key = fs.readFileSync('server-key.pem', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var credentials = { ca: ca_cert, key: private_key, cert: certificate };


//### express app setup ###

// use cors headers
app.use(cors());

// set logger
var access_log = fs.createWriteStream('./access.log', {flags: 'a'});
app.use(logger('combined', {stream: access_log}));

// set proxy route
app.use('/api', proxy(remote, {
  https: true
}));


//### start service listener/s ###

//var http_server = http.createServer(app);  // http, insecure
var https_server = https.createServer(credentials, app);

//// http, listen on port 'http_port'  // http, insecure
//http_server.listen(http_port, function() {  // http, insecure
//  access_log.write('Proxy-http listening on port ' + http_port + '.\n');  // http, insecure
//});  // http, insecure

// https, listen on port 'https_port'
https_server.listen(https_port, function() {
  access_log.write('Proxy-https listening on port ' + https_port + '.\n');
});


