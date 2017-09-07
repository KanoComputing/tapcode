const {defineSupportCode} = require('cucumber');

defineSupportCode(({Then}) => {

    Then(/^(the )?(.+) should (not )?be visible$/, function (arg0, arg1, arg2) {
        return this.getEditorElement(arg1)
            .then(el => {
                if (arg2) {
                    return this.ensureElementIsNotVisible(el);
                } else {
                    return this.waitForElementToBeVisible(el);
                }
            });
    });

});
