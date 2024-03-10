# Udash TodoMVC Example

Udash is a Scala.js framework for building modern web applications. Basing on the [Scala.js](http://www.scala-js.org/doc/) project, it provides
a type safe way of web apps development, which makes them easier to develop and maintain. 

Udash includes:
* Reactive data bindings
* Type-safe RPC & REST
* User Interface Components based on Twitter Bootstrap
* Frontend routing
* I18n support
* Application generator


## Learning Udash

* [Homepage](http://udash.io/)
* [Documentation](http://guide.udash.io/)
* [Getting started](http://guide.udash.io/quick-start)


## Learning Scala

* [Documentation](http://scala-lang.org/documentation/)
* [API Reference](http://www.scala-lang.org/api/2.11.8/)
* [Functional Programming Principles in Scala, free on Coursera.](https://www.coursera.org/course/progfun)
* [Tutorials](http://docs.scala-lang.org/tutorials/)


## Learning Scala.js

* [Documentation](http://www.scala-js.org/doc/)
* [Tutorials](http://www.scala-js.org/tutorial/)
* [Scala.js Fiddle](http://www.scala-js-fiddle.com/)


## Development

The build tool for this project is [SBT](http://www.scala-sbt.org), which is 
set up with a [Scala.js plugin](http://www.scala-js.org/doc/sbt-plugin.html) 
to enable compilation and packaging of Scala.js web applications. 

The plugin supports two compilation modes:
 
* `fullOptJS` is a full program optimization, which is slower
* `fastOptJS` is fast, but produces large generated javascript files. This is the one we use for development.

After installation, you start `sbt` like this:

```
$ sbt
```

After `sbt` has started and loaded project, you can compile once like this:

```
sbt> fastOptJS 
```

or enable continuous compilation by prefixing it with a tilde:

```
sbt> ~fastOptJS
```
