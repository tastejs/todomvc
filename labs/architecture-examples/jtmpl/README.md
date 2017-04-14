# jtmpl TodoMVC Example

> Mustache syntax + automatic data-binding = Live templates

> _[jtmpl](http://jtmpl.com)_


## Learning jtmpl

The [jtmpl site](http://jtmpl.com) is a great resource for getting started.

Here are some links you may find helpful:

* [README](http://jtmpl.com/README.html)
* [KitchenSink demo](http://jtmpl.com/kitchensink.html)
* [jtmpl on GitHub](https://github.com/atmin/jtmpl)
* [Mustache syntax](http://mustache.github.io/mustache.5.html)

Articles and guides from the community:

* Currently none

Get help from other jtmpl users:

* [jtmpl on StackOverflow](http://stackoverflow.com/questions/tagged/jtmpl)
* [Mailing list on Google Groups]()
* [jtmpl on Twitter](http://twitter.com/jtmpl)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

You're free to decide how to structure your application. Then just use

	jtmpl(targetElement or '#target-id', 'template contents or "#template-id"', model);

Your model is a POJO that also contains event handlers, which only need to modify model properties. On change DOM is instantly updated automatically. You can think of it as a continuous templating engine.


## Credit

This TodoMVC application was created by [Atanas Minev](https://github.com/atmin).
