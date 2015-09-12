# Atma.js TodoMVC Example

> Fast, elegant and component oriented framework for desktops, mobiles or servers _(Node.js)_
> _[Atma - atmajs.com](http://atmajs.com)_

The framework consists of several stand-alone libraries. This approach not only reduces barriers to entry, but also
allows developers to exclude or replace any library with other third party one.

The goal of the framework is to deliver the component-based development and to provide libraries for making their composition easily and with blazing fast performance _(even on mobile CPUs)_.

## Learning Atma.js

#### ClassJS
[web-page](http://atmajs.com/class) [GitHub](http://github.com/atmajs/ClassJS)

— is a class-model implementation. A business logic layer for applications. It accumulates best practices of the OOP and supports model de-/serialization with the persistence to localStorage, RESTful service or MongoDB. Any additional adapter can be created by the developer.


#### MaskJS
[web-page](http://atmajs.com/mask) [GitHub](https://github.com/atmajs/MaskJS)

— is the core library of the Atma.js framework. It brings HMVC engine into play and everything starts with the markup. Along HTML, more compact and component-oriented syntax can be used, which is similar to LESS and Zen Coding. But not the syntax is the advantage of the mask markup, but the DOM creation approach. Mask or HTML templates are prarsed to the tiny MaskDOM AST. And while traversing the MaskDOM, the builder creates DOM Elements and initializes components. As the MaskDom structure is extremely lightweight, each component can easily manipulate the MaskDOM. So the all dynamic behavior, like interpolation, 1-/2way-binding, component's nesting and many other things, are almost for free in sens of the performance. Beyond fast DOM creation there are other distinguishing features:

- model agnostic
- components hierarchy
	- better referencing via `find/closest` search _in a jQuery way)_
	- better communication via signals and slots. _Piped-signals are used to bind components, that are not in ascendant-descendant relation, but anywhere in an app_
- one-/two-way bindings with complex object observers, so even if deep, nested path to the property is used, any manipulations with the model preserve observers in place
- modules. Can load: Mask, Html, Javascript, Css, Json
- custom attribute handlers
- designed to be used with other libraries. For example, with small wrappers we can encapsulate twitter bootstrap markups and widgets initializations
- high code reuse

To mention is, that the templates and the components can be rendered on the server side.


#### IncludeJS
[web-page](http://atmajs.com/include) [GitHub](https://github.com/atmajs/IncludeJS)

— is created to load component's resources and to work in browsers and Node.js the same way.

Some key points of the library are:

- no requirements for the module definition, but supports several: CommonJS and `include.exports`
- in-place dependency declaration with nice namespaced routing
- custom loaders. _Already implemented `coffee, less, yml, json`_
- lazy modules
- better debugging: loads javascript in browsers via `script src='x'`
- for production builder can combine and optimize all resources into single `*.js` and single `*.css`. All the templates are embedded into main `*.html`. _Developing a web page using Atma Node.js application module, builder also creates additionally single js/css/html files per page from the components that are specific to a page_


##### µTest
[GitHub](https://github.com/atmajs/utest)

— Simplifies unit-test creation and runs them in Node.js or in browser-slave(s) environments. All the Atma.js libraries are tested using the µTest.

##### DomTest
[GitHub](https://github.com/atmajs/domtest)

The module is embedded into the µTest library and allows the developer to easily write test suites for the UI using MaskJS syntax.

##### Ruta
[GitHub](https://github.com/atmajs/Ruta)

— is not only an url routing via History API or `hashchange`, but it implements a Route-Value Collection for adding/retrieving any object by the route.

#### Atma.Toolkit
[GitHub](https://github.com/atmajs/Atma.Toolkit)

— command-line tool, which runs unit tests, builds applications, runs Node.js `bash` scripts, creates static file server with live reload feature, etc.

### Mask.Animation
[GitHub](https://github.com/atmajs/mask-animation)

— CSS3 and sprite animations for MaskJS.


### Atma.js Server Application
[web-page](http://atmajs.com/atma-server) [GitHub](https://github.com/atmajs/atma-server)

— a connect middle-ware. All the routes are declared in configuration files, and there are 3 types of endpoints:

- Handlers
- RESTful services
- Pages

Pages benefits from component based approach. Each component's controller can define caching settings, so that the component renders only once. Developer can restrict any component for the server side rendering only, so that the controller itself and any sensitive data is not sent to the client. When a component is rendered, then only HTML is sent to the client, _where all bindings and event listeners are attached_. So it is extremely SEO friendly.

Here are some links you may find helpful:

- [Get Started](http://atmajs.com/get/github)
- [Mask Markup Live Test](http://atmajs.com/mask-try)
- Mask Syntax Plugins
	- [Sublime](https://github.com/tenbits/sublime-mask)
	- [Atom](https://github.com/tenbits/package-atom)
	
- [Atma.js on GitHub](https://github.com/atmajs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._

### Implementation

The Application is split into components hierarchy, and so the application structure consists of a component and a business logic Layer. Components have the resources (_that are component specific, like styles / templates and other nested components_) in the same or a sub-folder. These makes it easer to _reuse_ them in other applications and makes it easer to develop and test them. Atma.js is not a opinionated, but extremely flexible framework, so that the developer can choose the way he wants to structure the applications architecture. This demo application just demonstrates one possible way.

### Run

Open `index.html` as a file in browser or run a static server:

```bash
# install atma.toolkit
$ npm install atma --global
$ atma server
```

navigate to `http://localhost:5777/`

### Build

To build the application for release, run `$ atma build --file index.html --output release/`. 


## Contact
- [team@atmajs.com](mailto:team@atmajs.com)
- [Google Group QA](https://groups.google.com/forum/#!forum/atmajs)
