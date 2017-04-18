/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var /*istanbul ignore next*/_babelTemplate = require("babel-template");

/*istanbul ignore next*/
var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {}; /* eslint max-len: 0 */

/*istanbul ignore next*/exports.default = helpers;


helpers.typeof = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\")\n    ? function (obj) { return typeof obj; }\n    : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n");

helpers.jsx = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function () {\n    var REACT_ELEMENT_TYPE = (typeof Symbol === \"function\" && Symbol.for && Symbol.for(\"react.element\")) || 0xeac7;\n\n    return function createRawReactElement (type, props, key, children) {\n      var defaultProps = type && type.defaultProps;\n      var childrenLength = arguments.length - 3;\n\n      if (!props && childrenLength !== 0) {\n        // If we're going to assign props.children, we create a new object now\n        // to avoid mutating defaultProps.\n        props = {};\n      }\n      if (props && defaultProps) {\n        for (var propName in defaultProps) {\n          if (props[propName] === void 0) {\n            props[propName] = defaultProps[propName];\n          }\n        }\n      } else if (!props) {\n        props = defaultProps || {};\n      }\n\n      if (childrenLength === 1) {\n        props.children = children;\n      } else if (childrenLength > 1) {\n        var childArray = Array(childrenLength);\n        for (var i = 0; i < childrenLength; i++) {\n          childArray[i] = arguments[i + 3];\n        }\n        props.children = childArray;\n      }\n\n      return {\n        $$typeof: REACT_ELEMENT_TYPE,\n        type: type,\n        key: key === undefined ? null : '' + key,\n        ref: null,\n        props: props,\n        _owner: null,\n      };\n    };\n\n  })()\n");

helpers.asyncToGenerator = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (fn) {\n    return function () {\n      var gen = fn.apply(this, arguments);\n      return new Promise(function (resolve, reject) {\n        function step(key, arg) {\n          try {\n            var info = gen[key](arg);\n            var value = info.value;\n          } catch (error) {\n            reject(error);\n            return;\n          }\n\n          if (info.done) {\n            resolve(value);\n          } else {\n            return Promise.resolve(value).then(function (value) {\n              return step(\"next\", value);\n            }, function (err) {\n              return step(\"throw\", err);\n            });\n          }\n        }\n\n        return step(\"next\");\n      });\n    };\n  })\n");

helpers.classCallCheck = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (instance, Constructor) {\n    if (!(instance instanceof Constructor)) {\n      throw new TypeError(\"Cannot call a class as a function\");\n    }\n  });\n");

helpers.createClass = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function() {\n    function defineProperties(target, props) {\n      for (var i = 0; i < props.length; i ++) {\n        var descriptor = props[i];\n        descriptor.enumerable = descriptor.enumerable || false;\n        descriptor.configurable = true;\n        if (\"value\" in descriptor) descriptor.writable = true;\n        Object.defineProperty(target, descriptor.key, descriptor);\n      }\n    }\n\n    return function (Constructor, protoProps, staticProps) {\n      if (protoProps) defineProperties(Constructor.prototype, protoProps);\n      if (staticProps) defineProperties(Constructor, staticProps);\n      return Constructor;\n    };\n  })()\n");

helpers.defineEnumerableProperties = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj, descs) {\n    for (var key in descs) {\n      var desc = descs[key];\n      desc.configurable = desc.enumerable = true;\n      if (\"value\" in desc) desc.writable = true;\n      Object.defineProperty(obj, key, desc);\n    }\n    return obj;\n  })\n");

helpers.defaults = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj, defaults) {\n    var keys = Object.getOwnPropertyNames(defaults);\n    for (var i = 0; i < keys.length; i++) {\n      var key = keys[i];\n      var value = Object.getOwnPropertyDescriptor(defaults, key);\n      if (value && value.configurable && obj[key] === undefined) {\n        Object.defineProperty(obj, key, value);\n      }\n    }\n    return obj;\n  })\n");

helpers.defineProperty = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj, key, value) {\n    // Shortcircuit the slow defineProperty path when possible.\n    // We are trying to avoid issues where setters defined on the\n    // prototype cause side effects under the fast path of simple\n    // assignment. By checking for existence of the property with\n    // the in operator, we can optimize most of this overhead away.\n    if (key in obj) {\n      Object.defineProperty(obj, key, {\n        value: value,\n        enumerable: true,\n        configurable: true,\n        writable: true\n      });\n    } else {\n      obj[key] = value;\n    }\n    return obj;\n  });\n");

helpers.extends = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  Object.assign || (function (target) {\n    for (var i = 1; i < arguments.length; i++) {\n      var source = arguments[i];\n      for (var key in source) {\n        if (Object.prototype.hasOwnProperty.call(source, key)) {\n          target[key] = source[key];\n        }\n      }\n    }\n    return target;\n  })\n");

helpers.get = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function get(object, property, receiver) {\n    if (object === null) object = Function.prototype;\n\n    var desc = Object.getOwnPropertyDescriptor(object, property);\n\n    if (desc === undefined) {\n      var parent = Object.getPrototypeOf(object);\n\n      if (parent === null) {\n        return undefined;\n      } else {\n        return get(parent, property, receiver);\n      }\n    } else if (\"value\" in desc) {\n      return desc.value;\n    } else {\n      var getter = desc.get;\n\n      if (getter === undefined) {\n        return undefined;\n      }\n\n      return getter.call(receiver);\n    }\n  });\n");

helpers.inherits = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (subClass, superClass) {\n    if (typeof superClass !== \"function\" && superClass !== null) {\n      throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass);\n    }\n    subClass.prototype = Object.create(superClass && superClass.prototype, {\n      constructor: {\n        value: subClass,\n        enumerable: false,\n        writable: true,\n        configurable: true\n      }\n    });\n    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;\n  })\n");

helpers.instanceof = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (left, right) {\n    if (right != null && typeof Symbol !== \"undefined\" && right[Symbol.hasInstance]) {\n      return right[Symbol.hasInstance](left);\n    } else {\n      return left instanceof right;\n    }\n  });\n");

helpers.interopRequireDefault = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj) {\n    return obj && obj.__esModule ? obj : { default: obj };\n  })\n");

helpers.interopRequireWildcard = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj) {\n    if (obj && obj.__esModule) {\n      return obj;\n    } else {\n      var newObj = {};\n      if (obj != null) {\n        for (var key in obj) {\n          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];\n        }\n      }\n      newObj.default = obj;\n      return newObj;\n    }\n  })\n");

helpers.newArrowCheck = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (innerThis, boundThis) {\n    if (innerThis !== boundThis) {\n      throw new TypeError(\"Cannot instantiate an arrow function\");\n    }\n  });\n");

helpers.objectDestructuringEmpty = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj) {\n    if (obj == null) throw new TypeError(\"Cannot destructure undefined\");\n  });\n");

helpers.objectWithoutProperties = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (obj, keys) {\n    var target = {};\n    for (var i in obj) {\n      if (keys.indexOf(i) >= 0) continue;\n      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;\n      target[i] = obj[i];\n    }\n    return target;\n  })\n");

helpers.possibleConstructorReturn = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (self, call) {\n    if (!self) {\n      throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n    }\n    return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self;\n  });\n");

helpers.selfGlobal = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  typeof global === \"undefined\" ? self : global\n");

helpers.set = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function set(object, property, value, receiver) {\n    var desc = Object.getOwnPropertyDescriptor(object, property);\n\n    if (desc === undefined) {\n      var parent = Object.getPrototypeOf(object);\n\n      if (parent !== null) {\n        set(parent, property, value, receiver);\n      }\n    } else if (\"value\" in desc && desc.writable) {\n      desc.value = value;\n    } else {\n      var setter = desc.set;\n\n      if (setter !== undefined) {\n        setter.call(receiver, value);\n      }\n    }\n\n    return value;\n  });\n");

helpers.slicedToArray = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function () {\n    // Broken out into a separate function to avoid deoptimizations due to the try/catch for the\n    // array iterator case.\n    function sliceIterator(arr, i) {\n      // this is an expanded form of `for...of` that properly supports abrupt completions of\n      // iterators etc. variable names have been minimised to reduce the size of this massive\n      // helper. sometimes spec compliancy is annoying :(\n      //\n      // _n = _iteratorNormalCompletion\n      // _d = _didIteratorError\n      // _e = _iteratorError\n      // _i = _iterator\n      // _s = _step\n\n      var _arr = [];\n      var _n = true;\n      var _d = false;\n      var _e = undefined;\n      try {\n        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {\n          _arr.push(_s.value);\n          if (i && _arr.length === i) break;\n        }\n      } catch (err) {\n        _d = true;\n        _e = err;\n      } finally {\n        try {\n          if (!_n && _i[\"return\"]) _i[\"return\"]();\n        } finally {\n          if (_d) throw _e;\n        }\n      }\n      return _arr;\n    }\n\n    return function (arr, i) {\n      if (Array.isArray(arr)) {\n        return arr;\n      } else if (Symbol.iterator in Object(arr)) {\n        return sliceIterator(arr, i);\n      } else {\n        throw new TypeError(\"Invalid attempt to destructure non-iterable instance\");\n      }\n    };\n  })();\n");

helpers.slicedToArrayLoose = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (arr, i) {\n    if (Array.isArray(arr)) {\n      return arr;\n    } else if (Symbol.iterator in Object(arr)) {\n      var _arr = [];\n      for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {\n        _arr.push(_step.value);\n        if (i && _arr.length === i) break;\n      }\n      return _arr;\n    } else {\n      throw new TypeError(\"Invalid attempt to destructure non-iterable instance\");\n    }\n  });\n");

helpers.taggedTemplateLiteral = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (strings, raw) {\n    return Object.freeze(Object.defineProperties(strings, {\n        raw: { value: Object.freeze(raw) }\n    }));\n  });\n");

helpers.taggedTemplateLiteralLoose = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (strings, raw) {\n    strings.raw = raw;\n    return strings;\n  });\n");

helpers.temporalRef = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (val, name, undef) {\n    if (val === undef) {\n      throw new ReferenceError(name + \" is not defined - temporal dead zone\");\n    } else {\n      return val;\n    }\n  })\n");

helpers.temporalUndefined = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  ({})\n");

helpers.toArray = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (arr) {\n    return Array.isArray(arr) ? arr : Array.from(arr);\n  });\n");

helpers.toConsumableArray = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (arr) {\n    if (Array.isArray(arr)) {\n      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];\n      return arr2;\n    } else {\n      return Array.from(arr);\n    }\n  });\n");
/*istanbul ignore next*/module.exports = exports["default"];