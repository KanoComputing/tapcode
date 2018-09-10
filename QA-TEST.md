# QA Test

In this repo is setup the basics of automated tests. Tests are automated using puppeteer and can be found in the `test` directory.

This test consist of 6 tasks. Read them all before starting to get an overall view of where you are heading.
After you are done reading all the instructions, you can ask a few questions if you need to to make sure you are not blocked right away.
The same thing applies for the setup, if you are blocked at this step, you can ask for help.
It is recommended to work on the tasks in order as some tasks rely on the previous one being completed.

## Setup

Setup this repo by running:

Install the sources dependencies:
```
bower i
```

Install the build and test dependencies:
```
npm i
```

Alternatively, you can use yarn:
```
yarn
``

## Run the tests

Run `npm run serve` to serve the sources on the 8000 port. Then run `npm run test`.

You can alternatively use `yarn` if you want to. (`yarn serve`, `yarn test`).

# 1. Ready event

The first and only test waits for the element `tc-app` to exist in the DOM. We want to listen to a `ready` event instead to ensure the app finished its setup before continuing the tests.

 - Change the app sources to emit a `ready` event. (It should emit in the `connectedCallback` function of the element `tc-app`).
 - Update the test to wait for this event to be triggered instead of waiting for the DOM element.

# 2. Shadow DOM

This application relies on WebComponents and uses the ShadowDOM. ShadowDOM is a web API allowing applications to scope parts of the DOM for styling and performances purposes.
This means that an element under a shadow root won't be accessible using a classic CSS selector (See more here https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

 - Add a utility function to the tests to query elements inside a shadow root (Function available here under the name `findInShadowDom`: https://gist.github.com/ChadKillingsworth/d4cb3d30b9d7fbc3fd0af93c2a133a53)
 - Update the initial test to query the `Drawing` tab using the added utility function and assert that it is selected by default.

# 3. Interaction

When clicking on a code snippet in the toolbox, the code in the editor should update with the correct value.

 - Add a test that clicks on the `moveTo(x, y)` snippet and asserts that the code in the editor now reads `moveTo(10, 10);`
 - Update this test to assert that the numpad appear
 - Update this test to type in the numpad a number and assert that this change is reflected in the editor (e.g. click the `4` button then the `2` button, the editor should show `moveTo(42, 10)`)

# 4. Navigation

In the sidebar menu, the user can click on the `More from Kano` link.

 - Write a new test that opens the sidebar menu then clicks on the `More from Kano` link.
 - Assert that the browser opens a new tab to `https://kano.me/`.

# 5. New Creation

When the user clicks on the `New` button in the sidebar, the editor is reset.

 - Add a test that adds a some code in the editor (Clicks on code snippets) then
 - Opens the sidebar then
 - Click on new then
 - Assert that the editor is reset

# 6. Screenshots

We want to visualize layout issues on every new code pushed to the repo. Add an option to run the tests with a specific device resolution and pixel density and to export screenshots.

If this command is executed, I expect a screenshot to be exported at the end of every test to the `screenshots` directory. But only if the env variable `SCREENSHOT` is set.
`DEVICE="Galaxy S5" SCREENSHOT="true" npm run test`