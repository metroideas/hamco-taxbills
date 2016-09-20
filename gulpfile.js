var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('nodemon');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css')
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
  img: 'public/img',
  js: 'public/js',
  css: 'public/css',
  sass: 'public/sass'
}

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
  browserSync({
    proxy: 'http://localhost:3000',
    port: 4000,
    online: true, // skips network status check 
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

// Sass files compiled with libsass and autoprefixer
gulp.task('sass', function() {
  return gulp.src(paths.sass.concat('/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({ stream: true }));
})

// CSS minified and mapped
gulp.task('css', [ 'sass' ], function () {
  return gulp.src([,
      paths.css.concat('/*.css'),
      '!'.concat(paths.css.concat('/*.min.css'))
    ])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({ stream: true }));
})


// BrowserSync reload triggered by changes to public/**/*
gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('serve', [ 'browser-sync' ], function() {
  gulp.watch('public/**/*.js', ['js', browserSync.reload]);
  gulp.watch(paths.css.concat('/*.css'), ['css']);
  gulp.watch(paths.sass.concat('/*.scss'), ['sass']);
  gulp.watch('views/**/*', ['bs-reload']);
});

gulp.task('default', [ 'test', 'serve' ])

