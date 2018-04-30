// =============================================================================
// Include plugins
// =============================================================================
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rimraf = require('rimraf');
var sassdoc = require('sassdoc');
var sassdir = require('require-dir');
var browserSync = require('browser-sync');
var sequence = require('run-sequence');
var connect = require('gulp-connect-php');
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');

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
var paths = require('./paths.json');


// =============================================================================
// Delete the buildPath folder
// This happens every time a build starts
// =============================================================================
gulp.task('clean', function (done) {
    rimraf(buildPath, done);
});


// =============================================================================
// Copy PHP
// =============================================================================
gulp.task('php', function () {
    gulp.src(srcPath + '/**/*.php')
        .pipe(gulp.dest(buildPath));
});


// =============================================================================
// Compile Sass into CSS
// In production, the CSS is compressed
// =============================================================================
gulp.task('compile-sass:local', function () {
    return gulp
        .src([
            paths.css.bootstrap,
            srcPath + '/sass/main.scss'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.scss'))
        .pipe(sass()).on('error', notify.onError(function (error) {
            return "Problem file : " + error.message;
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + '/css'));
    //.pipe(browserSync.reload({ stream: true }));
});

// Whithout sourcemaps
gulp.task('compile-sass:release', function () {
    return gulp
        .src([
            paths.css.bootstrap,
            srcPath + '/sass/main.scss'])
        .pipe(concat('main.scss'))
        .pipe(sass()).on('error', notify.onError(function (error) {
            return "Problem file : " + error.message;
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest(buildPath + '/css'));
    //.pipe(browserSync.reload({ stream: true }));
});


// =============================================================================
// Combine JavaScript into one file
// In production, the file is minified
// =============================================================================
gulp.task('compile-js:local', function () {
    return gulp
        .src([
            paths.js.jquery,
            paths.js.popperjs,
            paths.js.bootstrap,
            srcPath + '/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + '/js'));
});

// Without sourcemaps, with uglifier
gulp.task('compile-js:release', function () {
    return gulp
        .src([
            paths.js.jquery,
            paths.js.popperjs,
            paths.js.bootstrap,
            srcPath + '/js/**/*.js'])
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(buildPath + '/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildPath + '/js'));
});

// =============================================================================
// Copy images to the buildPath folder
// In production, the images are compressed
// =============================================================================
gulp.task('copy-images:local', function () {
    return gulp
        .src(srcPath + '/assets/images/**/*')
        .pipe(gulp.dest(buildPath + '/assets/images'));
});

gulp.task('copy-images:release', function () {
    return gulp
        .src(srcPath + '/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(buildPath + '/assets/images'));
});

// =============================================================================
// Copy src fonts to the buildPath folder
// =============================================================================
gulp.task('copy-fonts', function () {
    return gulp
        .src(srcPath + '/assets/fonts/**/*.*')
        .pipe(gulp.dest(buildPath + '/assets/fonts'));
});

// =============================================================================
// Copy icons fonts to the buildPath folder
// =============================================================================
gulp.task('copy-icons', function () {
    return gulp
        .src(srcPath + '/assets/icons/**/*.*')
        .pipe(gulp.dest(buildPath + '/assets/icons'));
});

// =============================================================================
// Copy src JSON to the buildPath folder
// =============================================================================
gulp.task('copy-json', function () {
    return gulp
        .src(srcPath + '/assets/json/**/*.json')
        .pipe(gulp.dest(buildPath + '/assets/json'));
});


// =============================================================================
// Build the buildPath folder by running all of the above tasks
// =============================================================================
gulp.task('build:local', function (done) {
    sequence('clean', [
        'php',
        'compile-sass:local',
        'compile-js:local',
        'copy-images:local',
        'copy-fonts',
        'copy-icons'
        //'copy-json'
    ], done);
});

gulp.task('build:release', function (done) {
    sequence('clean', [
        'php',
        'compile-sass:release',
        'compile-js:release',
        'copy-images:release',
        'copy-fonts',
        'copy-icons'
        //'copy-json'
    ], done);
});


// =============================================================================
// Start a server with LiveReload to preview the site in
// =============================================================================
// http://localhost:3000/buildPath/index.php
gulp.task('connect-sync', function () {
    connect.server({}, function () {
        browserSync({
            proxy: '127.0.0.1:8000',
            startPath: "/" + buildPath + '/index.php'
        });
    });

});

gulp.task('connect-php', function(){
    connect.server({
        base: buildPath,
        port: PORT,
        keepalive: true
    });
});

gulp.task('browser-sync', ['connect-php'], function() {
    browserSync({
        proxy: '127.0.0.1:' + PORT,
        port: PORT,
        open: true,
        notify: false
    });
});

// =============================================================================
// Build the site, run the server, and watch for file changes
// =============================================================================
gulp.task('default', ['build:local', 'browser-sync'], function () {
    gulp.watch([srcPath + '/**/*.php'], ['php', browserSync.reload]);
    gulp.watch([srcPath + '/sass/**/*.scss'], ['compile-sass:local', browserSync.reload]);
    gulp.watch([srcPath + '/js/**/*.js'], ['compile-js:local', browserSync.reload]);
    gulp.watch([srcPath + '/assets/fonts/**/*'], ['copy-fonts', browserSync.reload]);
    gulp.watch([srcPath + '/assets/icons/**/*'], ['copy-icons', browserSync.reload]);
    gulp.watch([srcPath + '/assets/images/**/*'], ['copy-images', browserSync.reload]);
});