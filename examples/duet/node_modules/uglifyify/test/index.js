const convert    = require('convert-source-map')
const wrap       = require('wrap-stream')
const browserify = require('browserify')
const uglify     = require('uglify-js')
const from2      = require('from2')
const test       = require('tape')
const path       = require('path')
const uglifyify  = require('../')
const fs         = require('fs')
const bl         = require('bl')

test('uglifyify: sanity check', function(t) {
  var src  = path.join(__dirname, 'fixture.js')
  var orig = fs.readFileSync(src, 'utf8')

  fs.createReadStream(src)
    .pipe(uglifyify(src))
    .pipe(bl(function(err, data) {
      if (err) return t.ifError(err)
      data = String(data)
      t.notEqual(data.indexOf('var hello'), -1, 'var hello')
      t.notEqual(data.indexOf('"world"'), -1, '"world"')
      t.notEqual(data, orig, 'should be minified')
      t.end()
    }))
})

test('uglifyify: ignores json', function(t) {
  var src  = path.join(__dirname, 'fixture.js')
  var json = path.join(__dirname, 'fixture.json')
  var orig = fs.readFileSync(src, 'utf8')

  fs.createReadStream(src)
    .pipe(uglifyify(json))
    .pipe(bl(buffered))

  function buffered(err, data) {
    if (err) return t.ifError(err)
    data = String(data)
    t.equal(data, orig, 'should not be minified')
    t.end()
  }
})

test('uglifyify: -t [ uglifyify --exts ]', function(t) {
  var src  = path.join(__dirname, 'fixture.js')
  var orig = fs.readFileSync(src, 'utf8')

  t.plan(5)

  check(path.join(__dirname, 'fixture.json'), true)
  check(path.join(__dirname, 'fixture.obj2'), false)
  check(path.join(__dirname, 'fixture.mkdn'), false)
  check(path.join(__dirname, 'fixture.fbla'), true)
  check(src, true)

  function check(name, ignored) {
    fs.createReadStream(src)
      .pipe(uglifyify(name, { exts: ['mkdn' ], x: ['.obj2'] }))
      .pipe(bl(buffered))

    function buffered(err, data) {
      if (err) return t.ifError(err)
      data = String(data)
      t.ok(ignored
        ? data === orig
        : data !== orig
      , path.extname(name) + ' handled as expected')
    }
  }
})

test('uglifyify: passes options to uglify', function(t) {
  var src  = path.join(__dirname, 'fixture.js')
  var orig = fs.readFileSync(src, 'utf8')
  var buf1 = null

  fs.createReadStream(src)
    .pipe(closure())
    .pipe(uglifyify(src, { compress: false, mangle: false }))
    .pipe(bl(buffered1))

  function buffered1(err, _buf1) {
    if (err) return t.ifError(err)
    buf1 = String(_buf1)
    t.notEqual(buf1, orig, 'should be minified')

    fs.createReadStream(src)
      .pipe(closure())
      .pipe(uglifyify(src))
      .pipe(bl(buffered2))
  }

  function buffered2(err, buf2) {
    if (err) return
    buf2 = String(buf2)
    t.notEqual(buf2, orig, 'should be minified')
    t.notEqual(buf1, buf2, 'options altered output')
    t.end()
  }
})



function closure() {
  return wrap('(function(){', '})()')
}

test('uglifyify: sourcemaps', function(t) {
  t.plan(10)

  var src  = path.join(__dirname, 'fixture.js')
  var json = path.join(__dirname, 'fixture.json')
  var orig = fs.readFileSync(src, 'utf8')
  var min  = uglify.minify(orig, {
    outSourceMap: 'out.js.map'
    , fromString: true
  })

  var map = convert.fromJSON(min.map)
  map.setProperty('sources', [src])
  map.setProperty('sourcesContent', [orig])

  var mapped = [orig, map.toComment()].join('\n')

  from2([mapped])
    .pipe(uglifyify(json))
    .pipe(bl(doneWithMap))

  from2([orig])
    .pipe(uglifyify(json))
    .pipe(bl(doneWithoutMap))

  browserify({ entries: [src], debug: true })
    .transform(uglifyify)
    .bundle()
    .pipe(bl(doneWithMap))

  browserify({ entries: [src], debug: false })
    .transform(uglifyify)
    .bundle()
    .pipe(bl(doneWithoutDebug))

  from2([mapped])
    .pipe(uglifyify(json, { _flags: { debug: false }}))
    .pipe(bl(doneWithMapAndNoDebug))

  function doneWithMap(err, data) {
    if (err) return t.ifError(err)
    data = String(data)
    t.notEqual(data, orig, 'should have changed')
    t.equal(data.match(/\/\/[@#]/g).length, 1, 'should have sourcemap')
  }

  function doneWithoutMap(err, data) {
    if (err) return t.ifError(err)
    data = String(data)
    t.equal(data, orig, 'should not have changed')
    t.equal(data.indexOf(/\/\/[@#]/g), -1, 'should not have sourcemap')
  }

  function doneWithoutDebug(err, data) {
    if (err) return t.ifError(err)
    data = String(data)
    t.notEqual(data, orig, 'should have changed')
    t.equal(data.indexOf(/\/\/[@#]/g), -1, 'should not have sourcemap')
  }

  function doneWithMapAndNoDebug(err, data) {
    if (err) return t.ifError(err)
    data = String(data)
    t.notEqual(data, orig, 'should have changed')
    t.equal(data.match(/\/\/[@#]/g).length, 1, 'should have sourcemap')
  }
})
