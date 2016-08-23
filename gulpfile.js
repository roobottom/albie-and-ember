var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var del = require('del');

var paths = {
  templates: './pages/',
  assets: './assets/',
  target: './_site/'
};

gulp.task('connect', function() {
  connect.server({
    root: '_site',
    livereload: true
  });
  console.log('dev server running at http://localhost:8080')
});

gulp.task('html', function () {
  gulp.src('./_site/*.html')
    .pipe(connect.reload());
});

gulp.task('copy',['clean'], function() {
  gulp.src(['./pages/**/*.html','./assets/**/*.*'])
  .pipe(gulp.dest('./_site/'));
});

gulp.task('watch', function () {
  nodemon({
  script: './assets/js/index.js',
  ext: 'js html less',
  ignore: ['./_site/*'],
  tasks: ['copy','html']
  })
});

gulp.task('clean', function () {
  return del([
    '_site/**/*'
  ]);
});

gulp.task('default', ['connect', 'watch']);
