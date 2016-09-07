# Albie and Ember.
Albie and Ember is a single page short story. It’s our entry into the [2016 10K Apart competition](https://a-k-apart.com/), where entrants were encouraged to build a web experience weighing less than 10Kb.

## Who made this?

Story and development by [Jon Roobottom](http://roobottom.com). Illustrations by Rachel Anderson. 

## Design Principals
The story was designed by following a few core principals:

* **Text first**: The basic experience should be just text, it should work for users who can only read (e.g., in [Lynx](http://lynx.browser.org/)) or hear text (e.g., in a screen reader).
* **Device agnostic**: Users should receive a core experience that’s useable regardless of device or screen size.
* **SVG reuse**: Shapes should be designed to be reused as much as possible by declaring shapes in `<defs>` and calling them with `<use>`.
* **Javascript is a second class citizen**: The core experience should work without Javascript. Nearly all of the 10Kb budget is given over to HTML/CSS/SVG. The expiation being a small bit of Javascript that lazy-loads an enhanced experience.
* **Keep enhanced files small**: Just because they’re not counted towards the budget, doesn’t mean lazy-loaded files should be bloated.

## Tools used

A number of tools were used to ensure production code is as small as possible, whilst keeping development code human-readable.

### Build tools

Some build tools were used to squeeze every last unneeded byte from this project. These are all run via a [Gulp](http://gulpjs.com/) build process. 

* [gulp-uglify](https://github.com/terinjokes/gulp-uglify): Cleans and minifies JS.
* [gulp-clean-css](https://github.com/scniro/gulp-clean-css): Cleans and minifies CSS.
* [gulp-htmlmin](https://github.com/jonschlinkert/gulp-htmlmin): Cleans and minifies HTML.

### Other tools

In addition to automatically minifying, I used a number of tools to help in keeping development code as trim as possible.

* [SVGOMG](https://jakearchibald.github.io/svgomg/) A fantastic tool to aid in compressing SVGs.

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
