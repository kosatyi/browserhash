var del        = require('del');
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var rename     = require('gulp-rename');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var concatJsFiles = function(name,deps,out){
    return gulp.src(deps).pipe(concat(name))
        .pipe(gulp.dest(out))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(out));
};

gulp.task('clean', function(done){
    del.sync('dist');
    done();
});

gulp.task('browserhash', function(){
    return concatJsFiles('browserhash.js',[
        './src/utils.js',
        './src/base64.js',
        './src/platform.js',
        './src/webrtc.js',
        './src/device.js',
        './src/hasher.js',
        './src/fonts.js',
        './src/lied.js',
        './src/plugins.js',
        './src/audio.js',
        './src/canvas.js',
        './src/index.js'
    ],'dist');
});

gulp.task('build', gulp.series(['clean','browserhash']));

gulp.task('watch', function(){
    gulp.watch('./src/**/*.js',gulp.series(['build']));
});

gulp.task('default', gulp.series(['build']));