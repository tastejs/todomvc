# TodoMVC

#### A common demo application for popular JavaScript MV* frameworks

## Introduction

This demo was written to illustrate how a server-side JavaScript solution could be applied to the TodosMVC application.

#### Technologies Used In This Demo

- [Underscore.js](http://documentcloud.github.com/underscore/) - A utility-belt library for JavaScript without extending any of the built-in JavaScript objects.
- [Backbone.js](http://documentcloud.github.com/backbone/) - Gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.
- [jQuery](http://jquery.com/) - A fast, concise, library that simplifies how to traverse HTML documents, handle events, perform animations, and add AJAX.
- [node.js](http://nodejs.org/) - Event-driven I/O server-side JavaScript environment based on V8.
- [Express](http://expressjs.com/) - High performance, high class web development for node.js.
- [Jade](http://jade-lang.com/) - High performance template engine heavily influenced by Haml and implemented with JavaScript for node.js.
- [Stylus](http://learnboost.github.com/stylus/) - Expressive, dynamic, robust CSS for node.js
- [Mongoose](http://mongoosejs.com/) - A MongoDB object modeling tool designed to work in an asynchronous environment.
- [MongoDB](http://www.mongodb.org/) - A scalable, high-performance, open source NoSQL database.

## Running the Demo

1. Install [node.js](http://nodejs.org/#download).
2. Install [MongoDB](http://www.mongodb.org/downloads).
3. Start the MongoDB server from a terminal window:
```
$ mongod
```
4. Change the working directory to the project root:
```
$ cd <path to todosmvc directory>/labs/architecture-examples/backbone_node_mongo/
```
4. Install dependencies using the node package manger (npm).
```
$ sudo npm link
```
5. Start the Todos demo server from a different terminal window:
```
$ node app
```
6. Visit [http://localhost:3000](http://localhost:3000) in a web browser.

## Credit

- [Jérôme Gravel-Niquet](http://jgn.me/) - Created original demo
- [Addy Osmani](http://addyosmani.com/) - Cleanup, edits
- [James O'Reilly](http://jamesor.com/) - Added server-side tech from node.js to MongoDB.

## License

Public Domain