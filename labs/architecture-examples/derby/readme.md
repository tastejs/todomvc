# Derby TodoMVC Example

> MVC framework making it easy to write realtime, collaborative applications that run in both Node.js and browsers.

> _[Derby - derbyjs.com](http://derbyjs.com)_


## Learning Derby

The [Derby website](http://derbyjs.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Introduction](http://derbyjs.com/#introduction)
* [Getting Started](http://derbyjs.com/#getting_started)
* [Applications built with Derby](https://github.com/codeparty/derby/wiki/Community-Projects#website-showcase)
* [Blog](http://blog.derbyjs.com)
* [FAQ](https://github.com/codeparty/derby/wiki/Frequently-Asked-Questions)
* [Derby on GitHub](https://github.com/codeparty/derby)

Articles and guides from the community:

* [Learning DerbyJS](http://nickofnicks.com/2013/04/24/nodejs/derbyjs/learning-derbyjs/)
* [Screencast - 6 Things I'm Loving about DerbyJS](http://micknelson.wordpress.com/2012/07/27/6-things-im-loving-about-derbyjs)

Get help from other Derby users:

* [Derby on StackOverflow](http://stackoverflow.com/questions/tagged/derbyjs)
* [Mailing list on Google Groups](https://groups.google.com/forum/?fromgroups#!forum/derbyjs)
* [Derby on Twitter](http://twitter.com/derbyjs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

[Node.js](http://nodejs.org) (>=0.8.0) is required to run this app.

To install the dependencies locally, compile the CoffeScript, and run the demo server:

	# from labs/architecture-examples/derby
	make run

To edit the code while running the demo server:

	# from labs/architecture-examples/derby
	make

Open up another terminal window:

	# from labs/architecture-examples/derby
	node server

Open the URL shown.


## Deploy on Heroku

To set up a git repository in this subdirectory and setup Heroku, run:

	make deploy-setup

To deploy it to Heroku:

	make heroku
