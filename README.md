# Tapcode

Taptype is a creative-code web-app with a mobile-first design. Users can code with a set array of code snippets to draw on a HMTL5 canvas directly beneath the code editor.
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org)
- [Bower](https://bower.io)

### Installation


```shell
npm install
bower install
```

- <strong>npm</strong> will install the build- and test dependencies into the <strong>node_modules</strong> directory
- <strong>bower</strong> will install the front end dependencies into the <strong>bower_components</strong> directory

### Development

The project is a single-page application. To serve the app folder, run

```shell
npm run serve
```

..and open your browser at [http://localhost:8081](http://localhost:8081)

In development mode, the intro screen and typing animations are shortened. You can control this with the Kano.Tapcode.Config.DEBUG property in <strong>src/config/development.html</strong>