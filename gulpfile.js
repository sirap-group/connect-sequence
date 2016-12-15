var gulp = require('gulp')
var mocha = require('gulp-mocha')

gulp.task('test', function () {
  gulp.src('./tests/connect-sequence.spec.js').pipe(mocha())
})
