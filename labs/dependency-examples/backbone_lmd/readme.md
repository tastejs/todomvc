# Backbone.js + LMD • [TodoMVC](http://todomvc.com)

`LMD` is Yet Another RequireJS based on LMD ideology.

This is adapted `backbone_require` example for LMD.

Open `index.html` for basic version and `index-cache.html` for version with localStorage module cache.

## Tests

This application is and adoptation of `backbone_require` thats why tests are not included.

LMD itself are covered by unit tests (~97% Code Coverage). TravisCI Build status [![Build Status](https://secure.travis-ci.org/azproduction/lmd.png?branch=master)](http://travis-ci.org/azproduction/lmd)

## Building

All modules are **already compiled**. But you can do it by yourself.

```bash
$ npm install lmd -g
$ cd dependency-examples/backbone_lmd

# To see the build info
$ lmd info dev-cache

# To build
$ lmd build dev
info:    Building `dev` (.lmd/dev.lmd.json)
info:    Writing LMD Package to ../compiled/dev.lmd.js

$ lmd build dev-cache
info:    Building `dev-cache` (.lmd/dev-cache.lmd.json)
info:    Writing LMD Package to ../compiled/dev-cache.lmd.js
```

## Credit

Initial release by @azproduction.
