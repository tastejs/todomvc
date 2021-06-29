<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# async-done

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Azure Pipelines Build Status][azure-pipelines-image]][azure-pipelines-url] [![Travis Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Allows libraries to handle various caller provided asynchronous functions uniformly. Maps promises, observables, child processes and streams, and callbacks to callback style.

As async conventions evolve, it is useful to be able to deal with several different *styles* of async completion uniformly. With this module you can handle completion using a node-style callback, regardless of a return value that's a promise, observable, child process or stream.

## Usage

### Successful completion

```js
var asyncDone = require('async-done');

asyncDone(function(done){
  // do async things
  done(null, 2);
}, function(error, result){
  // `error` will be null on successful execution of the first function.
  // `result` will be the result from the first function.
});
```

### Failed completion

```js
var asyncDone = require('async-done');

asyncDone(function(done){
  // do async things
  done(new Error('Some Error Occurred'));
}, function(error, result){
  // `error` will be an error from the first function.
  // `result` will be undefined on failed execution of the first function.
});
```

## API

### `asyncDone(fn, callback)`

Takes a function to execute (`fn`) and a function to call on completion (`callback`).

#### `fn([done])`

Optionally takes a callback to call when async tasks are complete.

#### Completion and Error Resolution

* `Callback` (`done`) called
  - Completion: called with null error
  - Error: called with non-null error
* `Stream` or `EventEmitter` returned
  - Completion: [end-of-stream][end-of-stream] module
  - Error: [domains][domains]
  - __Note:__ Only actual streams are supported, not faux-streams; Therefore, modules like [`event-stream`][event-stream] are not supported.
* `Child Process` returned
  - Completion [end-of-stream][end-of-stream] module
  - Error: [domains][domains]
* `Promise` returned
  - Completion: [onFulfilled][promise-onfulfilled] method called
  - Error: [onRejected][promise-onrejected] method called
* `Observable` (e.g. from [RxJS v5][rxjs5-observable] or [RxJS v4][rxjs5-observable]) returned
  - Completion: [complete][rxjs5-observer-complete] method called
  - Error: [error][rxjs5-observer-error] method called

__Warning:__ Sync tasks are __not supported__ and your function will never complete if the one of the above strategies is not used to signal completion. However, thrown errors will be caught by the domain.

#### `callback(error, result)`

If an error doesn't occur in the execution of the `fn` function, the `callback` method will receive the results as its second argument. Note: Some streams don't received any results.

If an error occurred in the execution of the `fn` function, The `callback` method will receive an error as its first argument.

Errors can be caused by:

* A thrown error
* An error passed to a `done` callback
* An `error` event emitted on a returned `Stream`, `EventEmitter` or `Child Process`
* A rejection of a returned `Promise` - If the `Promise` is not rejected with a value, we generate a new `Error`
* The `onError` handler being called on an `Observable`

## License

MIT

[downloads-image]: https://img.shields.io/npm/dm/async-done.svg
[npm-url]: https://www.npmjs.com/package/async-done
[npm-image]: https://img.shields.io/npm/v/async-done.svg

[azure-pipelines-url]: https://dev.azure.com/gulpjs/gulp/_build/latest?definitionId=6&branchName=master
[azure-pipelines-image]: https://dev.azure.com/gulpjs/gulp/_apis/build/status/async-done?branchName=master

[travis-url]: https://travis-ci.org/gulpjs/async-done
[travis-image]: https://img.shields.io/travis/gulpjs/async-done.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/async-done
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/async-done.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/async-done
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/async-done/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg

[end-of-stream]: https://www.npmjs.com/package/end-of-stream
[domains]: http://nodejs.org/api/domain.html
[event-stream]: https://github.com/dominictarr/event-stream
[promise-onfulfilled]: http://promisesaplus.com/#point-26
[promise-onrejected]: http://promisesaplus.com/#point-30
[rx4-observable]: https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md
[rxjs5-observable]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[rxjs5-observer-complete]: http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html#instance-method-complete
[rxjs5-observer-error]: http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html#instance-method-error
