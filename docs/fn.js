'use strict';

(function(w, d, undefined){

  var hasListener = !!w.addEventListener;
  var hasAttach = !!w.attachEvent;
  var hasHistory = !!w.history.pushState;
  var hasClassList = !!d.classList;

  var opts = {
    pages: [],
    pageSelector: 'section',
    pageTitle: 'Albie and Ember, a children\'s story'
  };

  var pagesArray = d.querySelectorAll(opts.pageSelector);

  var init = function() {
    loadStyles('e.css','screen');
    pagesFactory();
    checkPageInView();
    addPageNavigation();
    //handle scroll
    bindEvent(w,'scroll',function() {
      checkPageInView();
    });
    //handle resize
    bindEvent(w,'resize',function() {

    });
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

  var loadStyles = function(file,media) {
    if (!media) media='screen';
    var link = d.createElement('link');
    setAttr(link,{
      'href': file,
      'type': 'text/css',
      'rel':'stylesheet',
      'media':media
    });
    d.getElementsByTagName('head')[0].appendChild(link);
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

  var documentWidth = function() {
    return w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
  };
  var documentHeight = function() {
    return w.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
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
    setHashFromLocation(pageInView);
    return pageInView;
  };

  var setHashFromLocation = function(pageInView) {
    var page = getPagesFromHash();
    if(pageInView != page.current) {
      setPageTitle(pageInView);
      history.replaceState(null,null,'#p-'+pageInView);
    }
  };

  var setPageTitle = function(page) {
    d.title = 'Page ' + page + ': ' + opts.pageTitle;
  }

  var getPagesFromHash = function() {
    var pageInView = 1;
    if(w.location.hash) {
      pageInView = parseInt(w.location.hash.match(/\d+$/g)[0]);
    }
    var nextPage = pageInView + 1;
    if(opts.pages.length < nextPage) {
      nextPage = opts.pages.length;
    };
    var prevPage = pageInView - 1;
    if(prevPage < 1) {
      prevPage = 1;
    }
    var obj = {'current':pageInView,'next':nextPage,'prev':prevPage};
    return obj;
  }

  var addPageNavigation = function() {
    var pages = getPagesFromHash();
    //create menu wrapper
    var m = d.createElement('nav');
    setAttr(m,{
      'role':'menu',
      'aria-label':'Navigation controls'
    });


    //create back/forward elememts.
    var fw = d.createElement('a');
    setAttr(fw,{
      'href':'#p-' + pages.next,
      'role':'menuitem',
      'class':'fw',
      'aria-label': 'Jump to the next page, press the N or right arrow key.'
    });
    fw.innerHTML = 'Next Page <span class="menu_key">N</span><span class="menu_or"> or </span><span class="menu_key">&rarr;</span>';

    var bk = d.createElement('a');
    setAttr(bk,{
      'href':'#p-' + pages.prev,
      'role':'menuitem',
      'class':'bk',
      'aria-label': 'Jump to the next page, press the P or left arrow key.'
    });
    bk.innerHTML = 'Previous Page <span class="menu_key">P</span><span class="menu_or"> or </span><span class="menu_key">&larr;</span>';

    //handle next page click
    bindEvent(fw,['click','touchstart'],function() {
      var pages = getPagesFromHash();
      setAttr(this,{'href':'#p-' + pages.next});
      setPageTitle(pages.next);
    });

    //handle prev page click
    bindEvent(bk,['click','touchstart'],function() {
      var pages = getPagesFromHash();
      setAttr(this,{'href':'#p-' + pages.prev});
      setPageTitle(pages.prev);
    });

    //handle keypresses
    bindEvent(d,'keydown',function(e) {
      console.log(e);
      if(e.key == 'n' || e.key == 'ArrowRight') {
        fw.click();
      };
      if(e.key == 'p' || e.key == 'ArrowLeft') {
        bk.click();
      };
    });

    //put it all together.
    m.appendChild(bk);
    m.appendChild(fw);
    d.body.appendChild(m);
  };

  init();

})(window, document);
