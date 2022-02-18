const { series, src, dest, watch, parallel } = require('gulp');
const sass = require("gulp-sass")(require("node-sass"));
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

//utilidades
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

//utilidades js
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

//funcion que compila SASS
const paths = {
    imagenes: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

function css(  ){
    return src(paths.scss)
        .pipe( sourcemaps.init() )
        .pipe( sass())
        .pipe( postcss( [autoprefixer(), cssnano() ] ))
        .pipe( sourcemaps.write('.') )
        .pipe( dest('./build/css') )
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe( concat('bundle.js') )
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe( rename({ suffix: '.min' }))
        .pipe( dest('./build/js') )
}

function imagenes(){
    return src(paths.imagenes)
        .pipe( imagemin() )
        .pipe( dest( './build/img' ))
        .pipe( notify( {message: 'Imagen Minificada'} ))
}

function versionwebp(){
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe( dest('./build/img'))
        .pipe( notify({message: 'Versión webP lista'}))
}

function watchArchivos() {
    watch( paths.scss, css ); // * = La carpeta actual con la extension -- ** Todos los archivos con esa extención.
    watch( paths.js, javascript);
}



exports.css = css;
exports.imagenes = imagenes;
exports.notify = notify;
exports.watchArchivos = watchArchivos;

exports.default = series( css, javascript, imagenes, watchArchivos );