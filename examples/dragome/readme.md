# Dragome SDK TodoMVC Example

> Dragome is an open source tool for creating web applications in pure Java language. Based on bytecode to javascript compilation, you can execute applications written in Java directly on browsers. You can use your favorite IDE, your favorite Java frameworks and tools.

> _[Dragome SDK - www.dragome.com](http://www.dragome.com)_


## Learning Dragome

The [Dragome](http://www.dragome.com/) is a great resource for getting started.

Here are some links you may find helpful:

* [Binding Tutorial](http://dragome.sourceforge.net/simple-examples.html)
* [Examples](http://dragome.sourceforge.net/examples.html)
* [Features](http://dragome.sourceforge.net/features.html)


## Implementation

The implementation is very short, there is just one small class for building the entire UI, and two other classes that represent Todo Item model and Todo Manager model.
HTML template is almost the same template that TodoMVC specification provides, the only difference are "data-template" attributes added to 16 tags to identify each dynamic part.
UI is created using component builders, which allows us to create the component, associate it to a template part, add event listeners, and repeat subtemplates if required.
Model binding is managed by a combination of Form Bindings module (based on gwt-pectin) and Method Logger (bytecode instrumentation plugin) for detecting getters and setters access. 
It's not required the use of any explicit mechanism to detect changes over the model or UI, the built in two ways data binding takes track of each expression and execute it again when related value changes.

## Folder Structure

- `dragome` - includes Dragome specific `dragome.css` and the compiled application in `app.js` is located inside js folder.
- `src` - the Java source for this application
- `index.html` - the same HTML template provided in TodoMVC specification with few data-template attributes added.


## Building this application

The Dragome TodoMVC application was built with Java 1.8 (because it makes use of lambda expressions and stream API) and Dragome 0.95-2-beta1. The easiest way to build this application
is to clone examples repository with "git clone https://github.com/dragome/dragome-examples.git" and execute "mvn clean install".
