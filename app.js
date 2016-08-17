'use strict';

var express = require('express');
var app = express();
var nunjucks = require('nunjucks');
var minifyHTML = require('express-minify-html');

let env = nunjucks.configure('pages/',{
    autoescape: false,
    cache: false,
    express: app,
});

app.use(minifyHTML({
    override:      true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

app.listen(3006, function () {
  console.log('server running at localhost:3006');
});

app.use(express.static('./assets'));

app.get('/', function (req, res) {
  res.render('index.html', {
      title: 'Home'
  });
});
