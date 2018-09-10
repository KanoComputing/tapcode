const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8000';

suite('navigation', () => {
    let browser;
    let page;

    suiteSetup(async () => {
        browser = await puppeteer.launch({ headless: false });
    });

    setup(async () => {
        page = await browser.newPage();
    });
    test('should load', async () => {
        await page.goto(BASE_URL);
        await page.waitFor('tc-app');
    });
    teardown(async function teardown() {
        await page.close();
    });

    suiteTeardown(async () => {
        await browser.close();
    });
});
