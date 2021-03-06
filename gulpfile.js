var gulp = require('gulp')
var yargs = require('yargs')
var del = require('del')
var chalk = require('chalk')
var fs = require('fs-then-native')
var jsdoc2md = require('jsdoc-to-markdown')

var standard = require('gulp-standard-bundle')
var mocha = require('gulp-mocha')
var shell = require('gulp-shell')
var childProcess = require('child_process')
var cover = require('gulp-coverage')
var coveralls = require('gulp-coveralls')
var bump = require('gulp-bump')
var git = require('gulp-git')
var gitRev = require('git-rev')

var linter = standard.linter
var argv = yargs.argv

gulp.task('lint', function () {
  return gulp.src(['./gulpfile.js', './lib/**/*.js', './tests/**/*.spec.js'])
  .pipe(linter())
  .pipe(linter.reporter('default', {
    breakOnError: argv.breakOnError
  }))
})

gulp.task('test', ['lint'], function () {
  return gulp.src('./tests/**/*.spec.js')
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

gulp.task('bump', function (done) {
  releaseIfHeadOnMaster(function (err) {
    if (err) {
      done()
      return
    }
    var opts = {}
    opts.type = getBumpType()
    return gulp.src('./package.json')
    .pipe(bump(opts))
    .pipe(gulp.dest('./'))
    .on('end', done)
  })
})

gulp.task('release', ['bump'], function (done) {
  releaseIfHeadOnMaster(function (err) {
    if (err) {
      done()
      return
    }
    var pkg = require('./package')
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
        git.push('gh-sirap-group', null, function (err) {
          if (err) {
            throw err
          }
          git.push('gh-sirap-group', null, {args: '--tags'}, function (err) {
            if (err) {
              throw err
            }
            var exec = childProcess.exec('npm publish')
            exec.stdout.pipe(process.stdout)
            exec.stderr.pipe(process.stderr)
            exec.on('end', done)
          })
        })
      })
    })
  })
})

gulp.task('jsdoc', function () {
  return jsdoc2md.render({ files: 'lib/*.js' })
    .then(output => fs.writeFile('api.md', output))
})

gulp.task('default', ['test'])

gulp.task('watch', function () {
  gulp.watch([ './tests/**/*.js', './lib/**/*.js' ], ['test', 'jsdoc'])
})

function releaseIfHeadOnMaster (done) {
  gitRev.branch(function (branch) {
    if (branch !== 'master') {
      var errorMsg = 'You must be on the master branch to make a new release!\n'
      errorMsg += 'If you want to make a release candidate (RC), use the `prerelease` task instead.\n'
      errorMsg += 'Tasks `release`... Aborting.'
      console.error(chalk.red.bgWhite(errorMsg))
      done(new Error())
      return
    }
    done()
  })
}

function getBumpType () {
  return argv.patch
  ? 'patch' : (argv.minor)
  ? 'minor' : (argv.major)
  ? 'major' : (argv.prerelease)
  ? 'prerelease' : 'patch'
}
