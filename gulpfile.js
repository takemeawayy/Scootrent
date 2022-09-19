const { src, dest, task, watch, series, parallel } = require('gulp');
const del = require('del');
const options = require("./config");
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-terser');
const imagemin = require('gulp-imagemin'); 
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');

const logSymbols = require('log-symbols');

function livePreview(done){
  browserSync.init({
    server: {
      baseDir: options.paths.dist.base
    },
    port: options.config.port || 5000
  });
  done();
} 

function previewReload(done){
  console.log("\n\t" + logSymbols.info,"Reloading Browser Preview.\n");
  browserSync.reload();
  done();
}

//Development Tasks
function devHTML(){
  return src(`${options.paths.src.base}/*.html`)
  .pipe(include())
  .pipe(dest(options.paths.dist.base));
} 

function devStyles(){
  const tailwindcss = require('tailwindcss'); 
  return src(`${options.paths.src.css}/**/*.scss`).pipe(sass().on('error', sass.logError))
    .pipe(dest(options.paths.src.css))
    .pipe(postcss([
      tailwindcss(options.config.tailwindjs),
      require('autoprefixer'),
    ]))
    .pipe(concat({ path: 'style.css'}))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(dest(options.paths.dist.css));
}

function devScripts(){
  return src([
    `${options.paths.src.js}/libs/**/*.js`,
    `${options.paths.src.js}/**/*.js`,
    `!${options.paths.src.js}/**/external/*`
  ]).pipe(concat({ path: 'scripts.js'})).pipe(dest(options.paths.dist.js));
}

function devImages(){
  return src(`${options.paths.src.img}/**/*`).pipe(dest(options.paths.dist.img));
}

function watchFiles(){
  watch(`${options.paths.src.base}/**/*.html`,series(devHTML, devStyles, previewReload));
  watch([options.config.tailwindjs, `${options.paths.src.css}/**/*.scss`],series(devStyles, previewReload));
  watch(`${options.paths.src.js}/**/*.js`,series(devScripts, previewReload));
  watch(`${options.paths.src.img}/**/*`,series(devImages, previewReload));
  console.log("\n\t" + logSymbols.info,"Watching for Changes..\n");
}

function devClean(){
  console.log("\n\t" + logSymbols.info,"Cleaning dist folder for fresh start.\n");
  return del([options.paths.dist.base]);
}

function prodHTML(){
  return src(`${options.paths.src.base}/*.html`)
  .pipe(include())
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(dest(options.paths.build.base));
}

function prodStyles(){
  return src(`${options.paths.dist.css}/**/*`)
  .pipe(purgecss({
    content: ['src/**/*.{html,js}'],
    defaultExtractor: content => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
      return broadMatches.concat(innerMatches)
    }
  }))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(dest(options.paths.build.css));
}

function prodScripts(){
  return src([
    `${options.paths.src.js}/libs/**/*.js`,
    `${options.paths.src.js}/**/*.js`
  ])
  .pipe(concat({ path: 'scripts.js'}))
  .pipe(uglify())
  .pipe(dest(options.paths.build.js));
}

function prodImages(){
  return src(options.paths.src.img + '/**/*').pipe(imagemin()).pipe(dest(options.paths.build.img));
}

function prodClean(){
  console.log("\n\t" + logSymbols.info,"Cleaning build folder for fresh start.\n");
  return del([options.paths.build.base]);
}

function buildFinish(done){
  console.log("\n\t" + logSymbols.info,`Production build is complete. Files are located at ${options.paths.build.base}\n`);
  done();
}

exports.default = series(
  devClean,
  parallel(devStyles, devScripts, devImages, devHTML),
  livePreview, 
  watchFiles
);

exports.prod = series(
  prodClean,
  parallel(prodStyles, prodScripts, prodImages, prodHTML),
  buildFinish
);