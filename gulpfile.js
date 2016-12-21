var gulp = require('gulp')
var yargs = require('yargs')
var del = require('del')

var standard = require('gulp-standard-bundle')
var mocha = require('gulp-mocha')
var shell = require('gulp-shell')
var cover = require('gulp-coverage')
var coveralls = require('gulp-coveralls')
var bump = require('gulp-bump')
var git = require('gulp-git')

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
  opts.type = getBumpType()
  return gulp.src('./package.json')
  .pipe(bump(opts))
  .pipe(gulp.dest('./'))
})

gulp.task('release', ['bump'], function (done) {
  var pkg = require('./package.json')
  var version = 'v' + pkg.version
  var releaseType = getBumpType()
  var commitMsg = 'Releasing ' + releaseType + ' version: ' + version
  gulp.src('./package.json')
  .pipe(git.add())
  .pipe(git.commit(commitMsg))
  .on('end', function () {
    git.tag(version, commitMsg, function (err) {
      if (err) {
        throw err
      }
      git.push('gh-sirap-group', null, done)
    })
  })
})

gulp.task('default', ['test'])

gulp.task('watch', function () {
  gulp.watch([ './tests/**/*.js', './lib/**/*.js' ], ['test'])
})

function getBumpType () {
  return argv.patch
  ? 'patch' : (argv.minor)
  ? 'minor' : (argv.major)
  ? 'major' : (argv.prerelease)
  ? 'prerelease' : 'patch'
}
