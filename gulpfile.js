var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var del = require('del');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var nunjucks = require('gulp-nunjucks');
var autoprefixer = require('gulp-autoprefixer');

var pageData = require('./data/pages.json');

var paths = {
  templates: './pages/**/*',
  assets: './assets/**/*'
};


gulp.task('connect', function() {
  connect.server({
    root: 'docs'
  });
});

gulp.task('clean:html', function () {
  return del([
    'docs/**/*.html'
  ]);
});
gulp.task('clean:static', function () {
  return del([
    'docs/images'
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

gulp.task('copy',['copy:assets','copy:html']);
gulp.task('copy:assets', ['clean:static'], function() {
  gulp.src(['./assets/**/*'])
  .pipe(gulp.dest('./docs/'));
});

gulp.task('copy:html', ['clean:html'], function() {
  gulp.src(['./pages/**/*.html'])
  .pipe(nunjucks.compile(pageData))
  .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, removeComments: true}))
  .pipe(gulp.dest('./docs/'));
});

gulp.task('watch', function () {
  gulp.watch(['./pages/**/*','./data/**/*'],['copy']);
  gulp.watch(['./modules/**/*.js'],['js']);
  gulp.watch(['./less/**/*.less'],['less']);
});

gulp.task('js', ['clean:js'],function() {
  return gulp.src(['./modules/fn.js'])
  //removing the uglify step for dev ±±±±±± PUT THIS BACK.
  //.pipe(uglify())
  .pipe(gulp.dest('docs/'));
});

gulp.task('less', ['clean:css'],function() {
  return gulp.src('./less/**/b.less')
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

gulp.task('default', ['connect', 'copy', 'js', 'less', 'watch']);
gulp.task('build',['copy','js','less'])
