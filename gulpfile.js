var gulp = require('gulp')
var yargs = require('yargs')
var del = require('del')

var standard = require('gulp-standard-bundle')
var mocha = require('gulp-mocha')
var shell = require('gulp-shell')
var cover = require('gulp-coverage')
var coveralls = require('gulp-coveralls')
var bump = require('gulp-bump')

var linter = standard.linter
var argv = yargs.argv

gulp.task('lint', function () {
  return gulp.src(['./gulpfile.js', './lib/**/*.js', './tests/**/*.spec.js'])
  .pipe(linter())
  .pipe(linter.reporter('default', {
    breakOnError: true
  }))
})

gulp.task('test', ['lint'], function () {
  return gulp.src('./tests/connect-sequence.spec.js')
  .pipe(mocha())
})

gulp.task('jscover', ['clean-cover'], shell.task('jscover lib lib-cov'))

gulp.task('clean-cover', function () {
  return del(['lib-cov', 'lib-ori'])
})

gulp.task('coverage', ['jscover'], function () {
  return gulp.src('tests/**/*.js', { read: false })
  .pipe(cover.instrument({ pattern: ['lib/**/*.js'], debugDirectory: 'debug' }))
  .pipe(mocha())
  .pipe(cover.gather())
  .pipe(cover.format({ reporter: 'lcov' }))
  .pipe(coveralls())
})

gulp.task('bump', function () {
  var opts = {}
  opts.type = argv.patch
    ? 'patch' : (argv.minor)
      ? 'minor' : (argv.major)
        ? 'major' : (argv.prerelease)
          ? 'prerelease' : 'patch'
  return gulp.src('./package.json')
  .pipe(bump(opts))
  .pipe(gulp.dest('./'))
})

gulp.task('default', ['test'])
