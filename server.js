'use strict';
var express = require('express');
var app = express();
var compression = require('compression');

app.use(compression());
app.listen(process.env.PORT || 3030);
app.use(express.static(__dirname + '/_site', {
  maxAge: '365d'
}));
console.log('server running at http://localhost:3030');
