# Getting Started

Enter you project directory and create `package.json`

```javascript
{
  "scripts": {
    "build": "tsc",
    "typings:install": "typings install"
  },
  "dependencies": {
    "backbone": "^1.3.3",
    "underscore": "^1.8.3",
    "backbone.nativeview": "^0.3.3",
    "es6-shim": "github:paulmillr/es6-shim",
    "ng-backbone": "^0.1.5",
    "systemjs": "^0.19.36",
    "typescript": "^1.8.10"
  }
}
```

Install dependencies
```
npm install
```

Install typings

```
npm run typings:install
```

Create `tsconfig.json`

```javascript
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": true,
    "outDir": "build/"
  },
  "files": [
    "./typings/index.d.ts",
    "./src/app.ts"
  ]
}
```


Create `index.html`

```html
<html>
  <body>
  <ng-app>Loading ...</ng-app>

  <!-- ES6 shim -->
  <script type="text/javascript" src="../node_modules/es6-shim/es6-shim.min.js"></script>

  <!-- Backbone -->
  <script type="text/javascript" src="../node_modules/underscore/underscore-min.js"></script>
  <script type="text/javascript" src="../node_modules/backbone/backbone-min.js"></script>
  <script type="text/javascript" src="../node_modules/backbone.nativeview/backbone.nativeview.js"></script>

  <!-- Module loader -->
  <script type="text/javascript" src="../node_modules/systemjs/dist/system.src.js"></script>

  <script>

  System.config({
    paths: {
        "*": "node_modules/*"
     },
    packageConfigPaths: [ "./node_modules/*/package.json" ],
    packages: {
      ".": {
        format: "cjs",
        defaultExtension: "js"
      }
    }
  });
  System.import( "./build/app" );

  </script>

  </body>
</html>

```

Create first module `src/app.ts`

```
import { Component, View } from "ng-backbone";

@Component({
  el: "ng-hello",
  template: `Hello World!`
})

class HelloView extends View {
}

let hello = new HelloView();
hello.render();
```

Build the app:

```
npm run build
```

Open `index.html` in a browser and observe  it displays `Hello World!`


# Bundled JavaScript

Alternatively you bundle all the modules into a single file:

```
browserify build/src/app.js -o build/app.bundled.js
```

This way you do not need SystemJS section in `index.html` but simply loading the generated file
```
<script type="text/javascript" src="build/app.bundled.js"></script>
```