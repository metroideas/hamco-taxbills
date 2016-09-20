var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');


// Unit tests
gulp.task('test-app', function() {
  return gulp.src([ 'test/test-app.js' ], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .once('error', function() { process.exit(1); })
    .once('end', function() { process.exit(); })
})

gulp.task('test-api', function() {
  return gulp.src([ 'test/test-api.js' ], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .once('error', function() { process.exit(1); })
    .once('end', function() { process.exit(); })
})

gulp.task('test-models', function() {
  return gulp.src([ 'test/test-models.js' ], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .once('error', function() { process.exit(1); })
    .once('end', function() { process.exit(); })
})

gulp.task('test', function() {
  return gulp.src([ 'test/test-*.js' ], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .once('error', function() { process.exit(1); })
    .once('end', function() { process.exit(); })
})

gulp.task('serve', function() {
  nodemon({
    script: './bin/www',
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('default', [ 'test' ])