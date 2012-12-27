# JavaScriptMVC TodoMVC app

##Getting Started

JavaScriptMVC is a jQuery-based JavaScript framework that's excellent as a comprehensive front-end solution for structuring applications using the MVC architecture pattern.

It's broken down into 4 separate projects that can be used independently of each other. These are:

* jQueryMVC - MVC extensions for jQuery
* StealJS - Dependency management, build process, code generators
* FuncUnit - A web testing framework
* DocumentJS - A JavaScript documentation framework

For more information on getting started with the framework as a whole, you may find Justin Meyer's [documentation](https://gist.github.com/989117) on it  quite helpful. It discusses classes, models, views and controllers and is an overall good read for any developers wishing to begin using JMVC. Otherwise just consult directly the [official JavaScriptMVC docs](http://javascriptmvc.com/docs.html#!);


###Setup

To get started with the Todo application, you'll first need to clone the repository to a local directory. You have a few options of how to approach this.

###Cloning with submodules automatically synched

The repository also contains git submodules for jQueryMVC, StealJS, FuncUnit and DocumentJS out of the box. If you would like to check-out the code for the application including all submodules you can do so as follows:

```
git clone --recursive git://github.com/addyosmani/todo
```

Git 1.6.5 supports this however if you're using an older version of Git you can achieve the same effect using `git submodule update --init`

###Cloning with submodules manually 

Alternatively, you can checkout the main application files and clone the dependancies manually. To checkout the app simply execute:

```
git clone git@github.com:addyosmani/todo.git	
```

You can then either use *submodules* to checkout the submodules as their own repositories (eg. if you forked them from JMVC and wished to keep track of your own versions) or alternatively by cloning their repos locally.

###Submodules

```
git submodule add git://github.com/jupiterjs/steal.git steal
git submodule add git://github.com/jupiterjs/jquerymx.git jquery
git submodule add git://github.com/jupiterjs/funcunit.git funcunit
git submodule add git://github.com/jupiterjs/documentjs.git documentjs
```

Note that as per Bitovi's original Todo application, jquerymx is actually stored in the directory called jquery in case we decide to sync up any changes made without worrying about path differences.

###Cloning

Cloning repositories using GitHub is a fairly straight-forward process and the todo application just requires the following commands to be executed to get you setup:

```
git clone git://github.com/jupiterjs/steal.git
git clone git://github.com/jupiterjs/jquerymx.git
git clone git://github.com/jupiterjs/funcunit.git
git clone git://github.com/jupiterjs/documentjs.git
```

###Structure

In order to correctly build the todo application, you'll need to ensure that you have the following directory structure, unless you decide to change the build files in the todo/scripts directory:

```
documentjs (<< optional for creating documentation)
funcunit
jquery
steal
todo
	index.html, todo.js etc.
	scripts
	test
```

###Building

Within todo, you'll find the main application (todo.js) as well as two additional folders. The *scripts* folder contains the build files needed to build the final production files required for the app to run, whilst the *test* folder contains the FuncUnit and QUnit files required for testing. Let's take a look at todo/scripts/build.js:

```
load("steal/rhino/rhino.js");
steal('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('todo/scripts/build.html',{to: 'todo'});
});
```

In this simple build file, we're telling out build process to load steal.js from the rhino directory (for more on Rhino, see here: http://www.mozilla.org/rhino/doc.html) and then *steal* (ie. load within the context of a script loader) the steal plugins we'll be using for our build. 

We finally define the build actions required, which essentially allows us to specify the build source (todo/todo/scripts/build.html) and the build target (todo/todo). In case you're wondering what build.html does, it effectively tells steal.js to build the application within the folder todo as follows:

```
<script type="text/javascript" src="../steal/steal.js?todo/todo.js">
```

The above instruction basically tells the app to load in "development" mode, meaning the uncompressed files. If you desire to build the application in order to instruct JMVC to output the production-ready version of your code, execute the following command where we pass our build.js file as an argument to steal's builder.

```
./js todo/scripts/build.js 				(on unix systems)
js.bat todo\scripts\build.js 			(on windows)
```

As a consequence you'll get a `production.js` and possibly (if any CSS is being loaded with steal) a `production.css` file. For then loading the app in "production" mode you have to slightly change the script include to the following:

```
<script type="text/javascript" src="../steal/steal.production.js?todo/production.js">;
```

