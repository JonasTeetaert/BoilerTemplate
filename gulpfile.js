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
var sassdoc = require('require-dir');
var browserSync = require('browser-sync');
var sequence = require('run-sequence');
var php = require('gulp-connect-php');
var babel = require("gulp-babel");


// =============================================================================
// Server URL
// =============================================================================
var dynamicServerURL = 'http://raakpunt.dev';

// =============================================================================
// Use `spawn` to execute shell command using Node
// The directory that contains the Gulpfile whose task needs to be run.
// Gulp tasks that need to be run.
// Check for --production flag
// Port to use for the development server.
// Browsers to target when prefixing CSS.
// =============================================================================
var PORT = 3010;
var UI_PORT = 3020;
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
    gulp.src(srcPath + '/**/*.php')
        .pipe(gulp.dest(buildPath));
});


// =============================================================================
// Compile Sass into CSS
// In production, the CSS is compressed
// =============================================================================
gulp.task('sass', function () {
    return gulp
        .src(srcPath + '/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', notify.onError(function (error) {
            return "Problem file : " + error.message;
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + '/css'))
        .pipe(browserSync.reload({ stream: true }));
});


// =============================================================================
// Combine JavaScript into one file
// In production, the file is minified
// =============================================================================
gulp.task('javascript', function () {
    return gulp
        .src(srcPath + '/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + '/js'));
});


// =============================================================================
// Copy images to the buildPath folder
// In production, the images are compressed
// =============================================================================
gulp.task('images', function () {
    return gulp
        .src(srcPath + '/assets/images/**/*')
        .pipe(gulp.dest(buildPath + '/assets/images'));
});

// =============================================================================
// Copy src fonts to the buildPath folder
// =============================================================================
gulp.task('fonts', function () {
    return gulp
        .src(srcPath + '/assets/fonts/**/*.*')
        .pipe(gulp.dest(buildPath + '/assets/fonts'));
});

// =============================================================================
// Copy src JSON to the buildPath folder
// =============================================================================
gulp.task('json', function () {
    return gulp
        .src(srcPath + '/assets/json/**/*.json')
        .pipe(gulp.dest(buildPath + '/assets/json'));
});


// =============================================================================
// Build the buildPath folder by running all of the above tasks
// =============================================================================
gulp.task('build', function (done) {
    sequence('clean', [
        'sass',
        'fonts',
        'javascript',
        'json',
        'images',
        'html'
    ], done);
});


// =============================================================================
// Start a server with LiveReload to preview the site in
// =============================================================================
// http://localhost:3000/buildPath/index.php
gulp.task('server', function () {
    php.server({}, function () {
        browserSync({
            proxy: '127.0.0.1:8000',
            startPath: "/" + buildPath + '/index.php'
        });
    });

});


// =============================================================================
// Build the site, run the server, and watch for file changes
// =============================================================================
gulp.task('default', ['build', 'server'], function () {
    gulp.watch([srcPath + '/**/*.php'], ['html', browserSync.reload]);
    gulp.watch([srcPath + '/sass/**/*.scss'], ['sass', browserSync.reload]);
    gulp.watch([srcPath + '/assets/fonts/**/*'], ['fonts', browserSync.reload]);
    gulp.watch([srcPath + '/assets/json/*.json'], ['json', browserSync.reload]);
    gulp.watch([srcPath + '/js/**/*.js'], ['javascript', browserSync.reload]);
    gulp.watch([srcPath + '/assets/images/**/*'], ['images', browserSync.reload]);
});