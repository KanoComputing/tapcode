'use strict';

window.__findElement__ = function (root, selectors) {
    function findElement(selectors) {
        var currentElement = root,
            i;
        if (currentElement.shadowRoot) {
            currentElement = currentElement.shadowRoot;
        }
        for (i = 0; i < selectors.length; i++) {
            if (i > 0) {
                currentElement = currentElement.shadowRoot;
            }

            currentElement = currentElement.querySelector(selectors[i]);

            if (!currentElement) {
                break;
            }
        }

        return currentElement;
    }

    if (!(document.body.createShadowRoot || document.body.attachShadow)) {
        selectors = [selectors.join(' ')];
    }
    return findElement(selectors);
};

window.__findElements__ = function (root, selector) {
    return root.querySelectorAll(selector);
};

window.__isVisible__ = function (element) {
    var rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
};


Object.defineProperty(window, 'onbeforeunload', {
    get: function () {
        return null;
    },
    set: () => {}
});
