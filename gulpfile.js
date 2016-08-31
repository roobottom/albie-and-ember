var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var del = require('del');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var nunjucks = require('gulp-nunjucks');

var pageData = require('./data/pages.json');

var paths = {
  templates: './pages/**/*',
  assets: './assets/**/*'
};

var webpackConfig = {
  output: {
    filename: "a.js"
  }
};

gulp.task('connect', function() {
  connect.server({
    root: '_site'
    //,livereload: true
  });
});

gulp.task('reload', function () {
  gulp.src('./_site/**/*')
    .pipe(connect.reload());
});

gulp.task('clean:html', function () {
  return del([
    '_site/**/*.html'
  ]);
});
gulp.task('clean:static', function () {
  return del([
    '_site/images'
  ]);
});
gulp.task('clean:webpack', function () {
  return del([
    '_site/*.js'
  ]);
});
gulp.task('clean:css', function () {
  return del([
    '_site/css'
  ]);
});

gulp.task('copy',['copy:assets','copy:html']);
gulp.task('copy:assets', ['clean:static'], function() {
  gulp.src(['./assets/**/*'])
  .pipe(gulp.dest('./_site/'));
});

gulp.task('copy:html', ['clean:html'], function() {
  gulp.src(['./pages/**/*.html'])
  .pipe(nunjucks.compile(pageData))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./_site/'));
});

gulp.task('watch', function () {
  gulp.watch(['./pages/**/*'],['copy']);
  gulp.watch(['./modules/**/*.js'],['webpack']);
  gulp.watch(['./less/**/*.less'],['less']);
  //gulp.watch(['./_site/**/*'], ['reload']);
});

gulp.task('webpack', ['clean:webpack'],function() {
  return gulp.src('./modules/index.js')
  .pipe(webpack(webpackConfig))
  .pipe(uglify())
  .pipe(gulp.dest('_site/'));
});

gulp.task('less', ['clean:css'],function() {
  return gulp.src('./less/**/base.less')
  .pipe(less({
    plugins: [],
    paths: [path.join(__dirname, 'less', 'includes')]
  }))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./_site/css/'));
});

gulp.task('default', ['connect', 'copy', 'webpack', 'less', 'watch']);
gulp.task('build',['copy','webpack','less'])
