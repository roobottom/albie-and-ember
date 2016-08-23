'use strict';
//var css = require("css!./b.css");

require(['./bear.js'], function(bear) {
  for(var i in bear) {
    console.log(bear[i]);
  }
});
