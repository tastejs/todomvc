/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var /*istanbul ignore next*/_babelTraverse = require("babel-traverse");

var /*istanbul ignore next*/_babelHelperReplaceSupers = require("babel-helper-replace-supers");

/*istanbul ignore next*/
var _babelHelperReplaceSupers2 = _interopRequireDefault(_babelHelperReplaceSupers);

var /*istanbul ignore next*/_babelHelperOptimiseCallExpression = require("babel-helper-optimise-call-expression");

/*istanbul ignore next*/
var _babelHelperOptimiseCallExpression2 = _interopRequireDefault(_babelHelperOptimiseCallExpression);

var /*istanbul ignore next*/_babelHelperDefineMap = require("babel-helper-define-map");

/*istanbul ignore next*/
var defineMap = _interopRequireWildcard(_babelHelperDefineMap);

var /*istanbul ignore next*/_babelTemplate = require("babel-template");

/*istanbul ignore next*/
var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildDerivedConstructor = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function () {\n    super(...arguments);\n  })\n"); /* eslint max-len: 0 */

var noMethodVisitor = { /*istanbul ignore next*/
  "FunctionExpression|FunctionDeclaration": function FunctionExpressionFunctionDeclaration(path) {
    if (!path.is("shadow")) {
      path.skip();
    }
  },
  /*istanbul ignore next*/Method: function Method(path) {
    path.skip();
  }
};

var verifyConstructorVisitor = /*istanbul ignore next*/_babelTraverse.visitors.merge([noMethodVisitor, { /*istanbul ignore next*/
  Super: function Super(path) {
    if (this.isDerived && !this.hasBareSuper && !path.parentPath.isCallExpression({ callee: path.node })) {
      throw path.buildCodeFrameError("'super.*' is not allowed before super()");
    }
  },


  CallExpression: { /*istanbul ignore next*/
    exit: function exit(path) {
      if (path.get("callee").isSuper()) {
        this.hasBareSuper = true;

        if (!this.isDerived) {
          throw path.buildCodeFrameError("super() is only allowed in a derived constructor");
        }
      }
    }
  },

  /*istanbul ignore next*/ThisExpression: function ThisExpression(path) {
    if (this.isDerived && !this.hasBareSuper) {
      if (!path.inShadow("this")) {
        throw path.buildCodeFrameError("'this' is not allowed before super()");
      }
    }
  }
}]);

var findThisesVisitor = /*istanbul ignore next*/_babelTraverse.visitors.merge([noMethodVisitor, { /*istanbul ignore next*/
  ThisExpression: function ThisExpression(path) {
    this.superThises.push(path);
  }
}]);

/*istanbul ignore next*/
var ClassTransformer = function () {
  function /*istanbul ignore next*/ClassTransformer(path, file) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, ClassTransformer);

    this.parent = path.parent;
    this.scope = path.scope;
    this.node = path.node;
    this.path = path;
    this.file = file;

    this.clearDescriptors();

    this.instancePropBody = [];
    this.instancePropRefs = {};
    this.staticPropBody = [];
    this.body = [];

    this.bareSuperAfter = [];
    this.bareSupers = [];

    this.pushedConstructor = false;
    this.pushedInherits = false;
    this.isLoose = false;

    this.superThises = [];

    // class id
    this.classId = this.node.id;

    // this is the name of the binding that will **always** reference the class we've constructed
    this.classRef = this.node.id ? t.identifier(this.node.id.name) : this.scope.generateUidIdentifier("class");

    this.superName = this.node.superClass || t.identifier("Function");
    this.isDerived = !!this.node.superClass;
  }

  ClassTransformer.prototype.run = function run() {
    /*istanbul ignore next*/
    var _this = this;

    var superName = this.superName;
    var file = this.file;
    var body = this.body;

    //

    var constructorBody = this.constructorBody = t.blockStatement([]);
    this.constructor = this.buildConstructor();

    //

    var closureParams = [];
    var closureArgs = [];

    //
    if (this.isDerived) {
      closureArgs.push(superName);

      superName = this.scope.generateUidIdentifierBasedOnNode(superName);
      closureParams.push(superName);

      this.superName = superName;
    }

    //
    this.buildBody();

    // make sure this class isn't directly called
    constructorBody.body.unshift(t.expressionStatement(t.callExpression(file.addHelper("classCallCheck"), [t.thisExpression(), this.classRef])));

    body = body.concat(this.staticPropBody.map(function (fn) /*istanbul ignore next*/{
      return fn( /*istanbul ignore next*/_this.classRef);
    }));

    if (this.classId) {
      // named class with only a constructor
      if (body.length === 1) return t.toExpression(body[0]);
    }

    //
    body.push(t.returnStatement(this.classRef));

    var container = t.functionExpression(null, closureParams, t.blockStatement(body));
    container.shadow = true;
    return t.callExpression(container, closureArgs);
  };

  ClassTransformer.prototype.buildConstructor = function buildConstructor() {
    var func = t.functionDeclaration(this.classRef, [], this.constructorBody);
    t.inherits(func, this.node);
    return func;
  };

  ClassTransformer.prototype.pushToMap = function pushToMap(node, enumerable) {
    /*istanbul ignore next*/var kind = arguments.length <= 2 || arguments[2] === undefined ? "value" : arguments[2];
    /*istanbul ignore next*/var scope = arguments[3];

    var mutatorMap = /*istanbul ignore next*/void 0;
    if (node.static) {
      this.hasStaticDescriptors = true;
      mutatorMap = this.staticMutatorMap;
    } else {
      this.hasInstanceDescriptors = true;
      mutatorMap = this.instanceMutatorMap;
    }

    var map = defineMap.push(mutatorMap, node, kind, this.file, scope);

    if (enumerable) {
      map.enumerable = t.booleanLiteral(true);
    }

    return map;
  };

  /**
   * [Please add a description.]
   * https://www.youtube.com/watch?v=fWNaR-rxAic
   */

  ClassTransformer.prototype.constructorMeMaybe = function constructorMeMaybe() {
    var hasConstructor = false;
    var paths = this.path.get("body.body");
    for ( /*istanbul ignore next*/var _iterator = paths, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

      var path = _ref;

      hasConstructor = path.equals("kind", "constructor");
      if (hasConstructor) break;
    }
    if (hasConstructor) return;

    var params = /*istanbul ignore next*/void 0,
        body = /*istanbul ignore next*/void 0;

    if (this.isDerived) {
      var _constructor = buildDerivedConstructor().expression;
      params = _constructor.params;
      body = _constructor.body;
    } else {
      params = [];
      body = t.blockStatement([]);
    }

    this.path.get("body").unshiftContainer("body", t.classMethod("constructor", t.identifier("constructor"), params, body));
  };

  ClassTransformer.prototype.buildBody = function buildBody() {
    this.constructorMeMaybe();
    this.pushBody();
    this.verifyConstructor();

    if (this.userConstructor) {
      var constructorBody = this.constructorBody;
      constructorBody.body = constructorBody.body.concat(this.userConstructor.body.body);
      t.inherits(this.constructor, this.userConstructor);
      t.inherits(constructorBody, this.userConstructor.body);
    }

    this.pushDescriptors();
  };

  ClassTransformer.prototype.pushBody = function pushBody() {
    var classBodyPaths = this.path.get("body.body");

    for ( /*istanbul ignore next*/var _iterator2 = classBodyPaths, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
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

      var path = _ref2;

      var node = path.node;

      if (path.isClassProperty()) {
        throw path.buildCodeFrameError("Missing class properties transform.");
      }

      if (node.decorators) {
        throw path.buildCodeFrameError("Method has decorators, put the decorator plugin before the classes one.");
      }

      if (t.isClassMethod(node)) {
        var isConstructor = node.kind === "constructor";

        if (isConstructor) {
          path.traverse(verifyConstructorVisitor, this);

          if (!this.hasBareSuper && this.isDerived) {
            throw path.buildCodeFrameError("missing super() call in constructor");
          }
        }

        var replaceSupers = new /*istanbul ignore next*/_babelHelperReplaceSupers2.default({
          forceSuperMemoisation: isConstructor,
          methodPath: path,
          methodNode: node,
          objectRef: this.classRef,
          superRef: this.superName,
          isStatic: node.static,
          isLoose: this.isLoose,
          scope: this.scope,
          file: this.file
        }, true);

        replaceSupers.replace();

        if (isConstructor) {
          this.pushConstructor(replaceSupers, node, path);
        } else {
          this.pushMethod(node, path);
        }
      }
    }
  };

  ClassTransformer.prototype.clearDescriptors = function clearDescriptors() {
    this.hasInstanceDescriptors = false;
    this.hasStaticDescriptors = false;

    this.instanceMutatorMap = {};
    this.staticMutatorMap = {};
  };

  ClassTransformer.prototype.pushDescriptors = function pushDescriptors() {
    this.pushInherits();

    var body = this.body;

    var instanceProps = /*istanbul ignore next*/void 0;
    var staticProps = /*istanbul ignore next*/void 0;

    if (this.hasInstanceDescriptors) {
      instanceProps = defineMap.toClassObject(this.instanceMutatorMap);
    }

    if (this.hasStaticDescriptors) {
      staticProps = defineMap.toClassObject(this.staticMutatorMap);
    }

    if (instanceProps || staticProps) {
      if (instanceProps) instanceProps = defineMap.toComputedObjectFromClass(instanceProps);
      if (staticProps) staticProps = defineMap.toComputedObjectFromClass(staticProps);

      var nullNode = t.nullLiteral();

      // (Constructor, instanceDescriptors, staticDescriptors, instanceInitializers, staticInitializers)
      var args = [this.classRef, nullNode, nullNode, nullNode, nullNode];

      if (instanceProps) args[1] = instanceProps;
      if (staticProps) args[2] = staticProps;

      if (this.instanceInitializersId) {
        args[3] = this.instanceInitializersId;
        body.unshift(this.buildObjectAssignment(this.instanceInitializersId));
      }

      if (this.staticInitializersId) {
        args[4] = this.staticInitializersId;
        body.unshift(this.buildObjectAssignment(this.staticInitializersId));
      }

      var lastNonNullIndex = 0;
      for (var i = 0; i < args.length; i++) {
        if (args[i] !== nullNode) lastNonNullIndex = i;
      }
      args = args.slice(0, lastNonNullIndex + 1);

      body.push(t.expressionStatement(t.callExpression(this.file.addHelper("createClass"), args)));
    }

    this.clearDescriptors();
  };

  ClassTransformer.prototype.buildObjectAssignment = function buildObjectAssignment(id) {
    return t.variableDeclaration("var", [t.variableDeclarator(id, t.objectExpression([]))]);
  };

  ClassTransformer.prototype.wrapSuperCall = function wrapSuperCall(bareSuper, superRef, thisRef, body) {
    var bareSuperNode = bareSuper.node;

    if (this.isLoose) {
      bareSuperNode.arguments.unshift(t.thisExpression());
      if (bareSuperNode.arguments.length === 2 && t.isSpreadElement(bareSuperNode.arguments[1]) && t.isIdentifier(bareSuperNode.arguments[1].argument, { name: "arguments" })) {
        // special case single arguments spread
        bareSuperNode.arguments[1] = bareSuperNode.arguments[1].argument;
        bareSuperNode.callee = t.memberExpression(superRef, t.identifier("apply"));
      } else {
        bareSuperNode.callee = t.memberExpression(superRef, t.identifier("call"));
      }
    } else {
      bareSuperNode = /*istanbul ignore next*/(0, _babelHelperOptimiseCallExpression2.default)(t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("getPrototypeOf")), [this.classRef]), t.thisExpression(), bareSuperNode.arguments);
    }

    var call = t.callExpression(this.file.addHelper("possibleConstructorReturn"), [t.thisExpression(), bareSuperNode]);

    var bareSuperAfter = this.bareSuperAfter.map(function (fn) /*istanbul ignore next*/{
      return fn(thisRef);
    });

    if (bareSuper.parentPath.isExpressionStatement() && bareSuper.parentPath.container === body.node.body && body.node.body.length - 1 === bareSuper.parentPath.key) {
      // this super call is the last statement in the body so we can just straight up
      // turn it into a return

      if (this.superThises.length || bareSuperAfter.length) {
        bareSuper.scope.push({ id: thisRef });
        call = t.assignmentExpression("=", thisRef, call);
      }

      if (bareSuperAfter.length) {
        call = t.toSequenceExpression( /*istanbul ignore next*/[call].concat(bareSuperAfter, [thisRef]));
      }

      bareSuper.parentPath.replaceWith(t.returnStatement(call));
    } else {
      bareSuper.replaceWithMultiple( /*istanbul ignore next*/[t.variableDeclaration("var", [t.variableDeclarator(thisRef, call)])].concat(bareSuperAfter, [t.expressionStatement(thisRef)]));
    }
  };

  ClassTransformer.prototype.verifyConstructor = function verifyConstructor() {
    /*istanbul ignore next*/
    var _this2 = this;

    if (!this.isDerived) return;

    var path = this.userConstructorPath;
    var body = path.get("body");

    path.traverse(findThisesVisitor, this);

    var guaranteedSuperBeforeFinish = !!this.bareSupers.length;

    var superRef = this.superName || t.identifier("Function");
    var thisRef = path.scope.generateUidIdentifier("this");

    for ( /*istanbul ignore next*/var _iterator3 = this.bareSupers, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
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

      var bareSuper = _ref3;

      this.wrapSuperCall(bareSuper, superRef, thisRef, body);

      if (guaranteedSuperBeforeFinish) {
        bareSuper.find(function (parentPath) {
          // hit top so short circuit
          if (parentPath === path) {
            return true;
          }

          if (parentPath.isLoop() || parentPath.isConditional()) {
            guaranteedSuperBeforeFinish = false;
            return true;
          }
        });
      }
    }

    for ( /*istanbul ignore next*/var _iterator4 = this.superThises, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator3.default)(_iterator4);;) {
      /*istanbul ignore next*/
      var _ref4;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref4 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref4 = _i4.value;
      }

      var thisPath = _ref4;

      thisPath.replaceWith(thisRef);
    }

    var wrapReturn = function wrapReturn(returnArg) /*istanbul ignore next*/{
      return t.callExpression( /*istanbul ignore next*/_this2.file.addHelper("possibleConstructorReturn"), [thisRef].concat(returnArg || []));
    };

    // if we have a return as the last node in the body then we've already caught that
    // return
    var bodyPaths = body.get("body");
    if (bodyPaths.length && !bodyPaths.pop().isReturnStatement()) {
      body.pushContainer("body", t.returnStatement(guaranteedSuperBeforeFinish ? thisRef : wrapReturn()));
    }

    for ( /*istanbul ignore next*/var _iterator5 = this.superReturns, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator3.default)(_iterator5);;) {
      /*istanbul ignore next*/
      var _ref5;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref5 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref5 = _i5.value;
      }

      var returnPath = _ref5;

      if (returnPath.node.argument) {
        var ref = returnPath.scope.generateDeclaredUidIdentifier("ret");
        returnPath.get("argument").replaceWithMultiple([t.assignmentExpression("=", ref, returnPath.node.argument), wrapReturn(ref)]);
      } else {
        returnPath.get("argument").replaceWith(wrapReturn());
      }
    }
  };

  /**
   * Push a method to its respective mutatorMap.
   */

  ClassTransformer.prototype.pushMethod = function pushMethod(node, path) {
    var scope = path ? path.scope : this.scope;

    if (node.kind === "method") {
      if (this._processMethod(node, scope)) return;
    }

    this.pushToMap(node, false, null, scope);
  };

  ClassTransformer.prototype._processMethod = function _processMethod() {
    return false;
  };

  /**
   * Replace the constructor body of our class.
   */

  ClassTransformer.prototype.pushConstructor = function pushConstructor(replaceSupers, method, path) {
    this.bareSupers = replaceSupers.bareSupers;
    this.superReturns = replaceSupers.returns;

    // https://github.com/babel/babel/issues/1077
    if (path.scope.hasOwnBinding(this.classRef.name)) {
      path.scope.rename(this.classRef.name);
    }

    var construct = this.constructor;

    this.userConstructorPath = path;
    this.userConstructor = method;
    this.hasConstructor = true;

    t.inheritsComments(construct, method);

    construct._ignoreUserWhitespace = true;
    construct.params = method.params;

    t.inherits(construct.body, method.body);
    construct.body.directives = method.body.directives;

    // push constructor to body
    this._pushConstructor();
  };

  ClassTransformer.prototype._pushConstructor = function _pushConstructor() {
    if (this.pushedConstructor) return;
    this.pushedConstructor = true;

    // we haven't pushed any descriptors yet
    if (this.hasInstanceDescriptors || this.hasStaticDescriptors) {
      this.pushDescriptors();
    }

    this.body.push(this.constructor);

    this.pushInherits();
  };

  /**
   * Push inherits helper to body.
   */

  ClassTransformer.prototype.pushInherits = function pushInherits() {
    if (!this.isDerived || this.pushedInherits) return;

    // Unshift to ensure that the constructor inheritance is set up before
    // any properties can be assigned to the prototype.
    this.pushedInherits = true;
    this.body.unshift(t.expressionStatement(t.callExpression(this.file.addHelper("inherits"), [this.classRef, this.superName])));
  };

  return ClassTransformer;
}();

/*istanbul ignore next*/exports.default = ClassTransformer;
/*istanbul ignore next*/module.exports = exports["default"];