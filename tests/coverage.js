const gulp = require('gulp');
const os = require('os');
const path = require('path');
const instrument = require('./instrument');
const gulpIf = require('gulp-if');
const crisper = require('gulp-crisper');
const WORK_DIR = os.tmpDir();
const SRC_PATH = path.join(WORK_DIR, 'src');
const SRC_INSTR_PATH = path.join(WORK_DIR, 'src-instrumented');

function isSource(file) {
    return !file.isDirectory() && (file.relative.startsWith('scripts') || file.relative.startsWith('elements'));
}

function needsCrisper(file) {
    let extname = file.relative.split('.').pop();
    return isSource(file) && extname === 'html';
}

function needsInstrument(file) {
    let extname = file.relative.split('.').pop();
    return isSource(file) && extname === 'js';
}

function prepare(srcDir) {
    return new Promise((resolve, reject) => {
        gulp.src(srcDir + '/**/*')
            .pipe(gulpIf(needsCrisper, crisper({ scriptInHead: false })))
            .pipe(gulp.dest(SRC_PATH))
            .on('end', () => {
                gulp.src(SRC_PATH + '/**/*')
                    .pipe(gulpIf(needsInstrument, instrument({ root: SRC_PATH })))
                    .pipe(gulp.dest(SRC_INSTR_PATH))
                    .on('end', () => {
                        resolve(SRC_INSTR_PATH);
                    });
            });
    });
}

module.exports = prepare;
