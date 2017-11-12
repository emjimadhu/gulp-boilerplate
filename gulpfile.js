// Including Plugins
const gulp = require('gulp')
const fs = require('fs')
const html = require('gulp-minify-html')
const css = require('gulp-minify-css')
const sass = require('gulp-sass')
const concat = require('gulp-concat-multi')
const uglify = require('gulp-uglify')
const header = require('gulp-header')
const imagemin = require('gulp-imagemin')

// Getting Copyright File using nodeJS File System
const getCopyright = () => fs.readFileSync('Copyright')

// Minify Html
gulp.task('minifyHtml', () =>
  gulp.src('src/*.html')
      .pipe(html())
      .pipe(gulp.dest('dist'))
)

// Minify Css
gulp.task('minifyCss', () =>
  gulp.src('src/styles/**/*.css')
      .pipe(css())
      .pipe(header(getCopyright()))
      .pipe(gulp.dest('dist/styles'))
)

// Compile SASS
gulp.task('compileSass', () =>
  gulp.src('src/styles/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(header(getCopyright()))
      .pipe(gulp.dest('dist/styles'))
)

// Image optimization
gulp.task('imageMin', () =>
    gulp.src('src/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
)

// Concat JS and minify and add copywrite
gulp.task('concatjs', () =>
  concat({
    'vendor.js': 'src/scripts/vendor/**/*.js',
    'plugins.js': 'src/scripts/plugins/**/*.js',
    'main.js': 'src/scripts/*.js'
  })
    .pipe(uglify())
    .pipe(header(getCopyright()))
    .pipe(gulp.dest('dist/scripts'))
)

// Watch Files
gulp.task('watch', () => {
  gulp.watch('src/scripts/**/*.js', ['concatjs'])
  gulp.watch('src/scripts/scss/**/*.scss', ['compileSass'])
  gulp.watch('src/images/**/*', ['imageMin'])
  gulp.watch('src/*.html', ['minifyHtml'])
})

// Running All the services at once
gulp.task('build', ['imageMin', 'compileSass', 'concatjs', 'minifyHtml'])
