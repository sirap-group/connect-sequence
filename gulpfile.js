var gulp = require('gulp')
var linter = require('gulp-standard-bundle').linter
var mocha = require('gulp-mocha')
var sequence = require('run-sequence')

gulp.task('lint', function (done) {
  gulp.src(['./gulpfile.js', './lib/**/*.js', './tests/**/*.spec.js'])
  .pipe(linter())
  .pipe(linter.reporter('default', {
    breakOnError: true
  }))
  .on('finish', done)
})

gulp.task('test', function (done) {
  gulp.src('./tests/connect-sequence.spec.js')
  .pipe(mocha())
  .on('finish', done)
})

gulp.task('default', sequence('lint', 'test'))
