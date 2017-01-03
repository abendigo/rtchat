'use strict';

const http = require('http');
const nodeStatic = require('node-static');

const SignalingService = require('./lib/signaling');



var fileServer = new(nodeStatic.Server)('./public');
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);


//SignalingService.foobar();
const service = new SignalingService(app);
