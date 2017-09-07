const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

function hasExt(ext) {
    return (file) => {
        return file.relative.toLowerCase().split('.').pop() === ext;
    };
}

gulp.task('clean', () => {
    return gulp.src(['./www', './.tmp'], {read: false})
        .pipe($.clean());
});

gulp.task('copy-assets', ['clean'], () => {
    return gulp.src('./app/assets/*')
        .pipe(gulp.dest('./www/assets'));
});

/*
 * We copy these separately to avoid transpiling them to ES5
 * as per the docs: https://www.polymer-project.org/2.0/docs/es6
*/
gulp.task('copy-scripts', ['clean'], () => {
    return gulp.src(['./app/bower_components/webcomponentsjs/**/*',
                     './app/bower_components/shadycss/**/*'],
                    {base: './app/'})
        .pipe(gulp.dest('./.tmp/'));
});

gulp.task('transpile', ['clean'], () => {
    return gulp.src('./app/index.html', {base: './app'})
        .pipe($.vulcanize({
            /* Important so we don't transpile the polyfils */
            inlineScripts: false
        }))
        .pipe($.crisper({
            /* Important to preserve the order of the scripts */
            scriptInHead: false
        }))
        .pipe($.if(hasExt('js'), $.babel({
            presets: ['es2015']
        })))
        .pipe($.if(hasExt('js'), $.uglify()))
        /* For some reason, html-replace must be at the end */
        .pipe($.if(hasExt('html'), $.htmlReplace({
            es5adapter: '<script src="./bower_components/webcomponentsjs/custom-elements-es5-adapter.js"></script>'
        })))
        .pipe(gulp.dest('./.tmp/'));
});

gulp.task('build', ['copy-assets', 'copy-scripts', 'transpile'], () => {
    return gulp.src('./.tmp/index.html', { base: './.tmp' })
        /* Vulcanize again to inline scripts */
        .pipe($.vulcanize({ inlineScripts: true }))
        .pipe($.htmlAutoprefixer())
        .pipe($.crisper())
        .pipe($.if(hasExt('html'), $.htmlmin()))
        .pipe(gulp.dest('./www'));
});

gulp.task('default', ['build']);