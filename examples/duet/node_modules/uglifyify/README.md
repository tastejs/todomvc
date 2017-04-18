# uglifyify

A [Browserify](http://browserify.org) v2 transform which minifies your code
using [UglifyJS2](https://github.com/mishoo/UglifyJS2).

## Installation

``` bash
npm install uglifyify
```

## Motivation/Usage

Ordinarily you'd be fine doing this:

``` bash
browserify index.js | uglifyjs -c > bundle.js
```

But uglifyify gives you the benefit applying Uglify's "squeeze" transform
*before* it's processed by Browserify, meaning you can remove dead code paths
for conditional requires. Here's a contrived example:

``` javascript
if (true) {
  module.exports = require('./browser')
} else {
  module.exports = require('./node')
}
```

`module.exports = require('./node')` will be excluded by Uglify, meaning that
only `./browser` will be bundled and required.

If you combine uglifyify with [envify](http://github.com/hughsk/envify), you
can make this a little more accessible. Take this code:

``` javascript
if (process.env.NODE_ENV === 'development') {
  module.exports = require('./development')
} else {
  module.exports = require('./production')
}
```

And use this to compile:

``` bash
NODE_ENV=development browserify -t envify -t uglifyify index.js -o dev.js &&
NODE_ENV=production browserify -t envify -t uglifyify index.js -o prod.js
```

It should go without saying that you should be hesitant using environment
variables in a Browserify module - this is best suited to your own
applications or modules built with Browserify's `--standalone` tag.

## File Extensions

Sometimes, you don't want uglifyify to minify all of your files – for example,
if you're using a transform to `require` CSS or HTML, you might get an error
as uglify expects JavaScript and will throw if it can't parse what it's given.

This is done using the `-x` or `--exts` transform options, e.g. from the
command-line:

``` bash
browserify     \
  -t coffeeify \
  -t [ uglifyify -x .js -x .coffee ]
```

The above example will only minify `.js` and `.coffee` files, ignoring the rest.

## Global Transforms

You might also want to take advantage of uglifyify's pre-bundle minification
to produce slightly leaner files across your entire browserify bundle. By
default, transforms only alter your application code, but you can use global
transforms to minify module code too. From your terminal:

``` bash
browserify -g uglifyify ./index.js > bundle.js
```

Or programatically:

``` javascript
var browserify = require('browserify')
var fs = require('fs')

var bundler = browserify(__dirname + '/index.js')

bundler.transform({
  global: true
}, 'uglifyify')

bundler.bundle()
  .pipe(fs.createWriteStream(__dirname + '/bundle.js'))
```

Note that this is fine for uglifyify as it shouldn't modify the behavior of
your code unexpectedly, but transforms such as envify should almost always
stay local – otherwise you'll run into unexpected side-effects within modules
that weren't expecting to be modified as such.

## Ignoring Files

Sometimes uglifyjs will break specific files under specific settings – it's
rare, but does happen – and to work around that, you can use the `ignore`
option. Given one or more glob patterns, you can filter out specific files
this way:

``` bash
browserify -g [ uglifyify --ignore '**/node_modules/weakmap/*' ] ./index.js
```

``` javascript
var bundler = browserify('index.js')

bundler.transform({
    global: true
  , ignore: [
      '**/node_modules/weakmap/*'
    , '**/node_modules/async/*'
  ]
}, 'uglifyify')

bundler.bundle().pipe(process.stdout)
```

## Source Maps

Uglifyify supports source maps, so you can minify your code and still see the
original source – this works especially well with a tool such as
[exorcist](https://github.com/thlorenz/exorcist) when creating production
builds.

Source maps are enabled when:

* You're using another transform, such as
  [coffeeify](https://github.com/jnordberg/coffeeify), that inlines source maps.
* You've passed the `--debug` flag (or `debug` option) to your browserify
  bundle.

Enabling `--debug` with browserify is easy:

``` bash
browserify -t uglifyify --debug index.js
```
``` javascript
var bundler = browserify({ debug: true })

bundler
  .add('index.js')
  .transform({ sourcemap: false }, 'uglifyify')
  .bundle()
  .pipe(process.stdout)
```

If you'd prefer them not to be included regardless, you can opt out
using the `sourcemap` option:

``` bash
browserify -t [ uglifyify --no-sourcemap ] app.js
```
``` javascript
var bundler = browserify('index.js')

bundler.transform({ sourcemap: false }, 'uglifyify')
  .bundle()
  .pipe(process.stdout)
```
