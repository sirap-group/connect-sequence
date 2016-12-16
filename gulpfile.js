var gulp = require('gulp')
var linter = require('gulp-standard-bundle').linter
var mocha = require('gulp-mocha')
var bump = require('gulp-bump')

// var sequence = require('run-sequence')
var argv = require('yargs').argv

gulp.task('lint', function (done) {
  gulp.src(['./gulpfile.js', './lib/**/*.js', './tests/**/*.spec.js'])
  .pipe(linter())
  .pipe(linter.reporter('default', {
    breakOnError: true
  }))
  .on('finish', done)
})

gulp.task('test', ['lint'], function (done) {
  gulp.src('./tests/connect-sequence.spec.js')
  .pipe(mocha())
  .on('finish', done)
})

gulp.task('bump', function () {
  var opts = {}
  opts.type = argv.patch
    ? 'patch' : (argv.minor)
      ? 'minor' : (argv.major)
        ? 'major' : (argv.prerelease)
          ? 'prerelease' : 'patch'
  gulp.src('./package.json')
  .pipe(bump(opts))
  .pipe(gulp.dest('./'))
})

gulp.task('default', ['test'])
