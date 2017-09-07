'use strict';
let connect = require('connect'),
    serveStatic = require('serve-static'),
    history = require('connect-history-api-fallback');

module.exports = rootDir => {
    return connect()
        .use(history())
        .use(serveStatic(rootDir));
};
