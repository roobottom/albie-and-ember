'use strict';

(function(w, d, undefined){

  var hasListener = !!w.addEventListener;
  var hasAttach = !!w.attachEvent;
  var hasHistory = !!w.history.pushState;
  var hasClassList = !!d.classList;

  var opts = {
    pages: [],
    colors: [],
    pageSelector: '.pg',
    pageLoaded: 'pg--loaded',
    pageCurrent: 'pg--current',
    navSelector: '.toc_l'
  };

  var pagesArray = d.querySelectorAll(opts.pageSelector);

  var init = function() {
    checkPageInView();
    addPageNavigation();
    //initColors();
    //handle scroll
    bindEvent(w,'scroll',function() {
      checkPageInView();
      //replaceBgColor();
    });
    //handle resize
    bindEvent(w,'resize',function() {

    });
    //handle user clicking on the nav links
    handlePageNavigation();
    //handle hash change
    bindEvent(w,['hashchange','onhashchange'],function(e) {
      e.preventDefault();
      console.log(e);
    });
  };

  /*
  ---- Utilities (like my own mini jQuery. sortof. well, at least a way of writing less code.) ----
  */

  //bind event listener
  var bindEvent = function(el,event,cb) {
    var e = [event,event];
    if(typeof event === 'object') {
      e[0] = event[0]; e[1] = event[1];
    }
    if(hasListener) {
      el.addEventListener(e[0],cb);
    }
    if(hasAttach) {
      el.attachEvent(e[1],cb);
    }
  };

  //http://www.openjs.com/scripts/dom/class_manipulation.php
  //with a bit of fiddling from me!
  var hasClass = function(ele,cls) {
  	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  };
  var addClass = function(ele,cls) {
  	if (!hasClass(ele,cls)) {
      var classNames = ele.className.split(/\s+/);
      classNames.push(cls);
      console.log(ele.className = classNames.join(' '));
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
    var pageInView = null;
    opts.pages.forEach(function(obj,i) {
      removeClass(obj.el,opts.pageCurrent);
      if(obj.offset <= documentScrollPosition()) {
        addClass(obj.el,opts.pageLoaded);
        pageInView = {el: obj.el, id: i};
      };
      if(obj.offset == documentScrollPosition() + 10 || obj.offset == documentScrollPosition() - 10) {
        addClass(obj.el,opts.pageCurrent);
      }
    });
    return pageInView;
  };

  //replace background colour on scroll http://stackoverflow.com/questions/16844723/change-background-color-on-scroll
  var replaceBgColor = function() {
    if(opts.colors.length > 0) {
      var el = d.getElementsByTagName('body')[0]; // Element to be scrolled
      var length = opts.colors.length; // Number of colors
      var height = Math.round(documentHeight());

      var i = Math.floor(documentScrollPosition() / height);  // Start color index
      var dN = documentScrollPosition() % height / height;    // Which part of the segment between start color and end color is passed
      var c1 = opts.colors[i].hsl;                            // Start color
      var c2 = opts.colors[(i+1)%length].hsl;                 // End color
      var h = c1[0] + Math.round((c2[0] - c1[0]) * dN);
      var s = c1[1] + Math.round((c2[1] - c1[1]) * dN);
      var l = c1[2] + Math.round((c2[2] - c1[2]) * dN);
      d.body.style['background-color'] = ['hsl(', h, ', ', s+'%, ', l, '%)'].join('');
    };
  };
  //init the colours.
  var initColors = function() {
    Array.prototype.forEach.call(pagesArray, function(el, i){
      if(w.getComputedStyle) {
        var rgb = w.getComputedStyle(el).getPropertyValue('background-color');
        var rgbA = rgb.replace(' ','').replace(/rgba?\(/g,'').replace(/\)/g,'').split(',');
        var hsl = rgbToHsl(parseInt(rgbA[0]),parseInt(rgbA[1]),parseInt(rgbA[2]));
        //store page colours
        opts.colors.push({rgb: rgb, hsl: hsl});
        //remove css backgrounds
        el.style.backgroundColor = 'transparent';
      };
    });
    //set new bg
    replaceBgColor();
  };

  //rbgToHsl
  function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}

  //smooth scroll.
  var handlePageNavigation = function() {
    var navLinks = d.querySelectorAll(opts.navSelector);
    Array.prototype.forEach.call(navLinks, function(el, i){
      bindEvent(el,'click',function(e) {
        e.preventDefault();
        var to = parseInt(this.textContent) - 1;
        smoothScroll(500,documentScrollPosition(),opts.pages[to].offset);
      });
    });
  };

  var smoothScroll = function(speed,fromPos,toPos) {
    var pxPerMs = 13; //Pixel distance to travel each ms
    var hops = (speed - (speed % pxPerMs)) / pxPerMs; //Number of hops in this animation
    var gap = Math.round((toPos - fromPos) / hops); //Gap between the current position and traget position
    speed = Math.round(speed / hops); //Speed as a function of hops
    doSmoothScroll(false,hops,1,speed,fromPos,gap);
  };

  var doSmoothScroll = function(flag,hops,runs,speed,fromPos,gap) {
    if(!flag) {
      setTimeout(function() {
        var easedGap = easeInOutSine(runs,fromPos,runs*gap,hops);
        w.scrollTo(0, easedGap);
        if(hops===runs) {
          doSmoothScroll(true,hops,runs,speed,fromPos,gap);
        }
        else {
          doSmoothScroll(false,hops,runs+1,speed,fromPos,gap);
        }
      },speed);
    }
    else {
      return;
    }
  };

  var addPageNavigation = function() {

    //create menu wrapper
    var m = d.createElement('nav');
    setAttr(m,{
      'role':'menu',
      'aria-label':'Navigation controls'
    });

    //create back/forward elememts.
    var fw = d.createElement('a');
    fw.setAttribute('href','#p-2');

    //put it all together.
    m.appendChild(fw);

    d.body.appendChild(m);
  };

  //easeOut function
  //t:time,b:start val,c:change in val,d:duration
  var easeInOutSine = function (t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  };

  init();

})(window, document);
