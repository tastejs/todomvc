<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# async-settle

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Settle an async function. It will always complete successfully with an object of the resulting state.

Handles completion and errors for callbacks, promises, observables and streams.

Will run call the function on `nextTick`. This will cause all functions to be async.

## Usage

### Successful completion

```js
var asyncSettle = require('async-settle');

asyncSettle(function(done){
  // do async things
  done(null, 2);
}, function(error, result){
  // `error` will ALWAYS be null on execution of the first function.
  // `result` will ALWAYS be a settled object with the result or error of the first function.
});
```

### Failed completion

```js
var asyncSettle = require('async-settle');

asyncSettle(function(done){
  // do async things
  done(new Error('Some Error Occurred'));
}, function(error, result){
  // `error` will ALWAYS be null on execution of the first function.
  // `result` will ALWAYS be a settled object with the result or error of the first function.
});
```

## API

### `asyncSettle(fn, callback)`

Takes a function to execute (`fn`) and a function to call on completion (`callback`).

#### `fn([done])`

Optionally takes a callback (`done`) to call when async tasks are complete.

Executed in the context of [`async-done`][async-done], with all errors and results being settled.

Completion is handled by [`async-done` completion and error resolution][completions].

#### `callback(error, result)`

Called on completion of `fn` and recieves a settled object as the `result` argument.

The `error` argument will always be `null`.

#### Settled Object

Settled values have two properties, `state` and `value`.

`state` has two possible options `'error'` and `'success'`.

`value` will be the value passed to original callback.

## License

MIT

[async-done]: https://github.com/gulpjs/async-done
[completions]: https://github.com/gulpjs/async-done#completion-and-error-resolution

[downloads-image]: http://img.shields.io/npm/dm/async-settle.svg
[npm-url]: https://www.npmjs.com/package/async-settle
[npm-image]: http://img.shields.io/npm/v/async-settle.svg

[travis-url]: https://travis-ci.org/gulpjs/async-settle
[travis-image]: http://img.shields.io/travis/gulpjs/async-settle.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/async-settle
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/async-settle.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/async-settle
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/async-settle/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
