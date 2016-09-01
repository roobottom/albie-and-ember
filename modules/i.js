'use strict';

(function(w, d, undefined){

  var hasListener = !!w.addEventListener;
  var hasAttach = !!w.attachEvent;
  var hasClassList = !!d.body.classList;

  w._albie = {
    i: function() {
      console.log('dom content loaded',hasListener,hasAttach,hasClassList);
    }
  };

  d.addEventListener("DOMContentLoaded", function(e) {
      w._albie.i();
  });

})(window, document);
