<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# glob-watcher

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Watch globs and execute a function upon change, with intelligent defaults for debouncing and queueing.

## Usage

```js
var watch = require('glob-watcher');

watch(['./*.js', '!./something.js'], function(done){
  // This function will be called each time a globbed file is changed
  // but is debounced with a 200ms delay (default) and queues subsequent calls

  // Make sure to signal async completion with the callback
  // or by returning a stream, promise, observable or child process
  done();

  // if you need access to the `path` or `stat` object, listen
  // for the `change` event (see below)

  // if you need to listen to specific events, use the returned
  // watcher instance (see below)
});

// Raw chokidar instance
var watcher = watch(['./*.js', '!./something.js']);

// Listen for the 'change' event to get `path`/`stat`
// No async completion available because this is the raw chokidar instance
watcher.on('change', function(path, stat) {
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});

// Listen for other events
// No async completion available because this is the raw chokidar instance
watcher.on('add', function(path, stat) {
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});
```

## API

### `watch(globs[, options][, fn])`

Takes a path string, an array of path strings, a [glob][micromatch] string or an array of [glob][micromatch] strings as `globs` to watch on the filesystem. Also optionally takes `options` to configure the watcher and a `fn` to execute when a file changes.

__Note: As of 5.0.0, globs must use `/` as the separator character because `\\` is reserved for escape sequences (as per the Bash 4.3 & Micromatch specs). This means you can't use `path.join()` or `__dirname` in Windows environments. If you need to use `path.join()`, you can use [normalize-path][normalize-path] against your paths afterwards. If you need to use `__dirname`, you can set it as the `cwd` option that gets passed directly to [chokidar][chokidar]. The [micromatch docs][micromatch-backslashes] contain more information about backslashes.__

Returns an instance of [chokidar][chokidar].

#### `fn([callback])`

If the `fn` is passed, it will be called when the watcher emits a `change`, `add` or `unlink` event. It is automatically debounced with a default delay of 200 milliseconds and subsequent calls will be queued and called upon completion. These defaults can be changed using the `options`.

The `fn` is passed a single argument, `callback`, which is a function that must be called when work in the `fn` is complete. Instead of calling the `callback` function, [async completion][async-completion] can be signalled by:
  * Returning a `Stream` or `EventEmitter`
  * Returning a `Child Process`
  * Returning a `Promise`
  * Returning an `Observable`

Once async completion is signalled, if another run is queued, it will be executed.

#### `options`

##### `options.ignoreInitial`

If set to `false` the `fn` is called during [chokidar][chokidar] instantiation as it discovers the file paths. Useful if it is desirable to trigger the `fn` during startup.

__Passed through to [chokidar][chokidar], but defaulted to `true` instead of `false`.__

Type: `Boolean`

Default: `true`

##### `options.delay`

The delay to wait before triggering the `fn`. Useful for waiting on many changes before doing the work on changed files, e.g. find-and-replace on many files.

Type: `Number`

Default: `200` (milliseconds)

##### `options.queue`

Whether or not a file change should queue the `fn` execution if the `fn` is already running. Useful for a long running `fn`.

Type: `Boolean`

Default: `true`

##### `options.events`

An event name or array of event names to listen for. Useful if you only need to watch specific events.

Type: `String | Array<String>`

Default: `[ 'add', 'change', 'unlink' ]`

##### other

Options are passed directly to [chokidar][chokidar].

## License

MIT

[micromatch]: https://github.com/micromatch/micromatch
[normalize-path]: https://www.npmjs.com/package/normalize-path
[micromatch-backslashes]: https://github.com/micromatch/micromatch#backslashes
[async-completion]: https://github.com/gulpjs/async-done#completion-and-error-resolution
[chokidar]: https://github.com/paulmillr/chokidar

[downloads-image]: http://img.shields.io/npm/dm/glob-watcher.svg
[npm-url]: https://npmjs.com/package/glob-watcher
[npm-image]: http://img.shields.io/npm/v/glob-watcher.svg

[travis-url]: https://travis-ci.org/gulpjs/glob-watcher
[travis-image]: http://img.shields.io/travis/gulpjs/glob-watcher.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/glob-watcher
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/glob-watcher.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/glob-watcher
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/glob-watcher/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.png
