# MontageJS TodoMVC Example

> MontageJS is a client-side HTML5 framework for building rich single-page applications. It offers time-tested patterns and principles, a modular architecture, and a web designer friendly method to achieve a clean separation of concerns. MontageJS has a dedicated, cloud-based, visual authoring environment that provides instant responsive feedback.

> 
> _[MontageJS - http://montagestudio.com/montagejs/](http://montagestudio.com/montagejs/)_

## Learning MontageJS
The [Montage Studio](http://montagestudio.com/montagejs/) website is a great resource for getting started.

Here are some links you may find helpful:

* [Quick Start](http://docs.montagestudio.com/montagejs/montagejs-setup.html)
* [Demos](http://docs.montagestudio.com/montagejs/montagejs-examples.html)
* [API Reference](http://docs.montagestudio.com/api/Component.html)
* [Applications built with MontageJS](http://montagestudio.com/gallery/)
* [Blog](http://montagestudio.com/blog/)
* [FAQ](http://docs.montagestudio.com/montagejs/faq.html)
* [MontageJS on GitHub](https://github.com/montagejs/montage)

Articles and guides from the community:

* [Screencast of SF HTML5 Live Code - Montage Studio with Ryan Paul](https://www.youtube.com/watch?v=aLT1ZmISKhw)
* [My First MontageJS Application](http://renaun.com/blog/2013/05/my-first-montagejs-application/)
* [Building a Simple Reddit Client with MontageJS](http://docs.montagestudio.com/montagejs/tutorial-reddit-client-with-montagejs.html)


Get help from other Montage users:

* [Forum](http://forum.montagestudio.com/)
* [Montage Studio on Twitter](http://twitter.com/montagejs)
* [Montage Studio on Facebook](https://www.facebook.com/montagestudio)
* [Montage Studio on Google +](https://plus.google.com/+Montagestudio/about)


## Application Structure
MontageJS applications follow a unified directory structure that makes it easy to look for and add files. The following table provides a brief description of the TodoMVC application's directory structure.

Folder / File | Description |
------------ | ------------- 
assets | Contains global styles and the background image for the TodoMVC application.
core | Contains the data model.
index.html | Is the entry-point HTML document.  
LICENSE.md | Contains copyright information.
readme.md | Describes the TodoMVC application. 
ui | Contains the user interface components of the TodoMVC application, main.reel and todo-view.reel.


## Running the TodoMVC Example in Montage Studio

Working in Montage Studio is radically simplifying how you work on a project. If you have a Github account, you're ready to work in Montage Studio. Just like GitHub, Montage Studio's workstation is free to use for open source repos. You can serve your app from your workstation to the multiple target devices. As you add, remove configure components to your project, or event edit CSS, Montage Studio apply your changes in real time to connected devices running you app, through the cloud. Instant responsive feedback!

1. Fork the todo-mvc [GitHub repo](https://github.com/montagejs/todo-mvc) in your GitHub account.

2. If it's your first time, [please join our beta](http://montagestudio.com/reveal/). You'll receive an email with a link to get in Montage Studio. 

3. In the list of montage projects on the right, click todo-mvc. Montage Studio will checkout the project from GitHub in a private  Docker container, npm install and then load the editor.

4. Once loaded, you can launch the app by clicking the Play button right next to the project's name on the top left.

5. To take a tour of Montage Studio, take a look [here](http://docs.montagestudio.com/montage-studio/ide-at-a-glance.html)



## Running the TodoMVC Example on your local system

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
You are looking at the minified source code of the application. MontageJS application development is divided into a development (creating the app) phase and a production (packaging/bundling the app) phase. During production—before submitting the application to the TodoMVC site—we use the Montage Optimizer (Mop) to minify the source code and create "bundles" (files) that consist of the application code and its dependencies, ready for deployment.

## Credit

This TodoMVC application was created by [Montage Studio](http://montagestudio.com).
