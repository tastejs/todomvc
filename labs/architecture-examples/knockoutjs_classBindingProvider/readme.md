# Knockout.js with the Class Binding Provider TodoMVC Example

The Class Binding Provider offers advanced KnockoutJS developers a modular and reusable way to write their bindings.  It works similarly to css classes providing you with a way to declare your bindings in JavaScript and then reference them using keys in your HTML.

To learn how to implement the Class Binding Provider, [read the documentation](https://github.com/rniemeyer/knockout-classBindingProvider).

**What are the benefits of this approach to Knockout bindings?**

* The markup can stay clean and simple
* Bindings can be re-used, even at different scopes
* You can set breakpoints in the bindings to inspect the data being passed through them
* You can do logging in the bindings to understanding how many times they are being called
* You can change/alter the bindings on an element whenever your bindings are triggered
* Bindings go through less parsing (do not need to go from a object literal in a string to code)


## Learning Knockout.js

The [Knockout.js website](http://knockoutjs.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://knockoutjs.com/documentation/introduction.html)
* [Tutorials](http://learn.knockoutjs.com)
* [Live examples](http://knockoutjs.com/examples)

Articles and guides from the community:

* [Getting Started with Knockout.js](http://www.adobe.com/devnet/html5/articles/getting-started-with-knockoutjs.html)
* [Into the Ring with Knockout.js](http://net.tutsplus.com/tutorials/javascript-ajax/into-the-ring-with-knockout-js)
* [Beginners Guide to Knockout.js](http://www.sitepoint.com/beginners-guide-to-knockoutjs-part-1)

Get help from other Knockout.js users:

* [Knockout.js on StackOverflow](http://stackoverflow.com/questions/tagged/knockout)
* [Mailing list on Google Groups](http://groups.google.com/group/knockoutjs)
* [Knockout.js on Twitter](http://twitter.com/knockoutjs)
* [Knockout.js on Google +](https://plus.google.com/communities/106789046312204355684/stream/c5bfcfdf-3690-44a6-b015-35aad4f4e42e)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Credit

[ashish101](https://github.com/ashish01/knockoutjs-todos) wrote the original version of this application, which was then refactored by Addy Osmani and later rewritten by TodoMVC contributors.

[mberkom](https://github.com/mberkom) rewrote the binding references to use Ryan Niemeyer's Class Binding Provider instead of Knockout's default `data-bind` method of binding.
