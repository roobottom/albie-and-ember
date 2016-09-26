var gulp = require('gulp');
var gutil = require('gulp-util');
var markdownToJSON = require('gulp-markdown-to-json');
var marked = require('marked');
var connect = require('gulp-connect');
var del = require('del');
var data = require('gulp-data');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var nunjucks = require('gulp-nunjucks');
var autoprefixer = require('gulp-autoprefixer');
var fs = require('fs');

var paths = {
  templates: './pages/**/*'
};

marked.setOptions({
  smartypants: true
});


gulp.task('connect', function() {
  connect.server({
    root: 'docs'
  });
});

gulp.task('clean:html', function (done) {
  gulp.on('end', function () { done(); });
  return del([
    'docs/*.html'
  ]);

});
gulp.task('clean:js', function () {
  return del([
    'docs/*.js'
  ]);
});
gulp.task('clean:css', function () {
  return del([
    'docs/*.css'
  ]);
});
gulp.task('clean:assets', function () {
  return del([
    'docs/*.ico',
    'docs/*.png'
  ]);
});

gulp.task('copy',['copy:html','copy:assets']);

gulp.task('copy:html', ['clean:html','data'], function() {
  //var pageData = require('./data/pages.json');
  gulp.src(['./pages/**/*.html'])
  .pipe(data(function(file){
    return {pages: JSON.parse(fs.readFileSync('./data/data.json'))};
  }))
  .pipe(nunjucks.compile())
  .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, removeComments: true}))
  .pipe(gulp.dest('./docs/'));
});
gulp.task('copy:assets', ['clean:assets'], function() {
  gulp.src(['./assets/**/*'])
  .pipe(gulp.dest('./docs/'))
});

gulp.task('watch', function () {
  gulp.watch(['./pages/**/*','./data/**/*'],['copy']);
  gulp.watch(['./modules/**/*.js'],['js']);
  gulp.watch(['./less/**/*.less'],['less']);
});

gulp.task('js', ['clean:js'],function() {
  return gulp.src(['./modules/fn.js'])
  .pipe(uglify())
  .pipe(gulp.dest('docs/'));
});

gulp.task('less', ['clean:css'],function() {
  return gulp.src(['./less/b.less','./less/e.less'])
  .pipe(less({
    plugins: [],
    paths: [path.join(__dirname, 'less', 'includes')]
  }))
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(cleanCSS())
  .pipe(gulp.dest('docs/'));
});

//build a new data file from the pages markdown files.
gulp.task('data', function(done) {
  gulp.src('./data/**/*.md')
    .pipe(gutil.buffer())
    .pipe(markdownToJSON(marked, 'data.json'))
    .pipe(gulp.dest('./data'))
    .on('end', function () { done(); });
});

gulp.task('default', ['connect', 'copy', 'js', 'less', 'watch']);
gulp.task('build',['copy','js','less'])
