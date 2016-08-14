# [Binding.scala • TodoMVC](https://github.com/ThoughtWorksInc/todo)

[Binding.scala](https://github.com/ThoughtWorksInc/Binding.scala) is a data-binding framework for [Scala](http://www.scala-lang.org/), running on both JVM and [Scala.js](http://www.scala-js.org/).

Binding.scala can be used as a **[reactive](https://en.wikipedia.org/wiki/Reactive_programming) web framework**.
It enables you use native XML literal syntax to create reactive DOM nodes,
which are able to automatically change whenever the data source changes.

Binding.scala's TodoMVC application has the tiniest code size among all the TodoMVC implementations,
only one source file, 154 lines of code!

## Getting Started

``` scala
/**
 * Returns a bindable HTML DOM tree.
 *
 * The `@dom` annotations enable two magics:
 *  1. XHTML literals to create DOM nodes
 *  2. `xxx.bind` syntax, which make this DOM tree keep updated whenever `xxx` changes.
 */
@dom def render = {
  val value = Var("")
  <div>
    <input onchange={ event: Event => dom.currentTarget.asInstanceOf[HTMLInputElement].value }/>
    Your input value is { value.bind }
  </div>
}

/**
 * Renders a bindable HTML DOM node into the body of current web page.
 */
@JSExport def main(): Unit = {
  dom.render(document.body, render)
}
```

## Instructions to build this application

1. Download and install [sbt](http://www.scala-sbt.org/)
2. Clone this repository `git clone https://github.com/ThoughtWorksInc/todo.git`
3. Execute the shell command `sbt indexHtml` at the base directory of this code base.
4. Open the generated `index.html` in your browser. Enjoy it! 😋

## Links

* [The Binding.scala Project Page](https://github.com/ThoughtWorksInc/Binding.scala)
* [This “Binding.scala • TodoMVC” Project Page](https://github.com/ThoughtWorksInc/todo)
* [This “Binding.scala • TodoMVC” DEMO](https://thoughtworksinc.github.io/todo)
* [API documentation](https://oss.sonatype.org/service/local/repositories/releases/archive/com/thoughtworks/binding/unidoc_2.11/8.0.0/unidoc_2.11-8.0.0-javadoc.jar/!/com/thoughtworks/binding/package.html)
* [Other live DEMOs](https://thoughtworksinc.github.io/Binding.scala/)
* [Chat on Gitter](https://gitter.im/ThoughtWorksInc/Binding.scala)
