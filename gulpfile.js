'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

// paths
var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/',
		video: 'build/video/'
	},
	source: {
		html: 'source/*.html',
		js: 'source/js/main.js',
		style: 'source/sass/main.scss',
		img: 'source/img/**/*.*',
		fonts: 'source/fonts/**/*.*',
		video: 'source/video/*'
	},
	watch: {
		html: 'source/**/*.html',
		js: 'source/js/**/*.js',
		style: 'source/sass/**/*.scss',
		img: 'source/img/**/*.*',
		fonts: 'source/fonts/**/*.*',
		video: 'source/video/*'
	},
	clean: './build'
};

// server config
var config = {
	server: {
		baseDir: "./build"
	},
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend_Devil"
};

// html build
gulp.task('html:build', function () {
	 gulp.src(path.source.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

// javascript build
gulp.task('js:build', function () {
	 gulp.src(path.source.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
	gulp.src('bower_components/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(path.build.js));
});

// css build
gulp.task('style:build', function () {
	 gulp.src(path.source.style)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(rename('main.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

// img build
gulp.task('image:build', function () {
	gulp.src(path.source.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

// fonts build
gulp.task('fonts:build', function() {
	gulp.src(path.source.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

// video build
gulp.task('video:build', function() {
	gulp.src(path.source.video)
		.pipe(gulp.dest(path.build.video))
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build',
	'video:build'
]);

// watch
gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
	watch([path.watch.video], function(event, cb) {
		gulp.start('video:build');
	});
});

// webserver task
gulp.task('webserver', function () {
	browserSync(config);
});

// clean
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

// main task
gulp.task('default', ['build', 'webserver', 'watch']);