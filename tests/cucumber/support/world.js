'use strict';

let webdriver = require('selenium-webdriver'),
    {defineSupportCode} = require('cucumber'),
    fs = require('fs'),
    path = require('path'),
    should = require('should');

const DEFAULT_TIMEOUT = process.env.EXTERNAL_SERVER ? 20000 : 10000,
    INIT_SCRIPT = fs.readFileSync(path.join(__dirname, '../../scripts/init.js')).toString(),
    ELEMENTS_SELECTORS = {};

ELEMENTS_SELECTORS['editor'] = ['#editor'];


function buildDriver(capabilities) {
    return new webdriver.Builder()
        .withCapabilities(capabilities)
        .build();
}

class CustomWorld {
    constructor () {
        this.shadowEnabled = false;
        this.routeMap = {
            'editor': '/'
        };
        this.driver = CustomWorld.createDriver();
        this.store = {};
    }

    static createDriver () {
        if (!CustomWorld.driver) {
            let capabilities = webdriver.Capabilities.chrome(),
                chromeOptions = {
                'args': ['--test-type', '--start-maximized', '--disable-popup-blocking']
            };
            capabilities.set('build', `${process.env.JOB_NAME}__${process.env.BUILD_NUMBER}`);
            capabilities.set('chromeOptions', chromeOptions);
            CustomWorld.driver = buildDriver(capabilities);
        }
        return CustomWorld.driver;
    }

    static getPort () {
        return process.env.TEST_PORT || 4444;
    }

    setup () {
        this.driver.executeScript(INIT_SCRIPT);
    }

    getLogs () {
        return this.driver.manage().logs().get('browser');
    }

    getEditorElement (element) {
        return this.getRootElement()
            .then(viewElement => {
                let selectors;
                if (element) {
                    selectors = ELEMENTS_SELECTORS[element];
                }
                return this.findElement(viewElement, selectors);
            });
    }

    waitForRootElement (timeout) {
        return this.driver.wait(() => {
            return this.driver.executeScript(`return document.querySelector('tc-app') && document.querySelector('tc-app').shadowRoot;`)
                .then(rootElement => {
                    return rootElement;
                })
        }, 10000, 'App didn\'t load');
    }

    getRootElement () {
        return this.driver.executeScript(`return document.querySelector('tc-app').shadowRoot;`)
            .then(rootElement => {
                return rootElement;
            });
    }

    findElement (root, selectors) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__findElement__(arguments[0], arguments[1])', root, selectors)
                .then(el => {
                    return el;
                })
        }, 5000, `Element not found with selectors: ${selectors}`);
    }

    findElements (root, selector) {
        return this.driver.executeScript(`return arguments[0].querySelectorAll('${selector}')`, root);
    }

    waitForElementToBeVisible (element, timeout=2000) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__isVisible__(arguments[0])', element)
                .then(visible => visible.should.be.true());
        }, timeout, 'Element is not visible');
    }

    ensureElementIsNotVisible (element, timeout=200) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__isVisible__(arguments[0])', element)
            .then(visible => visible.should.be.false());
        }, timeout, 'Element is visible');
    }

    openApp (page) {
        let route;
        page = page || 'editor';
        this.setup();
        route = this.routeMap[page];
        if (!route) {
            return Promise.reject(new Error(`Tried to open a non registered page: ${page}`));
        }
        this.page = page;
        return this.driver.get(`http://localhost:${CustomWorld.getPort()}${route}`)
            .then(() => this.setup())
            .then(() => this.waitForRootElement());
    }

    wait (duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }
}

defineSupportCode(({setWorldConstructor, setDefaultTimeout}) => {
    setWorldConstructor(CustomWorld);
    setDefaultTimeout(60 * 1000);
});

module.exports = CustomWorld;
