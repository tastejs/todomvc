# Haxe+Mithril+DCI • [TodoMVC](http://todomvc.com)

> Haxe is an open source toolkit based on a modern, high level, strictly typed programming language, a cross-compiler, a complete cross-platform standard library and ways to access each platform's native capabilities.

> _[Haxe - haxe.org](http://haxe.org)

> Mithril is a client-side MVC framework - a tool to organize code in a way that is easy to think about and to maintain.

> _[Mithril - mithril.js.org](http://mithril.js.org/)

> DCI (Data Context Interaction) - A New Role-Based Paradigm for specifying collaborating objects.

> _[DCI - fulloo.info](http://fulloo.info/)

## Haxe Resources

- [Website](http://haxe.org)
- [Documentation](http://haxe.org/documentation/introduction/)
- [Used by](http://haxe.org/use-cases/who-uses-haxe.html)
- [Code Playground](http://try.haxe.org)
- [Source Code](https://github.com/HaxeFoundation/haxe)

### Articles

- [TiVo: Using Haxe to improve user experience for millions of customers](http://haxe.org/articles/tivo-and-haxe/)

### Support

- [Community](http://haxe.org/community/community-support.html)

## Mithril Resources

- [Website](http://mithril.js.org)
- [Getting Started](http://mithril.js.org/getting-started.html)
- [Haxe library](https://github.com/ciscoheat/mithril-hx)
- [API](http://mithril.js.org/mithril.html)
- [Source Code](https://github.com/lhorie/mithril.js)

### Articles

- [Large collection of Mithril articles](http://lhorie.github.io/mithril-blog/)

### Support

- [Community](http://mithril.js.org/community.html)

## DCI Resources

- [Website](http://fulloo.info)
- [Introductory article](http://www.artima.com/articles/dci_vision.html)
- [Haxe library + DCI Tutorial](https://github.com/ciscoheat/haxedci-example)
- [FAQ](http://www.fulloo.info/doku.php?id=faq)
- [Discussion group](https://groups.google.com/forum/?fromgroups#!forum/object-composition)
- [The trygve language project](https://github.com/jcoplien/trygve)

### Videos/Speeches

- [DCI: Practical tips and lessons for nerds](https://www.youtube.com/watch?v=SxHqhDT9WGI)
- [DCI: Re-thinking the foundations of object orientation and of programming](https://www.youtube.com/watch?v=cVkhEJq8Kow)
- [How to get ahead in system architecture](https://www.youtube.com/watch?v=B0ebZHUixa0)

## Running

After installing Haxe (with Neko), open a prompt where this file is located, and install the project dependencies (as specified in the build file todomvc.hxml) by typing:

`haxelib install all`

Then you can compile the project:

`haxe todomvc.hxml`

This will create the required files in the js dir. To run the app, start a test server with:

`nekotools server`

And finally, visit [http://localhost:2000](http://localhost:2000).

## Implementation

Looking at the DCI architecture in the very expressive Haxe language could be a bit daunting at first. Try to see a Role as a natural place for functionality. The objects playing the Roles are very simple, but will have advanced functionality, the RoleMethods, attached when inside the Context.

The MVC practices in this project are directly from Trygve Reenskaug, the MVC author, summarized in the article [Rediscovering MVC](https://github.com/ciscoheat/mithril-hx/wiki/Rediscovering-MVC).

## Credit

Created by [Andreas Söderlund](https://ciscoheat.github.io)
