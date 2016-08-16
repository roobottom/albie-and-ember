var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('go', function () {
  nodemon({
    script: 'app.js'
  , ext: 'js html less'
  , ignore: []
  , env: {}
  , watch: []
  , tasks: []
  })
});

gulp.task('default',['go']);
