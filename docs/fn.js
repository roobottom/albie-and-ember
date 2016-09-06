'use strict';

(function(w, d, undefined){

  var hasListener = !!w.addEventListener;
  var hasAttach = !!w.attachEvent;
  var hasClassList = !!d.body.classList;

  var opts = {
    pages: [],
    pageSelector: '.pg',
    pageLoaded: 'pg--loaded',
    navSelector: '.toc_l'
  };

  var init = function() {
    checkPageInView();
    //handle scroll
    bindEvent(w,'scroll',function() {
      checkPageInView();
    });
    //handle resize
    bindEvent(w,'resize',function() {

    });
    //handle user clicking on the nav links
    handlePageNavigation();
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
    var elements = d.querySelectorAll(opts.pageSelector);
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
  };

  //smooth scroll.
  var handlePageNavigation = function() {
    var navLinks = d.querySelectorAll(opts.navSelector);
    Array.prototype.forEach.call(navLinks, function(el, i){
      bindEvent(el,'click',function(e) {
        
      });
    });
  };

  init();

})(window, document);
