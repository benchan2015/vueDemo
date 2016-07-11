var gulp = require('gulp');
var gutil = require('gulp-util');
var webpackConfig = require('./webpack.config.js');
var gulpSequence = require('gulp-sequence');
var webpack = require('webpack');
var rimraf = require('gulp-rimraf');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var minifyhtml = require('gulp-minify-html');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var  autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');



gulp.task('autofx', function() {
    gulp.src('./build/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove: true 
        }))
        .pipe(gulp.dest('./build/'));
});

// 创建服务器
gulp.task('connect', function() {
    connect.server({
        root: ['./build'],
        port: 8003,
        livereload: true
    });
});
//页面刷新
gulp.task('connect-reload', function() {
    return gulp.src('./build/*')
        .pipe(connect.reload());
});
// 清空生成文件
gulp.task('clean', function() {
    return gulp.src(['./build/*'], {
            read: false
        })
        .pipe(rimraf());
});
/*添加监视*/
gulp.task('watch', function() {

        gulp.watch('./src/stylesheets/**/*.scss', ['sass']).on('change', function(event) {
            runSequence(['sass'], ['autofx'],['connect-reload']);
        });
        gulp.watch('./src/**/*.html', ['copy-html', 'connect-reload']).on('change', function(event) {
            runSequence(['copy-html'],['connect-reload']);
        });
        gulp.watch('./src/**/*.js').on('change', function(event) {
            runSequence(['wp-dev'],['connect-reload']);
        });

    })
    // 复制所有html到build目录
gulp.task('copy-html', function() {
    return gulp.src(['./src/**/*.html', '!./src/{test,test/**}', '!./src/{common,common/**}'])
        .pipe(gulp.dest('./build'));
});

// 复制所有图片到build目录
gulp.task('copy-images', function() {
    return gulp.src(['./src/images/**/*'])
        .pipe(gulp.dest('./build/images'));
});

//处理sass
gulp.task('sass', function() {
    return gulp.src(['./src/stylesheets/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(gulp.dest('./build/css'));

});
// webpack dev
gulp.task('wp-dev', function(callback) {
    var devConfig = Object.create(webpackConfig);


    var devCompiler = webpack(devConfig);
    devCompiler.run(function(err, stats) {
        if (err) {
            throw new gutil.PluginError('wp-dev', err);
        }
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});
gulp.task('minify-css', function() {
    gulp.src('./build/css/*.css').pipe(minifycss()).pipe(gulp.dest('./build/css'))
})
gulp.task('minify-js', function() {
    gulp.src('./build/javascripts/*.js').pipe(uglify()).pipe(gulp.dest('./build/javascripts'))
})
gulp.task('minify-html', function() {
    gulp.src('./build/**/*.html').pipe(minifyhtml()).pipe(gulp.dest('./build'));
})
gulp.task('minify-img', function() {
    //gulp.src('./build/images/*').pipe(imagemin()).pipe(gulp.dest('./build/images'));
     gulp.src('./build/images/*').pipe(gulp.dest('./build/images'));
})
/*开发环境，没有压缩代码*/
gulp.task('default', gulpSequence('clean', ['copy-html', 'copy-images', 'sass', 'wp-dev', 'watch','connect'], 'autofx'));

/*生产环境*/
gulp.task('p', gulpSequence('default', ['minify', 'minify', 'minify']));
