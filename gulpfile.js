var gulp = require('gulp')
var linter = require('gulp-standard-bundle').linter
var mocha = require('gulp-mocha')

gulp.task('lint', function () {
  gulp.src(['./lib/**/*.js', './tests/**/*.spec.js'])
  .pipe(linter())
  .pipe(linter.reporter('default', {
    breakOnError: true
  }))
})

gulp.task('test', function () {
  gulp.src('./tests/connect-sequence.spec.js').pipe(mocha())
})
