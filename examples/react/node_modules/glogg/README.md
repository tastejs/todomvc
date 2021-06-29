<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# glogg

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Travis Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Global logging utility.

## Usage

```js
var getLogger = require('glogg');

var logger = getLogger('my-namespace');

// logs strings
logger.debug('The MOST verbose!');
logger.info('Some important info');
logger.warn('All the warnings to you');
logger.error('OH NO! SOMETHING HAPPENED!');

// supports util.format!
logger.info('%s style!', 'printf');

// log anything
logger.debug({ my: 'obj' });
logger.info([1, 2, 3]);

// somewhere else
logger.on('info', function(msg){
  // do something with msg
});

// must be handled to avoid crashing process
logger.on('error', function(msg){
  // now it won't crash
});
```

## API

__Note: This module makes no assumptions about the log levels and they will always
be emitted.  If you are looking to filter some out, your listeners will need to have
extra logic.__

### getLogger([namespace])

Create a new logger at the given namespace (or the default if no namespace is provided).
Returns an augmented [`sparkles`](https://github.com/phated/sparkles) EventEmitter object
with 4 methods: `debug()`, `info()`, `warn()` and `error()`. When called, these methods emit
an event with the same name.  If the first argument is a string, the arguments
are passed through node's `util.format()` before being emitted.  Other parts
of a node program can get the logger by namespace and listen for the events to
be emitted.

#### logger.debug(msg)

Emits a `debug` event with the given `msg`.

If the first argument is a string, all arguments are passed to node's
`util.format()` before being emitted.

#### logger.info(msg)

Emits a `info` event with the given `msg`.

If the first argument is a string, all arguments are passed to node's
`util.format()` before being emitted.

#### logger.warn(msg)

Emits a `warn` event with the given `msg`.

If the first argument is a string, all arguments are passed to node's
`util.format()` before being emitted.

#### logger.error(msg)

Emits a `error` event with the given `msg`.

If the first argument is a string, all arguments are passed to node's
`util.format()` before being emitted.

__Note: You must handle this event in some way or the node process will crash
when an `error` event is emitted.__

#### logger.on(event, fn)

Standard API from node's `EventEmitter`.  Use this to listen for events from
the logger methods.

## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/glogg.svg
[npm-url]: https://www.npmjs.com/package/glogg
[npm-image]: http://img.shields.io/npm/v/glogg.svg

[travis-url]: https://travis-ci.org/gulpjs/glogg
[travis-image]: http://img.shields.io/travis/gulpjs/glogg.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/glogg
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/glogg.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/glogg
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/glogg/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
