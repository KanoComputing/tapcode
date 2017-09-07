const path = require('path');
const {defineSupportCode} = require('cucumber');

defineSupportCode(({Given}) => {

    Given('the app is opened', function () {
        return this.openApp();
    });



});
