const through = require('through2');
const libInst = require('istanbul-lib-instrument');
const instrumenter = libInst.createInstrumenter();
const path = require('path');

module.exports = (opts) => {
    opts = Object.assign({
        root: ''
    }, opts);
    return through.obj((file, encoding, callback) => {
        file.contents = new Buffer(instrumenter.instrumentSync(file.contents.toString(), path.join(opts.root, file.relative)));
        callback(null, file);
    });
};
