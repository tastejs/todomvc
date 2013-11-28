# Deployd TodoMVC Example

> Deployd is designed to replace traditional backends for web and mobile apps. Perform advanced queries over HTTP.  Push data to clients over WebSockets in real time.  Transform and validate your data as it changes.

> _[Deployd - deployd.com](http://deployd.com)_


## Learning Deployd

The [Deployd website](http://deployd.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Guides](http://docs.deployd.com/guides)
* [API](http://docs.deployd.com/api)
* [Examples](http://docs.deployd.com/examples)
* [Blog](http://deployd.com/blog.html)
* [Deployd on GitHub](https://github.com/deployd/deployd)
* [Deployd on Twitter](https://twitter.com/deploydapp)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

If you don't have Deployd installed already, from a terminal window:

	npm install deployd -g

Make sure you have MongoDB server running on port 27017, to run the app:

	# from labs/architecture-examples/deployd_backbone_require
	dpd -P 27017 -H localhost -n deployd -d

Your browser should be pointer to http://localhost:2403/dashboard, point browser to 
http://localhost:2403/ to check the todo app.


## Credit

This TodoMVC application was created by [yzhang](https://github.com/yzhang).
