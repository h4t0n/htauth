"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();



gulp.task('build-dev', function () {

  gulp.src(['src/*.js'])
    .pipe($.angularFilesort())
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('testapp'));

});

gulp.task('browser-sync', function() {
    browserSync.init({
      server: {
        baseDir: "testapp",
        routes: {
            "/bower_components": "bower_components"
        }
      },
      browser: "google chrome"
    });
});


gulp.task('watch', function () {
  gulp.watch(['src/*.js','testapp/*.html'], ['build-dev']);
  gulp.watch('testapp/app.js', browserSync.reload);
});


gulp.task('dev', ['build-dev'], function () {
  gulp.start('browser-sync');
  gulp.start('watch');
});
