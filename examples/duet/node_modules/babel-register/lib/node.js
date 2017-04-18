/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = function () {
  /*istanbul ignore next*/var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (opts.only != null) only = /*istanbul ignore next*/_babelCore.util.arrayify(opts.only, /*istanbul ignore next*/_babelCore.util.regexify);
  if (opts.ignore != null) ignore = /*istanbul ignore next*/_babelCore.util.arrayify(opts.ignore, /*istanbul ignore next*/_babelCore.util.regexify);

  if (opts.extensions) hookExtensions( /*istanbul ignore next*/_babelCore.util.arrayify(opts.extensions));

  if (opts.cache === false) cache = null;

  delete opts.extensions;
  delete opts.ignore;
  delete opts.cache;
  delete opts.only;

  /*istanbul ignore next*/(0, _extend2.default)(transformOpts, opts);
};

var /*istanbul ignore next*/_cloneDeep = require("lodash/cloneDeep");

/*istanbul ignore next*/
var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var /*istanbul ignore next*/_sourceMapSupport = require("source-map-support");

/*istanbul ignore next*/
var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var /*istanbul ignore next*/_cache = require("./cache");

/*istanbul ignore next*/
var registerCache = _interopRequireWildcard(_cache);

var /*istanbul ignore next*/_extend = require("lodash/extend");

/*istanbul ignore next*/
var _extend2 = _interopRequireDefault(_extend);

var /*istanbul ignore next*/_babelCore = require("babel-core");

/*istanbul ignore next*/
var babel = _interopRequireWildcard(_babelCore);

var /*istanbul ignore next*/_each = require("lodash/each");

/*istanbul ignore next*/
var _each2 = _interopRequireDefault(_each);

var /*istanbul ignore next*/_fs = require("fs");

/*istanbul ignore next*/
var _fs2 = _interopRequireDefault(_fs);

var /*istanbul ignore next*/_path = require("path");

/*istanbul ignore next*/
var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore next*/_sourceMapSupport2.default.install({
  handleUncaughtExceptions: false,
  /*istanbul ignore next*/retrieveSourceMap: function retrieveSourceMap(source) {
    var map = maps && maps[source];
    if (map) {
      return {
        url: null,
        map: map
      };
    } else {
      return null;
    }
  }
});

registerCache.load();
var cache = registerCache.get();

var transformOpts = {};

var ignore = /*istanbul ignore next*/void 0;
var only = /*istanbul ignore next*/void 0;

var oldHandlers = {};
var maps = {};

var cwd = process.cwd();

function getRelativePath(filename) {
  return (/*istanbul ignore next*/_path2.default.relative(cwd, filename)
  );
}

function mtime(filename) {
  return + /*istanbul ignore next*/_fs2.default.statSync(filename).mtime;
}

function compile(filename) {
  var result = /*istanbul ignore next*/void 0;

  // merge in base options and resolve all the plugins and presets relative to this file
  var opts = new /*istanbul ignore next*/_babelCore.OptionManager().init( /*istanbul ignore next*/(0, _extend2.default)( /*istanbul ignore next*/(0, _cloneDeep2.default)(transformOpts), {
    filename: filename
  }));

  var cacheKey = /*istanbul ignore next*/ /*istanbul ignore next*/(0, _stringify2.default)(opts) + ":" + babel.version;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) cacheKey += /*istanbul ignore next*/":" + env;

  if (cache) {
    var cached = cache[cacheKey];
    if (cached && cached.mtime === mtime(filename)) {
      result = cached;
    }
  }

  if (!result) {
    result = babel.transformFileSync(filename, /*istanbul ignore next*/(0, _extend2.default)(opts, {
      // Do not process config files since has already been done with the OptionManager
      // calls above and would introduce duplicates.
      babelrc: false,
      sourceMap: "both",
      ast: false
    }));
  }

  if (cache) {
    cache[cacheKey] = result;
    result.mtime = mtime(filename);
  }

  maps[filename] = result.map;

  return result.code;
}

function shouldIgnore(filename) {
  if (!ignore && !only) {
    return getRelativePath(filename).split( /*istanbul ignore next*/_path2.default.sep).indexOf("node_modules") >= 0;
  } else {
    return (/*istanbul ignore next*/_babelCore.util.shouldIgnore(filename, ignore || [], only)
    );
  }
}

function loader(m, filename) {
  m._compile(compile(filename), filename);
}

function registerExtension(ext) {
  var old = oldHandlers[ext] || oldHandlers[".js"] || require.extensions[".js"];

  require.extensions[ext] = function (m, filename) {
    if (shouldIgnore(filename)) {
      old(m, filename);
    } else {
      loader(m, filename, old);
    }
  };
}

function hookExtensions(_exts) {
  /*istanbul ignore next*/(0, _each2.default)(oldHandlers, function (old, ext) {
    if (old === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = old;
    }
  });

  oldHandlers = {};

  /*istanbul ignore next*/(0, _each2.default)(_exts, function (ext) {
    oldHandlers[ext] = require.extensions[ext];
    registerExtension(ext);
  });
}

hookExtensions( /*istanbul ignore next*/_babelCore.util.canCompile.EXTENSIONS);

/*istanbul ignore next*/module.exports = exports["default"];