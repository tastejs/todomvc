#  JavaScriptMVC Todo Application

###Why this fork?

I began this fork of the useful JMVC Todo application as I felt it was missing a number of things including:
<ul>
<li>Setup documentation (which I've written up below)</li>
<li>A directory structure that matches what the build files originally defined require</li>
<li>Minor changes to help it fall in line with the Backbone and Spine todo apps including UI features and stylistic changes.</li>
<li>Pre-built production.js and production.css files so users could test the app right out of the box (as long as steal etc. are available)</li>
</ul>

##Getting Started

JavaScriptMVC is a jQuery-based JavaScript framework that's excellent as a comprehensive front-end solution for structuring applications using the MVC architecture pattern.

It's broken down into 4 separate projects that can be used independently of each other. These are:
<ul>
	<li><b>jQueryMVC</b> - MVC extensions for jQuery</li>
	<li><b>StealJS</b> - Dependency management, build process, code generators</li>
	<li><b>FuncUnit</b> - A web testing framework</li>
	<li><b>DocumentJS</b> - A JavaScript documentation framework</li>
</ul>

For more information on getting started with the framework as a whole, you may find Justin Meyer's documentation on it here https://gist.github.com/989117 quite helpful. It discusses classes, models, views and controllers and is an overall good read for any developers wishing to begin using JMVC.


###Setup

To get started with the Todo application, you'll first need to clone the repository to a local directory. You have a few options of how to approach this.

###Cloning with submodules automatically synched

The repository also contains git submodules for jQueryMVC, StealJS, FuncUnit and DocumentJS out of the box. If you would like to check-out the code for the application including all submodules you can do so as follows:

<pre>
git clone --recursive git://github.com/addyosmani/todo
</pre>

Git 1.6.5 supports this however if you're using an older version of Git you can achieve the same effect using <pre>git submodule update --init</pre>

###Cloning with submodules manually 

Alternatively, you can checkout the main application files and clone the dependancies manually. To checkout the app simply execute:

<pre>
git clone git@github.com:addyosmani/todo.git	
</pre>

You can then either use *submodules* to checkout the submodules as their own repositories (eg. if you forked them from JMVC and wished to keep track of your own versions) or alternatively by cloning their repos locally.

###Submodules
<pre>
git submodule add git://github.com/jupiterjs/steal.git steal
git submodule add git://github.com/jupiterjs/jquerymx.git jquery
git submodule add git://github.com/jupiterjs/funcunit.git funcunit
git submodule add git://github.com/jupiterjs/documentjs.git documentjs
</pre>

Note that as per JupiterIT's original Todo application, jquerymx is actually stored in the directory called jquery in case we decide to sync up any changes made without worrying about path differences.

###Cloning

Cloning repositories using GitHub is a fairly straight-forward process and the todo application just requires the following commands to be executed to get you setup:

<pre>
git clone git://github.com/jupiterjs/steal.git
git clone git://github.com/jupiterjs/jquerymx.git
git clone git://github.com/jupiterjs/funcunit.git
git clone git://github.com/jupiterjs/documentjs.git
</pre>

###Structure

In order to correctly build the todo application, you'll need to ensure that you have the following directory structure, unless you decide to change the build files in the todo/scripts directory:

<pre>
funcunit
jquery
steal
todo
	todo
		index.html, todo.js etc.
		scripts
		test
</pre>



###Building

Within todo/todo, you'll find the main application (todo.js) as well as two additional folders. The *scripts* folder contains the build files needed to build the final production files required for the app to run, whilst the *test* folder contains the FuncUnit and QUnit files required for testing. Let's take a look at todo/todo/scripts/build.js:

<pre>
load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('todo/todo/scripts/build.html',{to: 'todo/todo'});
});
</pre>

In this simple build file, we're telling out build process to load steal.js from the rhino directory (for more on Rhino, see here: http://www.mozilla.org/rhino/doc.html) and then *steal* (ie. load within the context of a script loader) the steal plugins we'll be using for our build. 

We finally define the build actions required, which essentially allows us to specify the build source (todo/todo/scripts/build.html) and the build target (todo/todo). In case you're wondering what build.html does, it effectively tells steal.js to build the application within the folder todo/todo as follows: 

<pre>
&lt;script type=&#39;text/javascript&#39; src=&#39;../../../steal/steal.js?todo/todo&#39;&gt;
</pre>

You of course don't have to output your build files to the same directory as your application source, however as both our outputs have names which are different to the source files, I think this works fine for our example.

Finally, to perform the application build so that JMVC outputs the production-ready version of your code, execute the following command where we pass our build.js file as an argument to steal's builder.

<pre>
./steal/js todo/todo/scripts/build.js
</pre>


