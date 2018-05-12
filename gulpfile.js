'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var run = require('run-sequence');
var del = require('del');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var jpegoptim = require('imagemin-jpegoptim');

gulp.task('clean:build', function () {
  return del('build');
});

gulp.task('copy:build', function () {
  console.log('Копирование файлов...');

  return gulp.src(['source/*.html'], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('images', function () {
  console.log('Оптимизация изображений...');

  return gulp.src('source/img/**/*.jpg')
  .pipe(imagemin([
    jpegoptim({
    max: 80,
    progressive: true
  })]))
  .pipe(gulp.dest('build/img'));
});

gulp.task('style', function() {
  console.log('Сборка и минификация стилевого файла...');

  gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer()
  ]))
  .pipe(gulp.dest('build/css'))
  .pipe(csso({restructure: false}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream());
});

gulp.task('js', function () {
  console.log('Сборка и минификация скриптов...')

  return gulp.src(['source/js/**/*.js'])
  .pipe(concat('script.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/js'))
  .pipe(server.stream());
});

gulp.task('copy:html', function () {
  return gulp.src([
    'source/*.html'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.scss', ['style']);
  gulp.watch('source/js/*.js', ['js']);
  gulp.watch('source/*.html', ['copy:html']).on('change', server.reload);
});

gulp.task('build', function (callback) {
  run( 'clean:build', 'copy:build', 'style', 'images', 'js', callback);
});
