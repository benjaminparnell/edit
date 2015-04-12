var gulp = require('gulp')
var gutil = require('gulp-util')
var browserify = require('browserify')
var watchify = require('watchify')
var fs = require('fs')

gulp.task('default', [ 'build' ])

gulp.task('build', [ 'buildjs' ])

gulp.task('buildjs', function () {
  bundleJs(false)
})

gulp.task('watchjs', function () {
  bundleJs(true)
})

function bundleJs (watch) {
  var b

  gutil.log('building js')

  if (watch) {
    b = watchify(browserify('./browser/index.js', watchify.args))
    b.on('update', runBrowserify.bind(null, b))
  } else {
    b = browserify('./browser/index.js')
  }

  function runBrowserify (b) {
    b.bundle()
     .on('end', function () {
       gutil.log('js built')
     })
     .on('error', function (error) {
       gutil.log('browserify error:', error.message)
     })
     .pipe(fs.createWriteStream('static/build.js'))
  }

  return runBrowserify(b)
}
