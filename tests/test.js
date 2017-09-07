'use strict';

let spawn = require('child_process').spawn,
    path = require('path'),
    chalk = require('chalk'),
    wctLocalBrowsers = require('wct-local/lib/browsers'),
    server = require('./server'),
    args = process.argv.slice(2);

// Sauce Labs compatible ports
// taken from https://docs.saucelabs.com/reference/sauce-connect/#can-i-access-applications-on-localhost-
// - 80, 443, 888: these ports must have root access
// - 5555, 8080: not forwarded on Android
const SAUCE_PORTS = [
2000, 2001, 2020, 2109, 2222, 2310, 3000, 3001, 3030, 3210, 3333, 4000, 4001,
4040, 4321, 4502, 4503, 4567, 5000, 5001, 5050, 5432, 6000, 6001, 6060, 6666,
6543, 7000, 7070, 7774, 7777, 8000, 8001, 8003, 8031, 8081, 8765, 8777, 8888,
9000, 9001, 9080, 9090, 9876, 9877, 9999, 49221, 55001
];

wctLocalBrowsers.detect((err, browsers) => {
    let port = SAUCE_PORTS[0],
        promises = Object.keys(browsers).map((key, index) => {
            return runCucumber(browsers[key], port);
        });
    server.listen(port, () => {
        Promise.all(promises).then((results) => {
            server.close();
            Object.keys(browsers).forEach((key, index) => {
                let browser = browsers[key];
                if (results[index]) {
                    console.log(chalk.green(`${browser.browserName} ${browser.version}: ✓`));
                } else {
                    console.log(chalk.red(`${browser.browserName} ${browser.version}: ✖`));
                }
            });
        });
    });
});

function runCucumber(capability, port) {
    return new Promise((resolve, reject) => {
        let childEnv = Object.assign({}, process.env, {
                CAPABILITY: JSON.stringify(capability),
                TEST_PORT: port,
                EXTERNAL_SERVER: true
            }),
            cucumber = spawn(path.join(__dirname, '../node_modules/.bin/cucumber-js'), args, {
            env: childEnv
        });

        cucumber.stdout.pipe(process.stdout);
        cucumber.stderr.pipe(process.stderr);

        cucumber.on('close', (code) => {
            return resolve(code === 0);
        });
    });
}
