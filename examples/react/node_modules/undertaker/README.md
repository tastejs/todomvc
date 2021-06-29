<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# undertaker

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Azure Pipelines Build Status][azure-pipelines-image]][azure-pipelines-url] [![Travis Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

## Usage

```js
var fs = require('fs');
var Undertaker = require('undertaker');

var taker = new Undertaker();

taker.task('task1', function(cb){
  // do things

  cb(); // when everything is done
});

taker.task('task2', function(){
  return fs.createReadStream('./myFile.js')
    .pipe(fs.createWriteStream('./myFile.copy.js'));
});

taker.task('task3', function(){
  return new Promise(function(resolve, reject){
    // do things

    resolve(); // when everything is done
  });
});

taker.task('combined', taker.series('task1', 'task2'));

taker.task('all', taker.parallel('combined', 'task3'));
```

## API

__Task functions can be completed in any of the ways supported by
[`async-done`][async-resolution]__

### `new Undertaker([registryInstance])`

The constructor is used to create a new instance of `Undertaker`. Each instance of
`Undertaker` gets its own instance of a registry. By default, the registry is an
instance of [`undertaker-registry`][undertaker-registry]
but it can be an instance of any other registry that follows the [Custom Registries API][custom-registries].

To use a custom registry, pass a custom registry instance (`new CustomRegistry([options])`) when
instantiating a new `Undertaker` instance. This will use the custom registry instance for that `Undertaker` instance.

### `task([taskName,] fn)`

Both a `getter` and `setter` for tasks.

If a string (`taskName`) is given as the only argument, it behaves as a `getter`
and returns the wrapped task (not the original function). The wrapped task has a `unwrap`
method that will return the original function.

If a function (`fn`) and optionally a string (`taskName`) is given, it behaves as
a `setter` and will register the task by the `taskName`.  If `taskName` is not
specified, the `name` or `displayName` property of the function is used as the `taskName`.

Will throw if:

* As a `getter`: `taskName` is missing or not a string.
* As a `setter`: `taskName` is missing and `fn` is anonymous.
* As a `setter`: `fn` is missing or not a function.

### `series(taskName || fn...)`

Takes a variable amount of strings (`taskName`) and/or functions (`fn`) and
returns a function of the composed tasks or functions. Any `taskNames` are
retrieved from the registry using the `get` method.

When the returned function is executed, the tasks or functions will be executed
in series, each waiting for the prior to finish. If an error occurs, execution
will stop.

### `parallel(taskName || fn...)`

Takes a variable amount of strings (`taskName`) and/or functions (`fn`) and
returns a function of the composed tasks or functions. Any `taskNames` are
retrieved from the registry using the `get` method.

When the returned function is executed, the tasks or functions will be executed
in parallel, all being executed at the same time. If an error occurs, all execution
will complete.

### `registry([registryInstance])`

Optionally takes an instantiated registry object. If no arguments are passed, returns
the current registry object. If an instance of a registry (`customRegistry`) is passed
the tasks from the current registry will be transferred to it and the current registry
will be replaced with the new registry.

The ability to assign new registries will allow you to pre-define/share tasks or add
custom functionality to your registries. See [Custom Registries][custom-registries]
for more information.

### `tree([options])`

Optionally takes an `options` object and returns an object representing the
tree of registered tasks. The object returned is [`archy`][archy]
compatible. Also, each node has a `type` property that can be used to determine if the node is a `task` or `function`.

#### `options`

##### `options.deep`

Whether or not the whole tree should be returned.

Type: `Boolean`

Default: `false`

### `lastRun(task, [precision])`

Takes a string or function (`task`) and returns a timestamp of the last time the task
was run successfully. The time will be the time the task started.

Returns `undefined` if the task has not been run.

If a task errors, the result of `lastRun` will be undefined because the task
should probably be re-run from scratch to get into a good state again.

The timestamp is always given in millisecond but the time resolution can be
rounded using the `precision` parameter. The use case is to be able to compare a build time
to a file time attribute. On node v0.10 or with file system like HFS or FAT,
`fs.stat` time attributes like `mtime` precision is one second.

Assuming `undertakerInst.lastRun('someTask')` returns `1426000001111`,
`undertakerInst.lastRun('someTask', 1000)` returns `1426000001000`.

The default time resolution is `1000` on node v0.10, `0` on node 0.11+ but
it can be overwritten using `UNDERTAKER_TIME_RESOLUTION` environment variable.

## Custom Registries

Custom registries are constructor functions allowing you to pre-define/share tasks
or add custom functionality to your registries.

A registry's prototype should define:

- `init(taker)`: receives the undertaker instance to set pre-defined tasks using the `task(taskName, fn)` method.
- `get(taskName)`: returns the task with that name
   or `undefined` if no task is registered with that name.
- `set(taskName, fn)`: add task to the registry. If `set` modifies a task, it should return the new task.
- `tasks()`: returns an object listing all tasks in the registry.

You should not call these functions yourself; leave that to Undertaker, so it can
keep its metadata consistent.

The easiest way to create a custom registry is to inherit from [undertaker-registry]:

```js
var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function MyRegistry(){
  DefaultRegistry.call(this);
}

util.inherits(MyRegistry, DefaultRegistry);

module.exports = MyRegistry;
```

### Sharing tasks

To share common tasks with all your projects, you can expose an `init` method on the registry
prototype and it will receive the `Undertaker` instance as the only argument. You can then use
`undertaker.task(name, fn)` to register pre-defined tasks.

For example you might want to share a `clean` task:

```js
var fs = require('fs');
var util = require('util');

var DefaultRegistry = require('undertaker-registry');
var del = require('del');

function CommonRegistry(opts){
  DefaultRegistry.call(this);

  opts = opts || {};

  this.buildDir = opts.buildDir || './build';
}

util.inherits(CommonRegistry, DefaultRegistry);

CommonRegistry.prototype.init = function(takerInst){
  var buildDir = this.buildDir;
  var exists = fs.existsSync(buildDir);

  if(exists){
    throw new Error('Cannot initialize common tasks. ' + buildDir + ' directory exists.');
  }

  takerInst.task('clean', function(){
    return del([buildDir]);
  });
}

module.exports = CommonRegistry;
```

Then to use it in a project:
```js
var Undertaker = require('undertaker');
var CommonRegistry = require('myorg-common-tasks');

var taker = new Undertaker(CommonRegistry({ buildDir: '/dist' }));

taker.task('build', taker.series('clean', function build(cb) {
  // do things
  cb();
}));
```

### Sharing Functionalities

By controlling how tasks are added to the registry, you can decorate them.

For example if you wanted all tasks to share some data,  you can use a custom registry
to bind them to that data. Be sure to return the altered task, as per the description
of registry methods above:

```js
var util = require('util');

var Undertaker = require('undertaker');
var DefaultRegistry = require('undertaker-registry');

// Some task defined somewhere else
var BuildRegistry = require('./build.js');
var ServeRegistry = require('./serve.js');

function ConfigRegistry(config){
  DefaultRegistry.call(this);
  this.config = config;
}

util.inherits(ConfigRegistry, DefaultRegistry);

ConfigRegistry.prototype.set = function set(name, fn) {
  // The `DefaultRegistry` uses `this._tasks` for storage.
  var task = this._tasks[name] = fn.bind(this.config);
  return task;
};

var taker = new Undertaker();

taker.registry(new BuildRegistry());
taker.registry(new ServeRegistry());

// `taker.registry` will reset each task in the registry with
// `ConfigRegistry.prototype.set` which will bind them to the config object.
taker.registry(new ConfigRegistry({
  src: './src',
  build: './build',
  bindTo: '0.0.0.0:8888'
}));

taker.task('default', taker.series('clean', 'build', 'serve', function(cb) {
  console.log('Server bind to ' + this.bindTo);
  console.log('Serving' + this.build);
  cb();
}));
```

### In the wild

* [undertaker-registry] - Custom registries probably want to inherit from this.
* [undertaker-forward-reference] - Custom registry supporting forward referenced tasks (similar to gulp 3.x).
* [undertaker-task-metadata] - Proof-of-concept custom registry that attaches metadata to each task.
* [undertaker-common-tasks] - Proof-of-concept custom registry that pre-defines some tasks.
* [alchemist-gulp] - A default set of tasks for building alchemist plugins.
* [gulp-hub] - Custom registry to run tasks in multiple gulpfiles. (In a branch as of this writing)
* [gulp-pipeline] - [RailsRegistry][rails-registry] is an ES2015 class that provides a gulp pipeline replacement for rails applications

## License

MIT

[downloads-image]: https://img.shields.io/npm/dm/undertaker.svg
[npm-url]: https://www.npmjs.com/package/undertaker
[npm-image]: https://img.shields.io/npm/v/undertaker.svg

[azure-pipelines-url]: https://dev.azure.com/gulpjs/gulp/_build/latest?definitionId=$PROJECT_ID&branchName=master
[azure-pipelines-image]: https://dev.azure.com/gulpjs/gulp/_apis/build/status/undertaker?branchName=master

[travis-url]: https://travis-ci.org/gulpjs/undertaker
[travis-image]: https://img.shields.io/travis/gulpjs/undertaker.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/undertaker
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/undertaker.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/undertaker
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/undertaker/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg

[custom-registries]: #custom-registries
[async-resolution]: https://github.com/phated/async-done#completion-and-error-resolution
[archy]: https://www.npmjs.org/package/archy
[undertaker-registry]: https://github.com/gulpjs/undertaker-registry
[undertaker-forward-reference]: https://github.com/gulpjs/undertaker-forward-reference
[undertaker-task-metadata]: https://github.com/gulpjs/undertaker-task-metadata
[undertaker-common-tasks]: https://github.com/gulpjs/undertaker-common-tasks
[alchemist-gulp]: https://github.com/webdesserts/alchemist-gulp
[gulp-hub]: https://github.com/frankwallis/gulp-hub/tree/registry-init
[gulp-pipeline]: https://github.com/alienfast/gulp-pipeline
[rails-registry]: https://github.com/alienfast/gulp-pipeline/blob/master/src/registry/railsRegistry.js
