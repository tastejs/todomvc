<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# undertaker-registry

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Default registry in gulp 4.

## Usage

```js
var gulp = require('gulp');
var UndertakerRegistry = require('undertaker-registry');

var registry = new UndertakerRegistry();

gulp.registry(registry);
```

## API

### new UndertakerRegistry([options])

Constructor for the default registry.  Inherit from this constructor to build custom registries.

### init(taker)

No-op method that receives the undertaker instance.  Useful to set pre-defined tasks using the
`undertaker.task(taskName, fn)` method.  Custom registries can override this method when inheriting
from this default registry.

### get(taskName) => Function

Returns the task with that name or undefined if no task is registered with that name.  Useful for custom
task storage.  Custom registries can override this method when inheriting from this default registry.

### set(taskName, fn) => [Function]

Adds a task to the registry.  If `set` modifies a task, it should return the new task so Undertaker can
properly maintain metadata for the task.  Useful for adding custom behavior to every task as it is
registered in the system.  Custom registries can override this method when inheriting from this default
registry.

### tasks() => Object

Returns an object listing all tasks in the registry.  Necessary to override if the `get` method is overridden
for custom task storage.  Custom registries can override this when when inheriting from this default
registry.

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

The easiest way to create a custom registry is to inherit from
[undertaker-registry](https://www.npmjs.com/package/undertaker-registry):

```javascript
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
prototype and it will receive the Undertaker instance as the only argument. You can then use
`undertaker.task(name, fn)` to register pre-defined tasks.

For example you might want to share a `clean` task:

```javascript
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
```javascript
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

```javascript
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

## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/undertaker-registry.svg
[npm-url]: https://npmjs.org/package/undertaker-registry
[npm-image]: http://img.shields.io/npm/v/undertaker-registry.svg

[travis-url]: https://travis-ci.org/gulpjs/undertaker-registry
[travis-image]: http://img.shields.io/travis/gulpjs/undertaker-registry.svg

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/undertaker-registry
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/undertaker-registry.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/undertaker-registry
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/undertaker-registry/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
