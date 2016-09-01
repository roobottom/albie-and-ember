'use strict';

(function(w, d, undefined){

  var hasListener = !!w.addEventListener;
  var hasAttach = !!w.attachEvent;
  var hasClassList = !!d.body.classList;

  var opts = {
    pages: [],
    pageSelector: '.pg',
    pageLoaded: 'pg--loaded'
  };

  var init = function() {
    checkPageInView();
    bindEvent(w,'scroll',function() {
      checkPageInView();
    });
    bindEvent(w,'resize',function() {

    });
  };

  var bindEvent = function(el,event,cb) {
    if(hasListener) {
      el.addEventListener(event,cb);
    }
    if(hasAttach) {
      el.attachEvent(event,cb);
    }
  };

  var addClass = function(el,className) {
    if (hasClassList) {
      el.classList.add(className);
    }
    else {
      el.className += ' ' + className;
    }
  };

  var documentWidth = function() {
    return w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
  };
  var documentHeight = function() {
    return w.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
  };
  var documentScrollPosition = function() {
    return d.body.getBoundingClientRect().top * -1;
  };

  var pagesFactory = function() {
    opts.pages = [];
    var elements = document.querySelectorAll(opts.pageSelector);
    Array.prototype.forEach.call(elements, function(el, i){
      opts.pages.push(new pageConstrutor(el,getElmentOffset(el)));
    });
  };
  var pageConstrutor = function(el,offset) {
    this.el = el;
    this.offset = offset;
  };
  var getElmentOffset = function(el) {
    var bodyRect = d.body.getBoundingClientRect();
    var elemRect = el.getBoundingClientRect();
    return (elemRect.top - bodyRect.top);
  };

  var checkPageInView = function() {
    pagesFactory();
    opts.pages.forEach(function(obj) {
      if(obj.offset <= documentScrollPosition()) {
        addClass(obj.el,opts.pageLoaded);
      }
    });
  }

  init();

})(window, document);
