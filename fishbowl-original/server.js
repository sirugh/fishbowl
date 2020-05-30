var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var port = process.env.PORT || 8080;
/**
 * Server
 */
app.use(express.static(path.join(__dirname, 'www')));

http.listen(port, function() {
  console.log('listening on : %s', port);
});