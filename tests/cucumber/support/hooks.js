
let {defineSupportCode} = require('cucumber'),
    World = require('./world'),
    server = require('../../server'),
    libCoverage = require('istanbul-lib-coverage'),
    reports = require('istanbul-reports'),
    libReport = require('istanbul-lib-report'),
    prepareCoverage = require('../../coverage'),
    coverageEnv = !!process.env.COVERAGE;

const SRC = './';

function generateCoverageReport() {
    return World.driver.executeScript('return window.__coverage__')
        .then(coverage => {
            let map = libCoverage.createCoverageMap(coverage);
            let context = libReport.createContext();
            let tree = libReport.summarizers.pkg(map);
            tree.visit(reports.create('lcov'), context);
        });
}

defineSupportCode(({BeforeAll, AfterAll, Before, After}) => {
    // Instumentalise code if in coverage mode
    let prepare = coverageEnv ? prepareCoverage(SRC) : Promise.resolve(SRC);

    // Start a server to deliver src files
    BeforeAll(function (e, callback) {
        prepare.then(loc => {
            World.createDriver();
            if (!process.env.EXTERNAL_SERVER) {
                server(loc).listen(World.getPort(), callback);
            } else {
                callback();
            }
        });
    });

    // Close the browser
    AfterAll(function () {
        let finalise = coverageEnv ? generateCoverageReport() : Promise.resolve();
        return finalise.then(() => World.driver.quit());
    });
});
