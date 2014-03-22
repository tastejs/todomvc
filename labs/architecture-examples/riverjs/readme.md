# Framework Name TodoMVC Example

> River.js is a small framework focus on module enclosure and data binding, borrows scope, directive ideas from AngulaJS but keep same style with node module definition
It provides efficient data bindings with a simple and flexible API.

> _[RiverJS - besideriver.com/RiverJS](http://besideriver.com/RiverJS)_


## Learning Framework Name

The [RiverJS website](http://besideriver.com/RiverJS) is a great resource for getting started.

Here are some links you may find helpful:

* [Official Guide](http://besideriver.com/RiverJS/guide/)
* [API Reference](http://besideriver.com/RiverJS/api/)
* [Examples](http://besideriver.com/examples/)

Get help from other Framework Name users:


_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

the code is structured by MVC patten

```
├── controller
│   └── todos.js
├── model
│   └── local.js
├── river.json
├── util
│   └── route.js
└── view
    ├── footer.js
    └── todo.js

```


## Running

First 

```
npm install riverjs -g
```

then

```
cd js
```

and then run

```
riverjs build .
```

at last open index.html,add

```
<script src="js/build/river.min.js"></script>
<script src="js/build/app.js"></script>
```
## Credit

This TodoMVC application was created by [Jonathan Zhang](http://besideriver.com).
