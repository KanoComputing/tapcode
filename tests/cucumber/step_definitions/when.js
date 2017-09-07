const {defineSupportCode} = require('cucumber');

defineSupportCode(({When}) => {
    this.World = require('../support/world').World;
});
