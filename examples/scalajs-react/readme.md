# Scalajs-React TodoMVC Example

> Lifts Facebook's [React](https://facebook.github.io/react/) library into 
> [Scala.js](http://www.scala-js.org/) and endeavours to make it as type-safe 
> and Scala-friendly as possible.
> 
> Provides (opt-in) support for pure functional programming, using 
> [Scalaz](https://github.com/scalaz/scalaz) and 
> [Monocle](https://github.com/julien-truffaut/Monocle).
>
> Comes with utility modules 
> [`extra`](https://github.com/japgolly/scalajs-react/extra/) 
> and [`test`](https://github.com/japgolly/scalajs-react/test/), 
> helpful for React in Scala(.js), rather than React in JS.
> Includes a router, testing utils, performance utils, more.
>
> _[Scalajs-React - https://github.com/japgolly/scalajs-react/](https://github.com/japgolly/scalajs-react/)_


## Learning Scala

* [Documentation](http://scala-lang.org/documentation/)
* [API Reference](http://www.scala-lang.org/api/2.11.6/)
* [Functional Programming Principles in Scala, free on Coursera.](https://www.coursera.org/course/progfun)
* [Tutorials](http://docs.scala-lang.org/tutorials/)


## Learning React

The [React getting started documentation](http://facebook.github.io/react/docs/getting-started.html) 
is a great way to get started.

Here are some links you may find helpful:

* [Documentation](http://facebook.github.io/react/docs/getting-started.html)
* [API Reference](http://facebook.github.io/react/docs/reference.html)
* [Blog](http://facebook.github.io/react/blog/)
* [React on GitHub](https://github.com/facebook/react)
* [Support](http://facebook.github.io/react/support.html)

More links under the other React TodoMVC examples: [React example](../react) 
and [React-Backbone example](../react-backbone)


## Learning Scala.js

* [Homepage](http://www.scala-js.org/)
* [Tutorial](http://www.scala-js.org/doc/tutorial.html)


## Learning Scalajs-React

* [Github/Documentation](https://github.com/japgolly/scalajs-react/)
* [Documentation/Extras](https://github.com/japgolly/scalajs-react/blob/master/extra/README.md)


## Development

The build tool for this project is [sbt](http://www.scala-sbt.org), which is 
set up with a [plugin](http://www.scala-js.org/doc/sbt-plugin.html) 
to enable compilation and packaging of Scala.js web applications. 

The scala.js plugin for sbt supports two compilation modes:
 
* `fullOptJS` is a full program optimization, which is annoyingly slow when developing
* `fastOptJS` is fast, but produces large generated javascript files. This is the one we use for development.

After installation, you start `sbt` like this:

```
$ sbt
```

After `sbt` has downloaded the internet, you can compile once like this:

```
sbt> fastOptJS 
```

or enable continuous compilation by prefixing a tilde

```
sbt> ~fastOptJS
```


Happy hacking! :)
