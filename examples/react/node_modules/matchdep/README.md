# matchdep [![Build Status](https://secure.travis-ci.org/tkellen/js-matchdep.svg?branch=master)](http://travis-ci.org/tkellen/js-matchdep)
> Use [micromatch] to filter npm module dependencies by name.

[![NPM](https://nodei.co/npm/matchdep.png)](https://nodei.co/npm/matchdep/)

## Examples

```js
var matchdep = require('matchdep');

// Filter dependencies (by autoloading nearest package.json)
matchdep.filter('mini*');

// Filter devDependencies (with config string indicating file to be required)
matchdep.filterDev('grunt-contrib-*', './package.json');

// Filter peerDependencies (with config string indicating file to be required)
matchdep.filterPeer('foo-{bar,baz}', './some-other.json');

// Filter all dependencies (with explicit config provided)
matchdep.filterAll('*', require('./yet-another.json'));

// Filter all dependencies, exclude grunt (multiple matching patterns)
matchdep.filterAll(['*','!grunt']);
```

## Usage

```js
filter(pattern, config)
filterDev(pattern, config)
filterPeer(pattern, config)
filterAll(pattern, config)
```

### pattern
Type: `String|Array`
Default: 'none'

A [micromatch] compatible match pattern to filter dependencies.

### config
Type: `String` or `Object`
Default: Path to nearest package.json.

If config is a string, matchdep will attempt to require it.  If it is an object, it will be used directly.

## Release History

* 2017-08-18 - v2.0.0 - Upgrade major versions of dependencies, Upgrade devDeps
* 2016-02-09 - v1.0.1 - switch to [micromatch], remove [globule]
* 2015-09-27 - v1.0.0 - throw when no package.json found, update dependencies, remove node 0.8 support
* 2013-10-09 - v0.3.0 - support multiple pattern matches using [globule]
* 2013-10-08 - v0.2.0 - refactor and support filtering peerDependencies
* 2012-11-27 - v0.1.0 - initial release


[globule]: https://github.com/cowboy/node-globule
[micromatch]: https://github.com/jonschlinkert/micromatch
