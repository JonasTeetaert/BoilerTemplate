// =============================================================================
// Include plugins
// =============================================================================
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rimraf = require('rimraf');
var browserSync = require('browser-sync').create();
var sequence = require('run-sequence');
var connect = require('gulp-connect-php');
var imagemin = require('gulp-imagemin');
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// =============================================================================
// Server URL
// =============================================================================
var dynamicServerURL = 'http://boilertemplate.dev';

// =============================================================================
// Use `spawn` to execute shell command using Node
// The directory that contains the Gulpfile whose task needs to be run.
// Gulp tasks that need to be run.
// Check for --production flag
// Port to use for the development server.
// Browsers to target when prefixing CSS.
// =============================================================================
var PORT = 8010;
var UI_PORT = 3010;
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];


// =============================================================================
// Paths
// =============================================================================

var srcPath = 'app';
var buildPath = '_dist';


// =============================================================================
// Delete the buildPath folder
// This happens every time a build starts
// =============================================================================
gulp.task('clean', function (done) {
    rimraf(buildPath, done);
});


// =============================================================================
// Copy HTML
// =============================================================================
gulp.task('html', function () {
    gulp.src(srcPath + '/**/*.html')
        .pipe(gulp.dest(buildPath));
});


// =============================================================================
// Compile Sass into CSS
// In production, the CSS is compressed
// =============================================================================
gulp.task('compile-sass:local', function () {
    return gulp
        .src(srcPath + '/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(concat('main.scss'))
        .pipe(sassGlob())
        .pipe(sass())
        .on('error', notify.onError(function (error) {
            return "Problem file : " + error.message;
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + '/css'));
});

// Without sourcemaps and minified
gulp.task('compile-sass:release', function () {
    return gulp
        .src(srcPath + '/styles/main.scss')
        .pipe(concat('main.scss'))
        .pipe(sassGlob())
        .pipe(sass())
        .on('error', notify.onError(function (error) {
            return "Problem file : " + error.message;
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest(buildPath + '/css'));
});

// =============================================================================
// Combine JavaScript into one file using browserify
// In production, the file is minified
// =============================================================================
gulp.task('bundle-js:local', function () {
    return browserify({
        entries: srcPath + '/js/index.js',
        debug: true
    })
        .transform(babelify)
        .bundle()
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildPath + '/js'));
});

// without sourcemaps and minified
gulp.task('bundle-js:release', function () {
    return browserify({ entries: srcPath + '/js/index.js', debug: true })
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(buildPath + '/js'));
});

// =============================================================================
// Copy assets to the buildPath folder
// =============================================================================
gulp.task('copy-assets', function () {
    return gulp
        .src(srcPath + '/assets/**/*')
        .pipe(gulp.dest(buildPath + '/assets'));
});

// =============================================================================
// Copy and minifies images to the buildPath folder
// In production, the images are compressed
// =============================================================================
gulp.task('minify-images', function () {
    return gulp
        .src(srcPath + '/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(buildPath + '/assets/images'));
});


// =============================================================================
// Build the buildPath folder by running all of the above tasks
// =============================================================================
gulp.task('build:local', function (done) {
    sequence('clean', [
        'html',
        'compile-sass:local',
        'bundle-js:local',
        'copy-assets',
    ], done);
});

gulp.task('build:release', function (done) {
    sequence('clean', [
        'html',
        'compile-sass:release',
        'bundle-js:release',
        'copy-assets',
        'minify-images',
    ], done);
});


// =============================================================================
// Start a server with LiveReload to preview the site in
// =============================================================================
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: buildPath
        },
        notify: true,
        online: true
    });
});

// =============================================================================
// Build the site, run the server, and watch for file changes
// =============================================================================
gulp.task('default', ['build:local', 'browser-sync'], function () {
    gulp.watch([srcPath + '/**/*.html'], ['html', browserSync.reload]);
    gulp.watch([srcPath + '/styles/**/*.scss'], ['compile-sass:local', browserSync.reload]);
    gulp.watch([srcPath + '/js/**/*.js'], ['bundle-js:local', browserSync.reload]);
    gulp.watch([srcPath + '/assets/**/*'], ['copy-assets', browserSync.reload]);
});