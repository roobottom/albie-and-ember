var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var del = require('del');
var webpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var less = require('gulp-less');

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
    root: '_site',
    livereload: true
  });
});

gulp.task('reload', function () {
  gulp.src('./_site/**/*')
    .pipe(connect.reload());
});

//build tasks for html and static assets.
gulp.task('clean:static', function () {
  return del([
    '_site/**/*.html',
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
    '_site/**/*.css'
  ]);
});

gulp.task('copy', ['clean:static'], function() {
  gulp.src(['./pages/**/*.html','./assets/**/*'])
  .pipe(gulp.dest('./_site/'));
});

gulp.task('watch', function () {
  gulp.watch(['./pages/**/*'],['copy']);
  gulp.watch(['./modules/**/*.js'],['webpack']);
  gulp.watch(['./less/**/*.less'],['less']);
  gulp.watch(['./_site/**/*'], ['reload']);
});

gulp.task('webpack', ['clean:webpack'],function() {
  return gulp.src('./modules/index.js')
  .pipe(webpack(webpackConfig))
  .pipe(uglify())
  .pipe(gulp.dest('_site/'));
});

gulp.task('less', ['clean:css'],function() {
  return gulp.src('./less/**/*.less')
  .pipe(less({
    plugins: []
  }))
  .pipe(gulp.dest('./_site/css'));
});

gulp.task('default', ['connect', 'copy', 'webpack', 'less', 'watch']);
