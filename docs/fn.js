'use strict';

(function(w, d, undefined){

  var hasListener = !!w.addEventListener;
  var hasAttach = !!w.attachEvent;
  var hasHistory = !!w.history.pushState;
  var hasClassList = !!d.classList;

  var opts = {
    pages: [],
    pageSelector: 'section',
    fontFile: 'fonts/abeezee.woff',
    headObjects: [
      {
        'tag':'link',
        'attrs':{
          'rel':'apple-touch-icon',
          'sizes':'180x180',
          'href':'apple-touch-icon.png'
        }
      },
      {
        'tag':'link',
        'attrs':{
          'rel':'icon',
          'type':'image/png',
          'href':'favicon-32x32.png',
          'sizes':'32x32'
        }
      },
      {
        'tag':'link',
        'attrs':{
          'rel':'icon',
          'type':'image/png',
          'href':'favicon-16x16.png',
          'sizes':'16x16'
        }
      },
      {
        'tag':'link',
        'attrs':{
          'rel':'manifest',
          'href':'manifest.json'
        }
      },
      {
        'tag':'link',
        'attrs':{
          'rel':'mask-icon',
          'href':'safari-pinned-tab.svg',
          'color':'#C8527E'
        }
      },
      {
        'tag':'meta',
        'attrs':{
          'name':'theme-color',
          'content':'#C8527E'
        }
      }
    ]
  };

  var pagesArray = d.querySelectorAll(opts.pageSelector);

  var init = function() {
    //load all extra <head/> items
    for(var i in opts.headObjects) {
      insertInHead(opts.headObjects[i].tag,opts.headObjects[i].attrs);
    }
    //pre-load the font, and only show it to the user when ready.
    var req = new XMLHttpRequest();
    req.open('GET', opts.fontFile, true);
    //this will force the browser to download the font file and cache it
    req.onload = function() {
      if (req.status >= 200 && req.status < 400) {
        addClass(d.body,'font-loaded');
        insertInHead('link',{
          'href': 'fonts.css',
          'type': 'text/css',
          'rel':'stylesheet',
          'media': 'screen'
        })
      }
    };
    req.send();
  };

  /*
  ---- Utilities (like my own mini jQuery. sortof. well, at least a way of writing less code.) ----
  */

  //bind event listener. event can be an event name string, or an array of event names.
  var bindEvent = function(el,event,cb) {
    if(typeof event === 'object') {
      for(var i in event) {
        el.addEventListener(event[i],cb);
      }
    }
    else {
      el.addEventListener(event,cb);
    }
  };

  var insertInHead = function(tag,attrs) {
    var newTag = d.createElement(tag);
    setAttr(newTag,attrs);
    d.getElementsByTagName('head')[0].appendChild(newTag);
  }

  //http://www.openjs.com/scripts/dom/class_manipulation.php
  //with a bit of fiddling from me!
  var hasClass = function(ele,cls) {
  	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  };
  var addClass = function(ele,cls) {
  	if (!hasClass(ele,cls)) {
      var classNames = ele.className.split(/\s+/);
      classNames.push(cls);
      ele.className = classNames.join(' ');
    }
  };
  var removeClass = function(el,cls) {
  	if (hasClass(el,cls)) {
  		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
  		ele.className=ele.className.replace(reg,' ');
  	}
  };

  var setAttr = function(el,attr) {
    for(var i in attr) {
      el.setAttribute(i,attr[i]);
    };
  };

  var documentScrollPosition = function() {
    return d.body.getBoundingClientRect().top * -1;
  };

  /*
  ---- Functionality ----
  */

  var pagesFactory = function() {
    opts.pages = [];
    Array.prototype.forEach.call(pagesArray, function(el, i){
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
    var pageInView = [];
    opts.pages.forEach(function(obj,i) {
      if(obj.offset <= documentScrollPosition()) {
        pageInView.push(i + 1);
      };
    });
    var pageInView = pageInView.pop();
    return pageInView;
  };


  init();

})(window, document);
