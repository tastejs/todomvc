# Dojo TodoMVC Example

> Dojo saves you time and scales with your development process, using web standards as its platform. It’s the toolkit experienced developers turn to for building high quality desktop and mobile web applications.

> _[Dojo - dojotoolkit.org](http://dojotoolkit.org)_


## Learning Dojo

The [Dojo website](http://dojotoolkit.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://dojotoolkit.org/documentation)
* [Getting started guide](https://dojotoolkit.org/reference-guide/quickstart)
* [API Reference](http://dojotoolkit.org/api)
* [Blog](http://dojotoolkit.org/blog)

Get help from other Dojo users:

* [Dojo/MVC on StackOverflow](http://stackoverflow.com/questions/tagged/dojo+model-view-controller)
* [Mailing list](http://dojotoolkit.org/community)
* [Dojo on Twitter](http://twitter.com/dojo)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

To run the Dojo example, you need to build Dojo with TodoMVC profile.
To do so, do the following. You need either java or node on your system to run these:

```
cd /path/to/todomvc/examples/dojo
npm install
mv ./node_modules/dojo-util ./node_modules/util
./node_modules/util/buildscripts/build.sh --profile ./profiles/todomvc.profile.js --release
```


## AMD Notes

Developers often ask what the difference is between Dojo 1.7+ and Require.js, which also supports the use of [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules.

Require.js is a loader which implements AMD and may be used with various toolkits. There are some other AMD implementations like curl.js.

Dojo is a toolkit which has been converted to use AMD and ships with an implementation of an AMD loader and optimization tools. As such, you do not need to use Require.js in order to write AMD modules using Dojo.
