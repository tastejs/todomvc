/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.File = undefined;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var /*istanbul ignore next*/_babelHelpers = require("babel-helpers");

/*istanbul ignore next*/
var _babelHelpers2 = _interopRequireDefault(_babelHelpers);

var /*istanbul ignore next*/_metadata = require("./metadata");

/*istanbul ignore next*/
var metadataVisitor = _interopRequireWildcard(_metadata);

var /*istanbul ignore next*/_convertSourceMap = require("convert-source-map");

/*istanbul ignore next*/
var _convertSourceMap2 = _interopRequireDefault(_convertSourceMap);

var /*istanbul ignore next*/_optionManager = require("./options/option-manager");

/*istanbul ignore next*/
var _optionManager2 = _interopRequireDefault(_optionManager);

var /*istanbul ignore next*/_pluginPass = require("../plugin-pass");

/*istanbul ignore next*/
var _pluginPass2 = _interopRequireDefault(_pluginPass);

var /*istanbul ignore next*/_shebangRegex = require("shebang-regex");

/*istanbul ignore next*/
var _shebangRegex2 = _interopRequireDefault(_shebangRegex);

var /*istanbul ignore next*/_babelTraverse = require("babel-traverse");

/*istanbul ignore next*/
var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var /*istanbul ignore next*/_sourceMap = require("source-map");

/*istanbul ignore next*/
var _sourceMap2 = _interopRequireDefault(_sourceMap);

var /*istanbul ignore next*/_babelGenerator = require("babel-generator");

/*istanbul ignore next*/
var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var /*istanbul ignore next*/_babelCodeFrame = require("babel-code-frame");

/*istanbul ignore next*/
var _babelCodeFrame2 = _interopRequireDefault(_babelCodeFrame);

var /*istanbul ignore next*/_defaults = require("lodash/defaults");

/*istanbul ignore next*/
var _defaults2 = _interopRequireDefault(_defaults);

var /*istanbul ignore next*/_logger = require("./logger");

/*istanbul ignore next*/
var _logger2 = _interopRequireDefault(_logger);

var /*istanbul ignore next*/_store = require("../../store");

/*istanbul ignore next*/
var _store2 = _interopRequireDefault(_store);

var /*istanbul ignore next*/_babylon = require("babylon");

var /*istanbul ignore next*/_util = require("../../util");

/*istanbul ignore next*/
var util = _interopRequireWildcard(_util);

var /*istanbul ignore next*/_path = require("path");

/*istanbul ignore next*/
var _path2 = _interopRequireDefault(_path);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

var /*istanbul ignore next*/_blockHoist = require("../internal-plugins/block-hoist");

/*istanbul ignore next*/
var _blockHoist2 = _interopRequireDefault(_blockHoist);

var /*istanbul ignore next*/_shadowFunctions = require("../internal-plugins/shadow-functions");

/*istanbul ignore next*/
var _shadowFunctions2 = _interopRequireDefault(_shadowFunctions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global BabelFileResult, BabelParserOptions, BabelFileMetadata */
/* eslint max-len: 0 */

var INTERNAL_PLUGINS = [[/*istanbul ignore next*/_blockHoist2.default], [/*istanbul ignore next*/_shadowFunctions2.default]];

var errorVisitor = { /*istanbul ignore next*/
  enter: function enter(path, state) {
    var loc = path.node.loc;
    if (loc) {
      state.loc = loc;
      path.stop();
    }
  }
};

/*istanbul ignore next*/
var File = function (_Store) {
  (0, _inherits3.default)(File, _Store);

  function /*istanbul ignore next*/File() {
    /*istanbul ignore next*/var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    /*istanbul ignore next*/var pipeline = arguments[1];
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, File);

    var _this = (0, _possibleConstructorReturn3.default)(this, /*istanbul ignore next*/_Store.call( /*istanbul ignore next*/this));

    /*istanbul ignore next*/_this.pipeline = pipeline;

    /*istanbul ignore next*/_this.log = new /*istanbul ignore next*/_logger2.default(_this, opts.filename || "unknown");
    /*istanbul ignore next*/_this.opts = /*istanbul ignore next*/_this.initOptions(opts);

    /*istanbul ignore next*/_this.parserOpts = {
      highlightCode: /*istanbul ignore next*/_this.opts.highlightCode,
      nonStandard: /*istanbul ignore next*/_this.opts.nonStandard,
      sourceType: /*istanbul ignore next*/_this.opts.sourceType,
      filename: /*istanbul ignore next*/_this.opts.filename,
      plugins: []
    };

    /*istanbul ignore next*/_this.pluginVisitors = [];
    /*istanbul ignore next*/_this.pluginPasses = [];

    // Plugins for top-level options.
    /*istanbul ignore next*/_this.buildPluginsForOptions( /*istanbul ignore next*/_this.opts);

    // If we are in the "pass per preset" mode, build
    // also plugins for each preset.
    if ( /*istanbul ignore next*/_this.opts.passPerPreset) {
      // All the "per preset" options are inherited from the main options.
      /*istanbul ignore next*/_this.perPresetOpts = [];
      /*istanbul ignore next*/_this.opts.presets.forEach(function (presetOpts) {
        var perPresetOpts = /*istanbul ignore next*/(0, _assign2.default)( /*istanbul ignore next*/(0, _create2.default)( /*istanbul ignore next*/_this.opts), presetOpts);
        /*istanbul ignore next*/_this.perPresetOpts.push(perPresetOpts);
        /*istanbul ignore next*/_this.buildPluginsForOptions(perPresetOpts);
      });
    }

    /*istanbul ignore next*/_this.metadata = {
      usedHelpers: [],
      marked: [],
      modules: {
        imports: [],
        exports: {
          exported: [],
          specifiers: []
        }
      }
    };

    /*istanbul ignore next*/_this.dynamicImportTypes = {};
    /*istanbul ignore next*/_this.dynamicImportIds = {};
    /*istanbul ignore next*/_this.dynamicImports = [];
    /*istanbul ignore next*/_this.declarations = {};
    /*istanbul ignore next*/_this.usedHelpers = {};

    /*istanbul ignore next*/_this.path = null;
    /*istanbul ignore next*/_this.ast = {};

    /*istanbul ignore next*/_this.code = "";
    /*istanbul ignore next*/_this.shebang = "";

    /*istanbul ignore next*/_this.hub = new /*istanbul ignore next*/_babelTraverse.Hub(_this);
    /*istanbul ignore next*/return _this;
  }

  File.prototype.getMetadata = function getMetadata() {
    var has = false;
    for ( /*istanbul ignore next*/var _iterator = this.ast.program.body, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
      /*istanbul ignore next*/
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var node = _ref;

      if (t.isModuleDeclaration(node)) {
        has = true;
        break;
      }
    }
    if (has) {
      this.path.traverse(metadataVisitor, this);
    }
  };

  File.prototype.initOptions = function initOptions(opts) {
    opts = new /*istanbul ignore next*/_optionManager2.default(this.log, this.pipeline).init(opts);

    if (opts.inputSourceMap) {
      opts.sourceMaps = true;
    }

    if (opts.moduleId) {
      opts.moduleIds = true;
    }

    opts.basename = /*istanbul ignore next*/_path2.default.basename(opts.filename, /*istanbul ignore next*/_path2.default.extname(opts.filename));

    opts.ignore = util.arrayify(opts.ignore, util.regexify);

    if (opts.only) opts.only = util.arrayify(opts.only, util.regexify);

    /*istanbul ignore next*/(0, _defaults2.default)(opts, {
      moduleRoot: opts.sourceRoot
    });

    /*istanbul ignore next*/(0, _defaults2.default)(opts, {
      sourceRoot: opts.moduleRoot
    });

    /*istanbul ignore next*/(0, _defaults2.default)(opts, {
      filenameRelative: opts.filename
    });

    var basenameRelative = /*istanbul ignore next*/_path2.default.basename(opts.filenameRelative);

    /*istanbul ignore next*/(0, _defaults2.default)(opts, {
      sourceFileName: basenameRelative,
      sourceMapTarget: basenameRelative
    });

    return opts;
  };

  File.prototype.buildPluginsForOptions = function buildPluginsForOptions(opts) {
    if (!Array.isArray(opts.plugins)) {
      return;
    }

    var plugins = opts.plugins.concat(INTERNAL_PLUGINS);
    var currentPluginVisitors = [];
    var currentPluginPasses = [];

    // init plugins!
    for ( /*istanbul ignore next*/var _iterator2 = plugins, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
      /*istanbul ignore next*/
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var ref = _ref2;
      /*istanbul ignore next*/var plugin = ref[0];
      /*istanbul ignore next*/var pluginOpts = ref[1]; // todo: fix - can't embed in loop head because of flow bug

      currentPluginVisitors.push(plugin.visitor);
      currentPluginPasses.push(new /*istanbul ignore next*/_pluginPass2.default(this, plugin, pluginOpts));

      if (plugin.manipulateOptions) {
        plugin.manipulateOptions(opts, this.parserOpts, this);
      }
    }

    this.pluginVisitors.push(currentPluginVisitors);
    this.pluginPasses.push(currentPluginPasses);
  };

  File.prototype.getModuleName = function getModuleName() {
    var opts = this.opts;
    if (!opts.moduleIds) {
      return null;
    }

    // moduleId is n/a if a `getModuleId()` is provided
    if (opts.moduleId != null && !opts.getModuleId) {
      return opts.moduleId;
    }

    var filenameRelative = opts.filenameRelative;
    var moduleName = "";

    if (opts.moduleRoot != null) {
      moduleName = opts.moduleRoot + "/";
    }

    if (!opts.filenameRelative) {
      return moduleName + opts.filename.replace(/^\//, "");
    }

    if (opts.sourceRoot != null) {
      // remove sourceRoot from filename
      var sourceRootRegEx = new RegExp("^" + opts.sourceRoot + "\/?");
      filenameRelative = filenameRelative.replace(sourceRootRegEx, "");
    }

    // remove extension
    filenameRelative = filenameRelative.replace(/\.(\w*?)$/, "");

    moduleName += filenameRelative;

    // normalize path separators
    moduleName = moduleName.replace(/\\/g, "/");

    if (opts.getModuleId) {
      // If return is falsy, assume they want us to use our generated default name
      return opts.getModuleId(moduleName) || moduleName;
    } else {
      return moduleName;
    }
  };

  File.prototype.resolveModuleSource = function resolveModuleSource(source) {
    var resolveModuleSource = this.opts.resolveModuleSource;
    if (resolveModuleSource) source = resolveModuleSource(source, this.opts.filename);
    return source;
  };

  File.prototype.addImport = function addImport(source, imported) {
    /*istanbul ignore next*/var name = arguments.length <= 2 || arguments[2] === undefined ? imported : arguments[2];

    var alias = /*istanbul ignore next*/source + ":" + imported;
    var id = this.dynamicImportIds[alias];

    if (!id) {
      source = this.resolveModuleSource(source);
      id = this.dynamicImportIds[alias] = this.scope.generateUidIdentifier(name);

      var specifiers = [];

      if (imported === "*") {
        specifiers.push(t.importNamespaceSpecifier(id));
      } else if (imported === "default") {
        specifiers.push(t.importDefaultSpecifier(id));
      } else {
        specifiers.push(t.importSpecifier(id, t.identifier(imported)));
      }

      var declar = t.importDeclaration(specifiers, t.stringLiteral(source));
      declar._blockHoist = 3;

      this.path.unshiftContainer("body", declar);
    }

    return id;
  };

  File.prototype.addHelper = function addHelper(name) {
    var declar = this.declarations[name];
    if (declar) return declar;

    if (!this.usedHelpers[name]) {
      this.metadata.usedHelpers.push(name);
      this.usedHelpers[name] = true;
    }

    var generator = this.get("helperGenerator");
    var runtime = this.get("helpersNamespace");
    if (generator) {
      var res = generator(name);
      if (res) return res;
    } else if (runtime) {
      return t.memberExpression(runtime, t.identifier(name));
    }

    var ref = /*istanbul ignore next*/(0, _babelHelpers2.default)(name);
    var uid = this.declarations[name] = this.scope.generateUidIdentifier(name);

    if (t.isFunctionExpression(ref) && !ref.id) {
      ref.body._compact = true;
      ref._generated = true;
      ref.id = uid;
      ref.type = "FunctionDeclaration";
      this.path.unshiftContainer("body", ref);
    } else {
      ref._compact = true;
      this.scope.push({
        id: uid,
        init: ref,
        unique: true
      });
    }

    return uid;
  };

  File.prototype.addTemplateObject = function addTemplateObject(helperName, strings, raw) {
    // Generate a unique name based on the string literals so we dedupe
    // identical strings used in the program.
    var stringIds = raw.elements.map(function (string) {
      return string.value;
    });
    var name = /*istanbul ignore next*/helperName + "_" + raw.elements.length + "_" + stringIds.join(",");

    var declar = this.declarations[name];
    if (declar) return declar;

    var uid = this.declarations[name] = this.scope.generateUidIdentifier("templateObject");

    var helperId = this.addHelper(helperName);
    var init = t.callExpression(helperId, [strings, raw]);
    init._compact = true;
    this.scope.push({
      id: uid,
      init: init,
      _blockHoist: 1.9 // This ensures that we don't fail if not using function expression helpers
    });
    return uid;
  };

  File.prototype.buildCodeFrameError = function buildCodeFrameError(node, msg) {
    /*istanbul ignore next*/var Error = arguments.length <= 2 || arguments[2] === undefined ? SyntaxError : arguments[2];

    var loc = node && (node.loc || node._loc);

    var err = new Error(msg);

    if (loc) {
      err.loc = loc.start;
    } else {
      /*istanbul ignore next*/(0, _babelTraverse2.default)(node, errorVisitor, this.scope, err);

      err.message += " (This is an error on an internal node. Probably an internal error";

      if (err.loc) {
        err.message += ". Location has been estimated.";
      }

      err.message += ")";
    }

    return err;
  };

  File.prototype.mergeSourceMap = function mergeSourceMap(map) {
    var inputMap = this.opts.inputSourceMap;

    if (inputMap) {
      /*istanbul ignore next*/
      var _ret = function () {
        var inputMapConsumer = new /*istanbul ignore next*/_sourceMap2.default.SourceMapConsumer(inputMap);
        var outputMapConsumer = new /*istanbul ignore next*/_sourceMap2.default.SourceMapConsumer(map);

        var mergedGenerator = new /*istanbul ignore next*/_sourceMap2.default.SourceMapGenerator({
          file: inputMapConsumer.file,
          sourceRoot: inputMapConsumer.sourceRoot
        });

        // This assumes the output map always has a single source, since Babel always compiles a single source file to a
        // single output file.
        var source = outputMapConsumer.sources[0];

        inputMapConsumer.eachMapping(function (mapping) {
          var generatedPosition = outputMapConsumer.generatedPositionFor({
            line: mapping.generatedLine,
            column: mapping.generatedColumn,
            source: source
          });
          if (generatedPosition.column != null) {
            mergedGenerator.addMapping({
              source: mapping.source,

              original: mapping.source == null ? null : {
                line: mapping.originalLine,
                column: mapping.originalColumn
              },

              generated: generatedPosition
            });
          }
        });

        var mergedMap = mergedGenerator.toJSON();
        inputMap.mappings = mergedMap.mappings;
        return (/*istanbul ignore next*/{
            v: inputMap
          }
        );
      }();

      /*istanbul ignore next*/if ((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
    } else {
      return map;
    }
  };

  File.prototype.parse = function parse(code) {
    this.log.debug("Parse start");
    var ast = /*istanbul ignore next*/(0, _babylon.parse)(code, this.parserOpts);
    this.log.debug("Parse stop");
    return ast;
  };

  File.prototype._addAst = function _addAst(ast) {
    this.path = /*istanbul ignore next*/_babelTraverse.NodePath.get({
      hub: this.hub,
      parentPath: null,
      parent: ast,
      container: ast,
      key: "program"
    }).setContext();
    this.scope = this.path.scope;
    this.ast = ast;
    this.getMetadata();
  };

  File.prototype.addAst = function addAst(ast) {
    this.log.debug("Start set AST");
    this._addAst(ast);
    this.log.debug("End set AST");
  };

  File.prototype.transform = function transform() {
    // In the "pass per preset" mode, we have grouped passes.
    // Otherwise, there is only one plain pluginPasses array.
    for (var i = 0; i < this.pluginPasses.length; i++) {
      var pluginPasses = this.pluginPasses[i];
      this.call("pre", pluginPasses);
      this.log.debug("Start transform traverse");
      /*istanbul ignore next*/(0, _babelTraverse2.default)(this.ast, /*istanbul ignore next*/_babelTraverse2.default.visitors.merge(this.pluginVisitors[i], pluginPasses), this.scope);
      this.log.debug("End transform traverse");
      this.call("post", pluginPasses);
    }

    return this.generate();
  };

  File.prototype.wrap = function wrap(code, callback) {
    code = code + "";

    try {
      if (this.shouldIgnore()) {
        return this.makeResult({ code: code, ignored: true });
      } else {
        return callback();
      }
    } catch (err) {
      if (err._babel) {
        throw err;
      } else {
        err._babel = true;
      }

      var message = err.message = /*istanbul ignore next*/this.opts.filename + ": " + err.message;

      var loc = err.loc;
      if (loc) {
        err.codeFrame = /*istanbul ignore next*/(0, _babelCodeFrame2.default)(code, loc.line, loc.column + 1, this.opts);
        message += "\n" + err.codeFrame;
      }

      if (process.browser) {
        // chrome has it's own pretty stringifier which doesn't use the stack property
        // https://github.com/babel/babel/issues/2175
        err.message = message;
      }

      if (err.stack) {
        var newStack = err.stack.replace(err.message, message);
        err.stack = newStack;
      }

      throw err;
    }
  };

  File.prototype.addCode = function addCode(code) {
    code = (code || "") + "";
    code = this.parseInputSourceMap(code);
    this.code = code;
  };

  File.prototype.parseCode = function parseCode() {
    this.parseShebang();
    var ast = this.parse(this.code);
    this.addAst(ast);
  };

  File.prototype.shouldIgnore = function shouldIgnore() {
    var opts = this.opts;
    return util.shouldIgnore(opts.filename, opts.ignore, opts.only);
  };

  File.prototype.call = function call(key, pluginPasses) {
    for ( /*istanbul ignore next*/var _iterator3 = pluginPasses, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
      /*istanbul ignore next*/
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var pass = _ref3;

      var plugin = pass.plugin;
      var fn = plugin[key];
      if (fn) fn.call(pass, this);
    }
  };

  File.prototype.parseInputSourceMap = function parseInputSourceMap(code) {
    var opts = this.opts;

    if (opts.inputSourceMap !== false) {
      var inputMap = /*istanbul ignore next*/_convertSourceMap2.default.fromSource(code);
      if (inputMap) {
        opts.inputSourceMap = inputMap.toObject();
        code = /*istanbul ignore next*/_convertSourceMap2.default.removeComments(code);
      }
    }

    return code;
  };

  File.prototype.parseShebang = function parseShebang() {
    var shebangMatch = /*istanbul ignore next*/_shebangRegex2.default.exec(this.code);
    if (shebangMatch) {
      this.shebang = shebangMatch[0];
      this.code = this.code.replace( /*istanbul ignore next*/_shebangRegex2.default, "");
    }
  };

  File.prototype.makeResult = function makeResult(_ref4) {
    /*istanbul ignore next*/var code = _ref4.code;
    /*istanbul ignore next*/var map = _ref4.map;
    /*istanbul ignore next*/var ast = _ref4.ast;
    /*istanbul ignore next*/var ignored = _ref4.ignored;

    var result = {
      metadata: null,
      options: this.opts,
      ignored: !!ignored,
      code: null,
      ast: null,
      map: map || null
    };

    if (this.opts.code) {
      result.code = code;
    }

    if (this.opts.ast) {
      result.ast = ast;
    }

    if (this.opts.metadata) {
      result.metadata = this.metadata;
    }

    return result;
  };

  File.prototype.generate = function generate() {
    var opts = this.opts;
    var ast = this.ast;

    var result = { ast: ast };
    if (!opts.code) return this.makeResult(result);

    this.log.debug("Generation start");

    var _result = /*istanbul ignore next*/(0, _babelGenerator2.default)(ast, opts, this.code);
    result.code = _result.code;
    result.map = _result.map;

    this.log.debug("Generation end");

    if (this.shebang) {
      // add back shebang
      result.code = /*istanbul ignore next*/this.shebang + "\n" + result.code;
    }

    if (result.map) {
      result.map = this.mergeSourceMap(result.map);
    }

    if (opts.sourceMaps === "inline" || opts.sourceMaps === "both") {
      result.code += "\n" + /*istanbul ignore next*/_convertSourceMap2.default.fromObject(result.map).toComment();
    }

    if (opts.sourceMaps === "inline") {
      result.map = null;
    }

    return this.makeResult(result);
  };

  return File;
}(_store2.default);

/*istanbul ignore next*/exports.default = File;
/*istanbul ignore next*/exports.File = File;