var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('nodemon');
var browserSync = require('browser-sync');

// Mocha tests
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

// Nodemon + BrowserSync recipe:
// https://github.com/sogko/gulp-recipes/blob/master/browser-sync-nodemon-expressjs/gulpfile.js
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: './bin/www',
    // Development environment
    env: { 'NODE_ENV': 'development' },

    ignore: [ 'gulpfile.js', 'node_modules/' ],

    // watch core server file(s) that require server restart on change
    watch: ['app.js']
  })
    .on('start', function onStart() {
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

    // skips network status check 
    online: true,

    // open the proxied app in chrome
    browser: ['safari']
  });
});

// Javascript
gulp.task('js',  function () {
  return gulp.src('public/**/*.js')
    // do stuff to JavaScript files
    //.pipe(uglify())
    //.pipe(gulp.dest('...'));
});

// CSS
gulp.task('css', function () {
  return gulp.src('public/**/*.css')
    .pipe(browserSync.reload({ stream: true }));
})

// BrowserSync reload triggered by changes to public/**/*
gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('serve', [ 'browser-sync' ], function() {
  gulp.watch('public/**/*.js',   ['js', browserSync.reload]);
  gulp.watch('public/**/*.css',  ['css']);
  gulp.watch('views/**/*',       ['bs-reload']);
});

gulp.task('default', [ 'test', 'serve' ])

