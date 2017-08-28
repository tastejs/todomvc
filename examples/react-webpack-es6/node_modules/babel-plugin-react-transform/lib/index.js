'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pathParse = require('path-parse');

var _pathParse2 = _interopRequireDefault(_pathParse);

exports['default'] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  var parentDir = _path2['default'].resolve(_path2['default'].join(__dirname, '..', '..'));
  function resolvePathConservatively(specifiedPath, filePath) {
    if (specifiedPath[0] === '.') {
      throw new Error('Relative path like ' + specifiedPath + ' is only allowed if ' + 'babel-plugin-react-transform is inside a node_modules folder.');
    }
    return specifiedPath;
  }
  function resolvePathAssumingWeAreInNodeModules(specifiedPath, filePath) {
    if (specifiedPath[0] === '.') {
      return '.' + _path2['default'].sep + _path2['default'].relative(_path2['default'].dirname(filePath), _path2['default'].resolve(_path2['default'].join(parentDir, '..', specifiedPath)));
    }
    return specifiedPath;
  }
  var resolvePath = _path2['default'].basename(parentDir) === 'node_modules' ? resolvePathAssumingWeAreInNodeModules : resolvePathConservatively;

  var depthKey = '__reactTransformDepth';
  var recordsKey = '__reactTransformRecords';
  var wrapComponentIdKey = '__reactTransformWrapComponentId';
  var optionsKey = '__reactTransformOptions';
  var cacheKey = '__reactTransformCache';

  function isRenderMethod(member) {
    return member.kind === 'method' && member.key.name === 'render';
  }

  /**
   * Does this class have a render function?
   */
  function isComponentishClass(cls) {
    return cls.body.body.filter(isRenderMethod).length > 0;
  }

  function buildIsCreateClassCallExpression(factoryMethods) {
    var matchMemberExpressions = {};

    factoryMethods.forEach(function (method) {
      matchMemberExpressions[method] = t.buildMatchMemberExpression(method);
    });

    return function (node) {
      for (var i = 0; i < factoryMethods.length; i++) {
        var method = factoryMethods[i];
        if (method.indexOf('.') !== -1) {
          if (matchMemberExpressions[method](node.callee)) {
            return true;
          }
        } else {
          if (node.callee.name === method) {
            return true;
          }
        }
      }
    };
  }

  /**
   * Does this node look like a createClass() call?
   */
  function isCreateClass(node, isCreateClassCallExpression) {
    if (!node || !t.isCallExpression(node)) {
      return false;
    }
    if (!isCreateClassCallExpression(node)) {
      return false;
    }
    var args = node.arguments;
    if (args.length !== 1) {
      return false;
    }
    var first = args[0];
    if (!t.isObjectExpression(first)) {
      return false;
    }
    return true;
  }

  /**
   * Infers a displayName from either a class node, or a createClass() call node.
   */
  function findDisplayName(node) {
    if (node.id) {
      return node.id.name;
    }
    if (!node.arguments) {
      return;
    }
    var props = node.arguments[0].properties;
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var key = t.toComputedKey(prop);
      if (t.isLiteral(key, { value: 'displayName' })) {
        return prop.value.value;
      }
    }
  }

  function isValidOptions(options) {
    return typeof options === 'object' && Array.isArray(options.transforms);
  }

  var didWarnAboutLegacyConfig = false;
  function warnOnceAboutLegacyConfig() {
    if (didWarnAboutLegacyConfig) {
      return;
    }
    console.warn('Warning: you are using an outdated format of React Transform configuration. ' + 'Please update your configuration to the new format. See the Releases page for migration instructions: ' + 'https://github.com/gaearon/babel-plugin-react-transform/releases');
    didWarnAboutLegacyConfig = true;
  }

  /**
   * Enforces plugin options to be defined and returns them.
   */
  function getPluginOptions(file) {
    if (!file.opts || !file.opts.extra) {
      return;
    }

    var pluginOptions = file.opts.extra['react-transform'];
    if (Array.isArray(pluginOptions)) {
      warnOnceAboutLegacyConfig();
      var transforms = pluginOptions.map(function (option) {
        option.transform = option.transform || option.target;
        return option;
      });
      pluginOptions = { transforms: transforms };
    }

    if (!isValidOptions(pluginOptions)) {
      throw new Error('babel-plugin-react-transform requires that you specify ' + 'extras["react-transform"] in .babelrc ' + 'or in your Babel Node API call options, and that it is an object with ' + 'a transforms property which is an array.');
    }
    return pluginOptions;
  }

  /**
   * Creates a record about us having visited a valid React component.
   * Such records will later be merged into a single object.
   */
  function createComponentRecord(node, scope, file, state) {
    var displayName = findDisplayName(node) || undefined;
    var uniqueId = scope.generateUidIdentifier('$' + (displayName || 'Unknown')).name;

    var props = [];
    if (typeof displayName === 'string') {
      props.push(t.property('init', t.identifier('displayName'), t.literal(displayName)));
    }
    if (state[depthKey] > 0) {
      props.push(t.property('init', t.identifier('isInFunction'), t.literal(true)));
    }

    return [uniqueId, t.objectExpression(props)];
  }

  /**
   * Memorizes the fact that we have visited a valid component in the plugin state.
   * We will later retrieve memorized records to compose an object out of them.
   */
  function addComponentRecord(node, scope, file, state) {
    var _createComponentRecord = createComponentRecord(node, scope, file, state);

    var _createComponentRecord2 = _slicedToArray(_createComponentRecord, 2);

    var uniqueId = _createComponentRecord2[0];
    var definition = _createComponentRecord2[1];

    state[recordsKey] = state[recordsKey] || [];
    state[recordsKey].push(t.property('init', t.identifier(uniqueId), definition));
    return uniqueId;
  }

  /**
   * Have we visited any components so far?
   */
  function foundComponentRecords(state) {
    var records = state[recordsKey];
    return records && records.length > 0;
  }

  /**
   * Turns all component records recorded so far, into a variable.
   */
  function defineComponentRecords(scope, state) {
    var records = state[recordsKey];
    state[recordsKey] = [];

    var id = scope.generateUidIdentifier('components');
    return [id, t.variableDeclaration('var', [t.variableDeclarator(id, t.objectExpression(records))])];
  }

  /**
   * Imports and calls a particular transformation target function.
   * You may specify several such transformations, so they are handled separately.
   */
  function defineInitTransformCall(scope, file, recordsId, targetOptions) {
    var id = scope.generateUidIdentifier('reactComponentWrapper');
    var transform = targetOptions.transform;
    var _targetOptions$imports = targetOptions.imports;
    var imports = _targetOptions$imports === undefined ? [] : _targetOptions$imports;
    var _targetOptions$locals = targetOptions.locals;
    var locals = _targetOptions$locals === undefined ? [] : _targetOptions$locals;
    var filename = file.opts.filename;

    function isSameAsFileBeingProcessed(importPath) {
      var _parsePath = (0, _pathParse2['default'])(resolvePath(importPath, filename));

      var dir = _parsePath.dir;
      var base = _parsePath.base;
      var ext = _parsePath.ext;
      var name = _parsePath.name;

      return dir === '.' && name === (0, _pathParse2['default'])(filename).name;
    }

    if (imports.some(isSameAsFileBeingProcessed)) {
      return;
    }

    return [id, t.variableDeclaration('var', [t.variableDeclarator(id, t.callExpression(file.addImport(resolvePath(transform, filename)), [t.objectExpression([t.property('init', t.identifier('filename'), t.literal(filename)), t.property('init', t.identifier('components'), recordsId), t.property('init', t.identifier('locals'), t.arrayExpression(locals.map(function (local) {
      return t.identifier(local);
    }))), t.property('init', t.identifier('imports'), t.arrayExpression(imports.map(function (imp) {
      return file.addImport(resolvePath(imp, filename), imp, 'absolute');
    })))])]))])];
  }

  /**
   * Defines the function that calls every transform.
   * This is the function every component will be wrapped with.
   */
  function defineWrapComponent(wrapComponentId, initTransformIds) {
    return t.functionDeclaration(wrapComponentId, [t.identifier('uniqueId')], t.blockStatement([t.returnStatement(t.functionExpression(null, [t.identifier('ReactClass')], t.blockStatement([t.returnStatement(initTransformIds.reduce(function (composed, initTransformId) {
      return t.callExpression(initTransformId, [composed, t.identifier('uniqueId')]);
    }, t.identifier('ReactClass')))])))]));
  }

  return new Plugin('babel-plugin-react-transform', {
    visitor: {
      Function: {
        enter: function enter(node, parent, scope, file) {
          if (!this.state[depthKey]) {
            this.state[depthKey] = 0;
          }
          this.state[depthKey]++;
        },
        exit: function exit(node, parent, scope, file) {
          this.state[depthKey]--;
        }
      },

      Class: function Class(node, parent, scope, file) {
        if (!isComponentishClass(node)) {
          return;
        }

        var wrapReactComponentId = this.state[wrapComponentIdKey];
        var uniqueId = addComponentRecord(node, scope, file, this.state);

        node.decorators = node.decorators || [];
        node.decorators.push(t.decorator(t.callExpression(wrapReactComponentId, [t.literal(uniqueId)])));
      },

      CallExpression: {
        exit: function exit(node, parent, scope, file) {
          var isCreateClassCallExpression = this.state[cacheKey].isCreateClassCallExpression;

          if (!isCreateClass(node, isCreateClassCallExpression)) {
            return;
          }

          var wrapReactComponentId = this.state[wrapComponentIdKey];
          var uniqueId = addComponentRecord(node, scope, file, this.state);

          return t.callExpression(t.callExpression(wrapReactComponentId, [t.literal(uniqueId)]), [node]);
        }
      },

      Program: {
        enter: function enter(node, parent, scope, file) {
          var options = getPluginOptions(file);
          var factoryMethods = options.factoryMethods || ['React.createClass', 'createClass'];
          this.state[optionsKey] = options;
          this.state[cacheKey] = {
            isCreateClassCallExpression: buildIsCreateClassCallExpression(factoryMethods)
          };

          this.state[wrapComponentIdKey] = scope.generateUidIdentifier('wrapComponent');
        },

        exit: function exit(node, parent, scope, file) {
          if (!foundComponentRecords(this.state)) {
            return;
          }

          // Generate a variable holding component records
          var allTransforms = this.state[optionsKey].transforms;

          var _defineComponentRecords = defineComponentRecords(scope, this.state);

          var _defineComponentRecords2 = _slicedToArray(_defineComponentRecords, 2);

          var recordsId = _defineComponentRecords2[0];
          var recordsVar = _defineComponentRecords2[1];

          // Import transformation functions and initialize them
          var initTransformCalls = allTransforms.map(function (transformOptions) {
            return defineInitTransformCall(scope, file, recordsId, transformOptions);
          }).filter(Boolean);
          var initTransformIds = initTransformCalls.map(function (c) {
            return c[0];
          });
          var initTransformVars = initTransformCalls.map(function (c) {
            return c[1];
          });

          // Create one uber function calling each transformation
          var wrapComponentId = this.state[wrapComponentIdKey];
          var wrapComponent = defineWrapComponent(wrapComponentId, initTransformIds);

          return t.program([recordsVar].concat(_toConsumableArray(initTransformVars), [wrapComponent], _toConsumableArray(node.body)));
        }
      }
    }
  });
};

module.exports = exports['default'];