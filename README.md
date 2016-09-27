# Albie and Ember.
[Albie and Ember](https://roobottom.github.io/albie-and-ember/) is a single page short story. It’s our entry into the [2016 10K Apart competition](https://a-k-apart.com/), where entrants were encouraged to build a web experience weighing less than 10Kb.

## Who made this?

Story and development by [Jon Roobottom](http://roobottom.com). Design by [Rachel Anderson](http://www.rachelandersondesign.me). 

## Design Principals
The story was designed by following a few core principals:

* **Text first**: The basic experience should be just text, it should work for users who can only read (e.g., in [Lynx](http://lynx.browser.org/)) or hear text (e.g., in a screen reader).
* **Device agnostic**: Users should receive a core experience that’s useable regardless of device or screen size.
* **SVG reuse**: Shapes should be designed to be reused as much as possible by declaring shapes in `<defs>` and calling them with `<use>`.
* **Javascript is a second class citizen**: The core experience should work without Javascript. Nearly all of the 10Kb budget is given over to HTML/CSS/SVG. The exception being a small bit of Javascript that lazy-loads an enhanced experience.
* **Keep enhanced files small**: Just because they’re not counted towards the budget, doesn’t mean lazy-loaded files should be bloated.

## How this project attempts to meet the judging criteria

### Accessibility (10 points)

* Wide use of Aria tags and roles
* Contrast of `background-color` and `color` is tested AA complient. 

### Interoperability (10 points)

* The basic experience is tested in:
	* IE9,10,11
	* Edge latest
	* Chrome latest
	* Safari latest
	* An assortment of Android devices
	* An assortment of Apple devices
	* An assortment of Windows devices
	* The lynx browser (via [Lynxlet](http://habilis.net/lynxlet/) on mac)
	* A **Colour-in Albie and Ember** print experience is delivered via `@media print`


### Performance (40 points)

* SVGs all optimised and reused as much as possible.
* HTML, CSS and JS are all conservatively written
* A custom build process helps compress everything even more.
* Editing is made easy by the use of (the excellent) [Nunjucks](https://mozilla.github.io/nunjucks/) templates and a custom markdown build process.
* All JS is custom and tweaked for performance.

### Progressive enhancement (20 points)

* This is, at its heart, a story. If nothing else is possible, the basic story text should be accessible to all browsers.
* A functionality Javascript is lazy loaded. This then loads-in other assets (including the font) in a non blocking way.
 * `@media all` is used to cut the mustard, to isolate some of the more advanced css from older browsers that might mangle it.

### Usefulness or Novelty (10 points)

* Well, it’s an original story!

### Design & User Experience (10 points)

* 

## Tools used

A number of tools were used to ensure production code is as small as possible, whilst keeping development code human-readable.

### Build tools

Some build tools were used to squeeze every last unneeded byte from this project. These are all run via a [Gulp](http://gulpjs.com/) build process. 

* [gulp-uglify](https://github.com/terinjokes/gulp-uglify): Cleans and minifies JS.
* [gulp-clean-css](https://github.com/scniro/gulp-clean-css): Cleans and minifies CSS.
* [gulp-group-css-media-queries](https://github.com/avaly/gulp-group-css-media-queries): Gathers all your like-for-like media queries together at the end of your css.
* [gulp-htmlmin](https://github.com/jonschlinkert/gulp-htmlmin): Cleans and minifies HTML.

### Other tools

In addition to automatically minifying, I used a number of tools to help with magnification and accessibility checking.

* [SVGOMG](https://jakearchibald.github.io/svgomg/) A fantastic tool to aid in compressing SVGs.
* [a11y](https://addyosmani.com/a11y/) A CLI test suite for accessibility auditing. (This project has 100% pass rate)

## API

### development

You can run `gulp` commands directly:

* `gulp` builds the site and start the devlopment server on port `8080`
* `gulp build` builds the site, but doesn't run a server

### Live

Running `npm start` will:

* Install all dependancies.
* Build out the site to the `docs` folder
* Start an expressjs server with gzip compression enabled on port `3030`
