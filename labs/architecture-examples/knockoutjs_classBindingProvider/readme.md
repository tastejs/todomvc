# Knockout.js TodoMVC app with the Class Binding Provider

The Class Binding Provider offers advanced KnockoutJS developers a modular and reusable way to write their bindings.  It works similarly to css classes providing you with a way to declare your bindings in JavaScript and then reference them using keys in your HTML.  

To learn how to implement the Class Binding Provider, read the docs [here](https://github.com/rniemeyer/knockout-classBindingProvider).

**What are the benefits of this approach to Knockout bindings?**

* The markup can stay clean and simple
* Bindings can be re-used, even at different scopes
* You can set breakpoints in the bindings to inspect the data being passed through them
* You can do logging in the bindings to understanding how many times they are being called
* You can change/alter the bindings on an element whenever your bindings are triggered
* Bindings go through less parsing (do not need to go from a object literal in a string to code)

**Contributions**

[ashish101](https://github.com/ashish01/knockoutjs-todos) wrote the original version of this application, which was then refactored by Addy Osmani and later rewritten by TodoMVC contributors.

[mberkom](https://github.com/mberkom) rewrote the binding references to use Ryan Niemeyer's Class Binding Provider instead of Knockout's default `data-bind` method of binding.  