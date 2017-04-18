/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = function (loc) {
  /*istanbul ignore next*/var relative = arguments.length <= 1 || arguments[1] === undefined ? process.cwd() : arguments[1];

  // we're in the browser, probably
  if ( /*istanbul ignore next*/(typeof _module2.default === "undefined" ? "undefined" : (0, _typeof3.default)(_module2.default)) === "object") return null;

  var relativeMod = relativeModules[relative];

  if (!relativeMod) {
    relativeMod = new /*istanbul ignore next*/_module2.default();

    // We need to define an id and filename on our "fake" relative` module so that
    // Node knows what "." means in the case of us trying to resolve a plugin
    // such as "./myPlugins/somePlugin.js". If we don't specify id and filename here,
    // Node presumes "." is process.cwd(), not our relative path.
    // Since this fake module is never "loaded", we don't have to worry about mutating
    // any global Node module cache state here.
    var filename = /*istanbul ignore next*/_path2.default.join(relative, ".babelrc");
    relativeMod.id = filename;
    relativeMod.filename = filename;

    relativeMod.paths = /*istanbul ignore next*/_module2.default._nodeModulePaths(relative);
    relativeModules[relative] = relativeMod;
  }

  try {
    return (/*istanbul ignore next*/_module2.default._resolveFilename(loc, relativeMod)
    );
  } catch (err) {
    return null;
  }
};

var /*istanbul ignore next*/_module = require("module");

/*istanbul ignore next*/
var _module2 = _interopRequireDefault(_module);

var /*istanbul ignore next*/_path = require("path");

/*istanbul ignore next*/
var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var relativeModules = {};

/*istanbul ignore next*/module.exports = exports["default"];