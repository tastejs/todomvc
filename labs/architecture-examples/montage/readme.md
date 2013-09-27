# MontageJS TodoMVC Example

> MontageJS is a client-side HTML5 framework for building rich single-page applications. It offers time-tested patterns and principles, a modular architecture, and a friendly method to achieve a clean separation of concerns.
> 
> _[MontageJS - montagejs.org](http://montagejs.org)_

## Learning MontageJS
The [MontageJS](http://montagejs.org) website is a great resource for getting started.

Here are some links you may find helpful:

* [Quick Start](http://montagejs.org/docs/montagejs-setup.html)
* [Demos](http://montagejs.org/docs/montagejs-examples.html)
* [API Reference](http://montagejs.org/api/)
* [Applications built with MontageJS](http://montagejs.org/apps/)
* [Blog](http://montagejs.org/blog/)
* [FAQ](http://montagejs.org/docs/faq.html)
* [MontageJS on GitHub](https://github.com/montagejs/montage)

Articles and guides from the community:

* [YouTube - Getting Started](http://www.youtube.com/watch?v=JfT1ML200JI)
* [My First MontageJS Application](http://renaun.com/blog/2013/05/my-first-montagejs-application/)

Get help from other Montage users:

* [IRC](http://webchat.freenode.net/?channels=montage)
* [MontageJS on Google Groups](https://groups.google.com/forum/?hl=en&fromgroups#!forum/montagejs)
* [MontageJS on Twitter](http://twitter.com/montagejs)
* [MontageJS on Google +](https://plus.google.com/116915300739108010954)


## Application Structure
MontageJS applications follow a unified directory structure that makes it easy to look for and add files. The following table provides a brief description of the TodoMVC application's directory structure.

Folder / File | Description |
------------ | ------------- 
assets | Contains global styles and the background image for the TodoMVC application.
core | Contains the data model.
index.html | Is the entry-point HTML document.  
LICENSE.md | Contains copyright information.
package.json | Describes your app and its dependencies.  
README.md | Describes the TodoMVC application. 
ui | Contains the user interface components of the TodoMVC application, main.reel and todo-view.reel.

## Running the TodoMVC Example

MontageJS application development depends on npm, the Node package manager, which is distributed with Node.js. If you haven't done so already, be sure to [download](http://nodejs.org/download/) and run the prebuilt Node.js installer for your platform from the Node.js website. Then, to run the TodoMVC example locally, follow these steps:

1. Clone the todo-mvc [GitHub repo](https://github.com/montagejs/todo-mvc) in your desktop.
2. Use your command line tool to navigate to the cloned todo-mvc directory and install the modules required to run the demo:

   ```
   cd todo-mvc
   npm update
   ```
   
3. Spin up your preferred HTTP server and point your browser to the associated port.

    > During development MontageJS applications rely on XHR to load their various components and modules, which is why you will need a web server to serve the demo.
    > If you happen to have [minit](https://github.com/montagejs/minit), the Montage Initializer, installed (`npm install minit -g`) you can run `minit serve` from within the demo directory to set up a server on demand.
    
## A Note about the Source
You are looking at the nonminified source code of the application. MontageJS application development is divided into a development (creating the app) phase and a production (compiling the app) phase. During production—before submitting the application to the TodoMVC site—we use the Montage Optimizer (Mop) to minify the source code and create "bundles" (files) that consist of the application code and its dependencies, ready for deployment.

## Credit

This TodoMVC application was created by [Montagejs](http://montagejs.org).
