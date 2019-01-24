// =============================================================================
// Include plugins
// =============================================================================
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
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
var source  = require('vinyl-source-stream');
var buffer  = require('vinyl-buffer');

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
        .src(srcPath + '/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(concat('main.scss'))
        .pipe(sassGlob())
        .pipe(sass()).on('error', notify.onError(function (error) {
            return "Problem file : " + error.message;
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPath + '/css'));
});

// Without sourcemaps
gulp.task('compile-sass:release', function () {
    return gulp
        .src(srcPath + '/sass/main.scss')
        .pipe(concat('main.scss'))
        .pipe(sass()).on('error', notify.onError(function (error) {
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
gulp.task('bundle-js:local', function() {
    return browserify({entries: srcPath +'/js/index.js', debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(buildPath + '/js'));
}); 

// without sourcemaps
gulp.task('bundle-js:release', function() {
    return browserify({entries: srcPath +'/js/index.js', debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
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
        'html',
        'compile-sass:local',
        'bundle-js:local',
        'copy-images:local',
        'copy-fonts',
        'copy-icons'
        //'copy-json'
    ], done);
});

gulp.task('build:release', function (done) {
    sequence('clean', [
        'html',
        'compile-sass:release',
        'bundle-js:release',
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
gulp.task('browser-sync', function() {
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
    gulp.watch([srcPath + '/sass/**/*.scss'], ['compile-sass:local', browserSync.reload]);
    gulp.watch([srcPath + '/js/**/*.js'], ['bundle-js:local', browserSync.reload]);
    gulp.watch([srcPath + '/assets/fonts/**/*'], ['copy-fonts', browserSync.reload]);
    gulp.watch([srcPath + '/assets/icons/**/*'], ['copy-icons', browserSync.reload]);
    gulp.watch([srcPath + '/assets/images/**/*'], ['copy-images:local', browserSync.reload]);
});