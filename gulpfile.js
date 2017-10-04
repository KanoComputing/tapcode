const gulp = require('gulp');
const path = require('path');
const gulpIf = require('gulp-if');
const cssSlam = require('css-slam').gulp;
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const htmlMinifier = require('gulp-html-minifier');
const htmlReplace = require('gulp-html-replace');
const htmlAutoprefixer = require('gulp-html-autoprefixer');

const del = require('del');
const mergeStream = require('merge-stream');
const polymerBuild = require('polymer-build');

const polymerJson = require('./polymer.json');
const swPrecacheConfig = require('./sw-precache-config.js');
const project = new polymerBuild.PolymerProject(polymerJson);
const targetDir = 'www';


function waitFor(stream) {
    return new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

function build() {
    return new Promise((resolve, reject) => {
        let srcSplit = new polymerBuild.HtmlSplitter();
        let depsSplit = new polymerBuild.HtmlSplitter();

        let src = project.sources()
            .pipe(srcSplit.split())

            .pipe(gulpIf(/\.js$/, 
                babel({
                    presets: ['es2015']
                }))
            )
            .pipe(gulpIf(/\.js$/, uglify()))
            .pipe(gulpIf(/\.(css|html)$/, htmlAutoprefixer()))
            .pipe(gulpIf(/\.(css|html)$/, cssSlam()))
            .pipe(gulpIf(/\.html$/, htmlReplace({
                es5adapter: '<script src="./bower_components/webcomponentsjs/custom-elements-es5-adapter.js"></script>'
            })))
            .pipe(gulpIf(/\.html$/, htmlMinifier({
                removeComments: true,
                collapseWhitespace: true
            })))

            .pipe(srcSplit.rejoin());

        let deps = project.dependencies()
            .pipe(depsSplit.split())
            .pipe(gulpIf(/\.js$/, 
                babel({
                    ignore: [
                        'bower_components/webcomponentsjs/custom-elements-es5-adapter.js'
                    ],
                    presets: ['es2015']
                }))
            )
            .pipe(gulpIf(/\.js$/, uglify()))
            .pipe(gulpIf(/\.(css|html)$/, htmlAutoprefixer()))
            .pipe(gulpIf(/\.(css|html)$/, cssSlam()))
            .pipe(gulpIf(/\.html$/, htmlMinifier({
                removeComments: true,
                collapseWhitespace: true
            })))
            .pipe(depsSplit.rejoin());

        let build = mergeStream(src, deps)
            .pipe(project.bundler())
            .pipe(project.addPushManifest())
            .pipe(gulp.dest(targetDir));

        return waitFor(build).then(() => {
            return polymerBuild.addServiceWorker({
                project: project,
                buildRoot: targetDir,
                bundled: true,
                swPrecacheConfig: swPrecacheConfig
            });
        })
        .then(resolve)
        .catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}

gulp.task('clean', () => {
    return del([targetDir]);
});

gulp.task('build', ['clean'], build);
gulp.task('default', ['build']);