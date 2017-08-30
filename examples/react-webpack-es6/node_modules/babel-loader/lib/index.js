"use strict";

var assign = require("object-assign");
var babel = require("babel-core");
var loaderUtils = require("loader-utils");
var path = require("path");
var cache = require("./fs-cache.js");
var exists = require("./utils/exists")();
var relative = require("./utils/relative");
var read = require("./utils/read")();
var resolveRc = require("./resolve-rc.js");
var pkg = require("./../package.json");

function BabelLoaderError(name, message, codeFrame, hideStack, error) {
  Error.call(this);
  Error.captureStackTrace(this, BabelLoaderError);

  this.name = "BabelLoaderError";
  this.message = formatMessage(name, message, codeFrame);
  this.hideStack = hideStack;
  this.error = error;
}

BabelLoaderError.prototype = Object.create(Error.prototype);
BabelLoaderError.prototype.constructor = BabelLoaderError;

var STRIP_FILENAME_RE = /^[^:]+: /;

var formatMessage = function formatMessage(name, message, codeFrame) {
  return (name ? name + ": " : "") + message + "\n\n" + codeFrame + "\n";
};

var transpile = function transpile(source, options) {
  var forceEnv = options.forceEnv;
  var tmpEnv = void 0;

  delete options.forceEnv;

  if (forceEnv) {
    tmpEnv = process.env.BABEL_ENV;
    process.env.BABEL_ENV = forceEnv;
  }

  var result = void 0;
  try {
    result = babel.transform(source, options);
  } catch (error) {
    if (forceEnv) restoreBabelEnv(tmpEnv);
    if (error.message && error.codeFrame) {
      var message = error.message;
      var name = void 0;
      var hideStack = void 0;
      if (error instanceof SyntaxError) {
        message = message.replace(STRIP_FILENAME_RE, "");
        name = "SyntaxError";
        hideStack = true;
      } else if (error instanceof TypeError) {
        message = message.replace(STRIP_FILENAME_RE, "");
        hideStack = true;
      }
      throw new BabelLoaderError(name, message, error.codeFrame, hideStack, error);
    } else {
      throw error;
    }
  }
  var code = result.code;
  var map = result.map;
  var metadata = result.metadata;

  if (map && (!map.sourcesContent || !map.sourcesContent.length)) {
    map.sourcesContent = [source];
  }

  if (forceEnv) restoreBabelEnv(tmpEnv);

  return {
    code: code,
    map: map,
    metadata: metadata
  };
};

function restoreBabelEnv(prevValue) {
  if (prevValue === undefined) {
    delete process.env.BABEL_ENV;
  } else {
    process.env.BABEL_ENV = prevValue;
  }
}

function passMetadata(s, context, metadata) {
  if (context[s]) {
    context[s](metadata);
  }
}

module.exports = function (source, inputSourceMap) {
  var _this = this;

  var webpackRemainingChain = loaderUtils.getRemainingRequest(this).split("!");
  var filename = webpackRemainingChain[webpackRemainingChain.length - 1];

  var globalOptions = this.options.babel || {};
  var loaderOptions = loaderUtils.parseQuery(this.query);
  var userOptions = assign({}, globalOptions, loaderOptions);
  var defaultOptions = {
    metadataSubscribers: [],
    inputSourceMap: inputSourceMap,
    sourceRoot: process.cwd(),
    filename: filename,
    cacheIdentifier: JSON.stringify({
      "babel-loader": pkg.version,
      "babel-core": babel.version,
      babelrc: exists(userOptions.babelrc) ? read(userOptions.babelrc) : resolveRc(path.dirname(filename)),
      env: userOptions.forceEnv || process.env.BABEL_ENV || process.env.NODE_ENV || "development"
    })
  };

  var options = assign({}, defaultOptions, userOptions);

  if (userOptions.sourceMap === undefined) {
    options.sourceMap = this.sourceMap;
  }

  if (options.sourceFileName === undefined) {
    options.sourceFileName = relative(options.sourceRoot, options.filename);
  }

  var cacheDirectory = options.cacheDirectory;
  var cacheIdentifier = options.cacheIdentifier;
  var metadataSubscribers = options.metadataSubscribers;

  delete options.cacheDirectory;
  delete options.cacheIdentifier;
  delete options.metadataSubscribers;

  this.cacheable();

  if (cacheDirectory) {
    var callback = this.async();
    return cache({
      directory: cacheDirectory,
      identifier: cacheIdentifier,
      source: source,
      options: options,
      transform: transpile
    }, function (err) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          code = _ref.code,
          map = _ref.map,
          metadata = _ref.metadata;

      if (err) return callback(err);

      metadataSubscribers.forEach(function (s) {
        return passMetadata(s, _this, metadata);
      });

      return callback(null, code, map);
    });
  }

  var _transpile = transpile(source, options),
      code = _transpile.code,
      map = _transpile.map,
      metadata = _transpile.metadata;

  metadataSubscribers.forEach(function (s) {
    return passMetadata(s, _this, metadata);
  });

  this.callback(null, code, map);
};