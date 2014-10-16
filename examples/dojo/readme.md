# Dojo TodoMVC Example

> Dojo saves you time and scales with your development process, using web standards as its platform. It’s the toolkit experienced developers turn to for building high quality desktop and mobile web applications.

> _[Dojo - dojotoolkit.org](http://dojotoolkit.org)_


## Learning Dojo

The [Dojo website](http://dojotoolkit.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://dojotoolkit.org/documentation)
* [Getting started guide](https://dojotoolkit.org/reference-guide/1.8/quickstart)
* [API Reference](http://dojotoolkit.org/api)
* [Blog](http://dojotoolkit.org/blog)

Articles and guides from the community:

* [Getting StartED with Dojo](http://startdojo.com)

Get help from other Dojo users:

* [Dojo on StackOverflow](http://stackoverflow.com/questions/tagged/dojo)
* [Mailing list](http://dojotoolkit.org/community)
* [Dojo on Twitter](http://twitter.com/dojo)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

To build the Dojo app, you first need to download and extract the [Dojo SDK](https://dojotoolkit.org/download/#sdk).
At the root folder of the extracted SDK, copy or symlink the complete `todomvc`
folder, so your directory structure looks like this:

	dojo-release/
	├── dijit
	├── dojo
	├── dojox
	├── todomvc
	└── util

Enter the `dojo-release/util` folder and run these commands to build the `dojo.js` file including all required resources and copy it back into the todomvc folder. You need either java or node on your system to run these:

```
buildscripts/build.sh --profile ../todomvc/architecture-examples/dojo/profiles/todomvc.profile.js -r
cp ../release/dojo/dojo/dojo.js ../todomvc/architecture-examples/dojo/js/lib/dojo-1.8/dojo.js
```

After a new release of Dojo, you may need to copy more files for this to work.
Check out the `js/lib/` folder for other files that are required from the
build.

You can now open the app in your browser.


## AMD Notes

Developers often ask what the difference is between Dojo 1.7+ and Require.js, which also supports the use of [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules.

Require.js is a loader which implements AMD and may be used with various toolkits. There are some other AMD implementations like curl.js.

Dojo is a toolkit which has been converted to use AMD and ships with an implementation of an AMD loader and optimization tools. As such, you do not need to use Require.js in order to write AMD modules using Dojo.
