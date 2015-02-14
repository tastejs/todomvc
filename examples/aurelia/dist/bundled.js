"format register";

System.register("npm:process@0.10.0/browser", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  var process = module.exports = {};
  var queue = [];
  var draining = false;
  function drainQueue() {
    if (draining) {
      return ;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while (len) {
      currentQueue = queue;
      queue = [];
      var i = -1;
      while (++i < len) {
        currentQueue[i]();
      }
      len = queue.length;
    }
    draining = false;
  }
  process.nextTick = function(fun) {
    queue.push(fun);
    if (!draining) {
      setTimeout(drainQueue, 0);
    }
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = '';
  function noop() {}
  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;
  process.binding = function(name) {
    throw new Error('process.binding is not supported');
  };
  process.cwd = function() {
    return '/';
  };
  process.chdir = function(dir) {
    throw new Error('process.chdir is not supported');
  };
  process.umask = function() {
    return 0;
  };
  global.define = __define;
  return module.exports;
});

System.register("github:aurelia/metadata@0.3.1/system/origin", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      originStorage,
      Origin;
  function ensureType(value) {
    if (value instanceof Origin) {
      return value;
    }
    return new Origin(value);
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      originStorage = new Map();
      Origin = (function() {
        function Origin(moduleId, moduleMember) {
          this.moduleId = moduleId;
          this.moduleMember = moduleMember;
        }
        _prototypeProperties(Origin, {
          get: {
            value: function get(fn) {
              var origin = originStorage.get(fn);
              if (origin !== undefined) {
                return origin;
              }
              if (typeof fn.origin === "function") {
                originStorage.set(fn, origin = ensureType(fn.origin()));
              } else if (fn.origin !== undefined) {
                originStorage.set(fn, origin = ensureType(fn.origin));
              }
              return origin;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          set: {
            value: function set(fn, origin) {
              if (Origin.get(fn) === undefined) {
                originStorage.set(fn, origin);
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return Origin;
      })();
      _export("Origin", Origin);
    }
  };
});

System.register("github:aurelia/metadata@0.3.1/system/resource-type", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      ResourceType;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ResourceType = (function() {
        function ResourceType() {}
        _prototypeProperties(ResourceType, null, {
          load: {
            value: function load(container, target) {
              return this;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              throw new Error("All descendents of \"ResourceType\" must implement the \"register\" method.");
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return ResourceType;
      })();
      _export("ResourceType", ResourceType);
    }
  };
});

System.register("github:aurelia/metadata@0.3.1/system/metadata", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      functionMetadataStorage,
      emptyArray,
      locateFunctionMetadataElsewhere,
      MetadataStorage,
      Metadata;
  function normalize(metadata, fn, replace) {
    if (metadata instanceof MetadataStorage) {
      if (replace) {
        fn.metadata = function() {
          return metadata;
        };
      }
      metadata.owner = fn;
      return metadata;
    }
    if (Array.isArray(metadata)) {
      return new MetadataStorage(metadata, fn);
    }
    throw new Error("Incorrect metadata format for " + metadata + ".");
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      functionMetadataStorage = new Map();
      emptyArray = Object.freeze([]);
      MetadataStorage = (function() {
        function MetadataStorage(metadata, owner) {
          this.metadata = metadata;
          this.owner = owner;
        }
        _prototypeProperties(MetadataStorage, null, {
          first: {
            value: function first(type, searchPrototype) {
              var metadata = this.metadata,
                  i,
                  ii,
                  potential;
              if (metadata === undefined || metadata.length === 0) {
                if (searchPrototype && this.owner !== undefined) {
                  return Metadata.on(Object.getPrototypeOf(this.owner)).first(type, searchPrototype);
                }
                return null;
              }
              for (i = 0, ii = metadata.length; i < ii; ++i) {
                potential = metadata[i];
                if (potential instanceof type) {
                  return potential;
                }
              }
              if (searchPrototype && this.owner !== undefined) {
                return Metadata.on(Object.getPrototypeOf(this.owner)).first(type, searchPrototype);
              }
              return null;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          has: {
            value: function has(type, searchPrototype) {
              return this.first(type, searchPrototype) !== null;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          all: {
            value: function all(type, searchPrototype) {
              var metadata = this.metadata,
                  i,
                  ii,
                  found,
                  potential;
              if (metadata === undefined || metadata.length === 0) {
                if (searchPrototype && this.owner !== undefined) {
                  return Metadata.on(Object.getPrototypeOf(this.owner)).all(type, searchPrototype);
                }
                return emptyArray;
              }
              found = [];
              for (i = 0, ii = metadata.length; i < ii; ++i) {
                potential = metadata[i];
                if (potential instanceof type) {
                  found.push(potential);
                }
              }
              if (searchPrototype && this.owner !== undefined) {
                found = found.concat(Metadata.on(Object.getPrototypeOf(this.owner)).all(type, searchPrototype));
              }
              return found;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          add: {
            value: function add(instance) {
              if (this.metadata === undefined) {
                this.metadata = [];
              }
              this.last = instance;
              this.metadata.push(instance);
              return this;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          and: {
            value: function and(func) {
              func(this.last);
              return this;
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return MetadataStorage;
      })();
      MetadataStorage.empty = Object.freeze(new MetadataStorage());
      Metadata = _export("Metadata", {
        on: function on(owner) {
          var metadata;
          if (!owner) {
            return MetadataStorage.empty;
          }
          metadata = functionMetadataStorage.get(owner);
          if (metadata === undefined) {
            if ("metadata" in owner) {
              if (typeof owner.metadata === "function") {
                functionMetadataStorage.set(owner, metadata = normalize(owner.metadata(), owner, true));
              } else {
                functionMetadataStorage.set(owner, metadata = normalize(owner.metadata, owner));
              }
            } else if (locateFunctionMetadataElsewhere !== undefined) {
              metadata = locateFunctionMetadataElsewhere(owner);
              if (metadata === undefined) {
                functionMetadataStorage.set(owner, metadata = new MetadataStorage(undefined, owner));
              } else {
                functionMetadataStorage.set(owner, metadata = normalize(metadata, owner));
              }
            } else {
              functionMetadataStorage.set(owner, metadata = new MetadataStorage(undefined, owner));
            }
          }
          return metadata;
        },
        configure: {
          location: function location(staticPropertyName) {
            this.locator(function(fn) {
              return fn[staticPropertyName];
            });
          },
          locator: function locator(loc) {
            if (locateFunctionMetadataElsewhere === undefined) {
              locateFunctionMetadataElsewhere = loc;
              return ;
            }
            var original = locateFunctionMetadataElsewhere;
            locateFunctionMetadataElsewhere = function(fn) {
              return original(fn) || loc(fn);
            };
          },
          classHelper: function classHelper(name, fn) {
            MetadataStorage.prototype[name] = function() {
              var context = Object.create(fn.prototype);
              var metadata = fn.apply(context, arguments) || context;
              this.add(metadata);
              return this;
            };
            Metadata[name] = function() {
              var storage = new MetadataStorage([]);
              return storage[name].apply(storage, arguments);
            };
          },
          functionHelper: function functionHelper(name, fn) {
            MetadataStorage.prototype[name] = function() {
              fn.apply(this, arguments);
              return this;
            };
            Metadata[name] = function() {
              var storage = new MetadataStorage([]);
              return storage[name].apply(storage, arguments);
            };
          }
        }
      });
    }
  };
});

System.register("github:aurelia/loader@0.3.3/system/index", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      hasTemplateElement,
      Loader;
  function importElements(frag, link, callback) {
    document.head.appendChild(frag);
    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(callback);
    } else {
      link.addEventListener("load", callback);
    }
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      hasTemplateElement = "content" in document.createElement("template");
      Loader = (function() {
        function Loader() {}
        _prototypeProperties(Loader, {createDefaultLoader: {
            value: function createDefaultLoader() {
              throw new Error("No default loader module imported.");
            },
            writable: true,
            enumerable: true,
            configurable: true
          }}, {
          loadModule: {
            value: function loadModule(id) {
              throw new Error("Loaders must implement loadModule(id).");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          loadAllModules: {
            value: function loadAllModules(ids) {
              throw new Error("Loader must implement loadAllModules(ids).");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          loadTemplate: {
            value: function loadTemplate(url) {
              throw new Error("Loader must implement loadTemplate(url).");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          importDocument: {
            value: function importDocument(url) {
              return new Promise(function(resolve, reject) {
                var frag = document.createDocumentFragment();
                var link = document.createElement("link");
                link.rel = "import";
                link.href = url;
                frag.appendChild(link);
                importElements(frag, link, function() {
                  return resolve(link["import"]);
                });
              });
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          importTemplate: {
            value: function importTemplate(url) {
              var _this = this;
              return this.importDocument(url).then(function(doc) {
                return _this.findTemplate(doc, url);
              });
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          findTemplate: {
            value: function findTemplate(doc, url) {
              if (!hasTemplateElement) {
                HTMLTemplateElement.bootstrap(doc);
              }
              var template = doc.querySelector("template");
              if (!template) {
                throw new Error("There was no template element found in '" + url + "'.");
              }
              return template;
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return Loader;
      })();
      _export("Loader", Loader);
    }
  };
});

System.register("github:aurelia/path@0.4.3/system/index", [], function(_export) {
  "use strict";
  var r20,
      rbracket,
      class2type;
  _export("relativeToFile", relativeToFile);
  _export("join", join);
  _export("buildQueryString", buildQueryString);
  function trimDots(ary) {
    var i,
        part;
    for (i = 0; i < ary.length; ++i) {
      part = ary[i];
      if (part === ".") {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === "..") {
        if (i === 0 || i == 1 && ary[2] === ".." || ary[i - 1] === "..") {
          continue;
        } else if (i > 0) {
          ary.splice(i - 1, 2);
          i -= 2;
        }
      }
    }
  }
  function relativeToFile(name, file) {
    var lastIndex,
        normalizedBaseParts,
        fileParts = file && file.split("/");
    name = name.trim();
    name = name.split("/");
    if (name[0].charAt(0) === "." && fileParts) {
      normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
      name = normalizedBaseParts.concat(name);
    }
    trimDots(name);
    return name.join("/");
  }
  function join(path1, path2) {
    var url1,
        url2,
        url3,
        i,
        ii,
        urlPrefix;
    if (!path1) {
      return path2;
    }
    if (!path2) {
      return path1;
    }
    urlPrefix = path1.indexOf("/") === 0 ? "/" : "";
    url1 = path1.split("/");
    url2 = path2.split("/");
    url3 = [];
    for (i = 0, ii = url1.length; i < ii; ++i) {
      if (url1[i] == "..") {
        url3.pop();
      } else if (url1[i] == "." || url1[i] == "") {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }
    for (i = 0, ii = url2.length; i < ii; ++i) {
      if (url2[i] == "..") {
        url3.pop();
      } else if (url2[i] == "." || url2[i] == "") {
        continue;
      } else {
        url3.push(url2[i]);
      }
    }
    return urlPrefix + url3.join("/").replace(/\:\//g, "://");
    ;
  }
  function type(obj) {
    if (obj == null) {
      return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
  }
  function buildQueryString(a, traditional) {
    var prefix,
        s = [],
        add = function(key, value) {
          value = typeof value === "function" ? value() : value == null ? "" : value;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
    for (prefix in a) {
      _buildQueryString(prefix, a[prefix], traditional, add);
    }
    return s.join("&").replace(r20, "+");
  }
  function _buildQueryString(prefix, obj, traditional, add) {
    var name;
    if (Array.isArray(obj)) {
      obj.forEach(function(v, i) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          _buildQueryString(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
        }
      });
    } else if (!traditional && type(obj) === "object") {
      for (name in obj) {
        _buildQueryString(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  return {
    setters: [],
    execute: function() {
      r20 = /%20/g;
      rbracket = /\[\]$/;
      class2type = {};
      "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name, i) {
        class2type["[object " + name + "]"] = name.toLowerCase();
      });
    }
  };
});

System.register("github:aurelia/logging@0.2.2/system/index", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      levels,
      loggers,
      logLevel,
      appenders,
      slice,
      loggerConstructionKey,
      Logger;
  _export("getLogger", getLogger);
  _export("addAppender", addAppender);
  _export("setLevel", setLevel);
  function log(logger, level, args) {
    var i = appenders.length,
        current;
    args = slice.call(args);
    args.unshift(logger);
    while (i--) {
      current = appenders[i];
      current[level].apply(current, args);
    }
  }
  function debug() {
    if (logLevel < 4) {
      return ;
    }
    log(this, "debug", arguments);
  }
  function info() {
    if (logLevel < 3) {
      return ;
    }
    log(this, "info", arguments);
  }
  function warn() {
    if (logLevel < 2) {
      return ;
    }
    log(this, "warn", arguments);
  }
  function error() {
    if (logLevel < 1) {
      return ;
    }
    log(this, "error", arguments);
  }
  function connectLogger(logger) {
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
  }
  function createLogger(id) {
    var logger = new Logger(id, loggerConstructionKey);
    if (appenders.length) {
      connectLogger(logger);
    }
    return logger;
  }
  function getLogger(id) {
    return loggers[id] || (loggers[id] = createLogger(id));
  }
  function addAppender(appender) {
    appenders.push(appender);
    if (appenders.length === 1) {
      for (var key in loggers) {
        connectLogger(loggers[key]);
      }
    }
  }
  function setLevel(level) {
    logLevel = level;
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      levels = _export("levels", {
        none: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
      });
      loggers = {};
      logLevel = levels.none;
      appenders = [];
      slice = Array.prototype.slice;
      loggerConstructionKey = {};
      Logger = (function() {
        function Logger(id, key) {
          if (key !== loggerConstructionKey) {
            throw new Error("You cannot instantiate \"Logger\". Use the \"getLogger\" API instead.");
          }
          this.id = id;
        }
        _prototypeProperties(Logger, null, {
          debug: {
            value: function debug() {},
            writable: true,
            enumerable: true,
            configurable: true
          },
          info: {
            value: function info() {},
            writable: true,
            enumerable: true,
            configurable: true
          },
          warn: {
            value: function warn() {},
            writable: true,
            enumerable: true,
            configurable: true
          },
          error: {
            value: function error() {},
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return Logger;
      })();
      _export("Logger", Logger);
    }
  };
});

System.register("github:aurelia/dependency-injection@0.4.2/system/metadata", [], function(_export) {
  "use strict";
  var _inherits,
      _prototypeProperties,
      Registration,
      Transient,
      Singleton,
      Resolver,
      Lazy,
      All,
      Optional,
      Parent;
  return {
    setters: [],
    execute: function() {
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Registration = _export("Registration", (function() {
        function Registration() {}
        _prototypeProperties(Registration, null, {register: {
            value: function register(container, key, fn) {
              throw new Error("A custom Registration must implement register(container, key, fn).");
            },
            writable: true,
            configurable: true
          }});
        return Registration;
      })());
      Transient = _export("Transient", (function(Registration) {
        function Transient(key) {
          this.key = key;
        }
        _inherits(Transient, Registration);
        _prototypeProperties(Transient, null, {register: {
            value: function register(container, key, fn) {
              container.registerTransient(this.key || key, fn);
            },
            writable: true,
            configurable: true
          }});
        return Transient;
      })(Registration));
      Singleton = _export("Singleton", (function(Registration) {
        function Singleton(key) {
          this.key = key;
        }
        _inherits(Singleton, Registration);
        _prototypeProperties(Singleton, null, {register: {
            value: function register(container, key, fn) {
              container.registerSingleton(this.key || key, fn);
            },
            writable: true,
            configurable: true
          }});
        return Singleton;
      })(Registration));
      Resolver = _export("Resolver", (function() {
        function Resolver() {}
        _prototypeProperties(Resolver, null, {get: {
            value: function get(container) {
              throw new Error("A custom Resolver must implement get(container) and return the resolved instance(s).");
            },
            writable: true,
            configurable: true
          }});
        return Resolver;
      })());
      Lazy = _export("Lazy", (function(Resolver) {
        function Lazy(key) {
          this.key = key;
        }
        _inherits(Lazy, Resolver);
        _prototypeProperties(Lazy, {of: {
            value: function of(key) {
              return new Lazy(key);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              var _this = this;
              return function() {
                return container.get(_this.key);
              };
            },
            writable: true,
            configurable: true
          }});
        return Lazy;
      })(Resolver));
      All = _export("All", (function(Resolver) {
        function All(key) {
          this.key = key;
        }
        _inherits(All, Resolver);
        _prototypeProperties(All, {of: {
            value: function of(key) {
              return new All(key);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              return container.getAll(this.key);
            },
            writable: true,
            configurable: true
          }});
        return All;
      })(Resolver));
      Optional = _export("Optional", (function(Resolver) {
        function Optional(key) {
          var checkParent = arguments[1] === undefined ? false : arguments[1];
          this.key = key;
          this.checkParent = checkParent;
        }
        _inherits(Optional, Resolver);
        _prototypeProperties(Optional, {of: {
            value: function of(key) {
              var checkParent = arguments[1] === undefined ? false : arguments[1];
              return new Optional(key, checkParent);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              if (container.hasHandler(this.key, this.checkParent)) {
                return container.get(this.key);
              }
              return null;
            },
            writable: true,
            configurable: true
          }});
        return Optional;
      })(Resolver));
      Parent = _export("Parent", (function(Resolver) {
        function Parent(key) {
          this.key = key;
        }
        _inherits(Parent, Resolver);
        _prototypeProperties(Parent, {of: {
            value: function of(key) {
              return new Parent(key);
            },
            writable: true,
            configurable: true
          }}, {get: {
            value: function get(container) {
              return container.parent ? container.parent.get(this.key) : null;
            },
            writable: true,
            configurable: true
          }});
        return Parent;
      })(Resolver));
    }
  };
});

System.register("github:aurelia/dependency-injection@0.4.2/system/util", [], function(_export) {
  "use strict";
  _export("isClass", isClass);
  function test() {}
  function isUpperCase(char) {
    return char.toUpperCase() === char;
  }
  function isClass(clsOrFunction) {
    if (clsOrFunction.name) {
      return isUpperCase(clsOrFunction.name.charAt(0));
    }
    return Object.keys(clsOrFunction.prototype).length > 0;
  }
  return {
    setters: [],
    execute: function() {
      if (!test.name) {
        Object.defineProperty(Function.prototype, "name", {get: function() {
            var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
            Object.defineProperty(this, "name", {value: name});
            return name;
          }});
      }
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/util", [], function(_export) {
  "use strict";
  var capitalMatcher;
  _export("hyphenate", hyphenate);
  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }
  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
  return {
    setters: [],
    execute: function() {
      capitalMatcher = /([A-Z])/g;
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/value-converter", ["aurelia-metadata"], function(_export) {
  "use strict";
  var ResourceType,
      _prototypeProperties,
      _inherits,
      capitalMatcher,
      ValueConverter;
  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }
  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      capitalMatcher = /([A-Z])/g;
      ValueConverter = _export("ValueConverter", (function(ResourceType) {
        function ValueConverter(name) {
          this.name = name;
        }
        _inherits(ValueConverter, ResourceType);
        _prototypeProperties(ValueConverter, {convention: {
            value: function convention(name) {
              if (name.endsWith("ValueConverter")) {
                return new ValueConverter(hyphenate(name.substring(0, name.length - 14)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          load: {
            value: function load(container, target) {
              this.instance = container.get(target);
              return Promise.resolve(this);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerValueConverter(name || this.name, this.instance);
            },
            writable: true,
            configurable: true
          }
        });
        return ValueConverter;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/event-manager", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      DefaultEventStrategy,
      EventManager;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      DefaultEventStrategy = (function() {
        function DefaultEventStrategy() {
          this.delegatedEvents = {};
        }
        _prototypeProperties(DefaultEventStrategy, null, {
          ensureDelegatedEvent: {
            value: function ensureDelegatedEvent(eventName) {
              if (this.delegatedEvents[eventName]) {
                return ;
              }
              this.delegatedEvents[eventName] = true;
              document.addEventListener(eventName, this.handleDelegatedEvent.bind(this), false);
            },
            writable: true,
            configurable: true
          },
          handleCallbackResult: {
            value: function handleCallbackResult(result) {},
            writable: true,
            configurable: true
          },
          handleDelegatedEvent: {
            value: function handleDelegatedEvent(event) {
              event = event || window.event;
              var target = event.target || event.srcElement,
                  callback;
              while (target && !callback) {
                if (target.delegatedEvents) {
                  callback = target.delegatedEvents[event.type];
                }
                if (!callback) {
                  target = target.parentNode;
                }
              }
              if (callback) {
                this.handleCallbackResult(callback(event));
              }
            },
            writable: true,
            configurable: true
          },
          createDirectEventCallback: {
            value: function createDirectEventCallback(callback) {
              var _this = this;
              return function(event) {
                _this.handleCallbackResult(callback(event));
              };
            },
            writable: true,
            configurable: true
          },
          subscribeToDelegatedEvent: {
            value: function subscribeToDelegatedEvent(target, targetEvent, callback) {
              var lookup = target.delegatedEvents || (target.delegatedEvents = {});
              this.ensureDelegatedEvent(targetEvent);
              lookup[targetEvent] = callback;
              return function() {
                lookup[targetEvent] = null;
              };
            },
            writable: true,
            configurable: true
          },
          subscribeToDirectEvent: {
            value: function subscribeToDirectEvent(target, targetEvent, callback) {
              var directEventCallback = this.createDirectEventCallback(callback);
              target.addEventListener(targetEvent, directEventCallback, false);
              return function() {
                target.removeEventListener(targetEvent, directEventCallback);
              };
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(target, targetEvent, callback, delegate) {
              if (delegate) {
                return this.subscribeToDirectEvent(target, targetEvent, callback);
              } else {
                return this.subscribeToDelegatedEvent(target, targetEvent, callback);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return DefaultEventStrategy;
      })();
      EventManager = _export("EventManager", (function() {
        function EventManager() {
          this.elementHandlerLookup = {};
          this.eventStrategyLookup = {};
          this.registerElementConfig({
            tagName: "input",
            properties: {
              value: ["change", "input"],
              checked: ["change", "input"]
            }
          });
          this.registerElementConfig({
            tagName: "textarea",
            properties: {value: ["change", "input"]}
          });
          this.registerElementConfig({
            tagName: "select",
            properties: {value: ["change"]}
          });
          this.defaultEventStrategy = new DefaultEventStrategy();
        }
        _prototypeProperties(EventManager, null, {
          registerElementConfig: {
            value: function registerElementConfig(config) {
              this.elementHandlerLookup[config.tagName.toLowerCase()] = {subscribe: function subscribe(target, property, callback) {
                  var events = config.properties[property];
                  if (events) {
                    events.forEach(function(changeEvent) {
                      target.addEventListener(changeEvent, callback, false);
                    });
                    return function() {
                      events.forEach(function(changeEvent) {
                        target.removeEventListener(changeEvent, callback);
                      });
                    };
                  } else {
                    throw new Error("Cannot observe property " + property + " of " + config.tagName + ". No events found.");
                  }
                }};
            },
            writable: true,
            configurable: true
          },
          registerElementHandler: {
            value: function registerElementHandler(tagName, handler) {
              this.elementHandlerLookup[tagName.toLowerCase()] = handler;
            },
            writable: true,
            configurable: true
          },
          registerEventStrategy: {
            value: function registerEventStrategy(eventName, strategy) {
              this.eventStrategyLookup[eventName] = strategy;
            },
            writable: true,
            configurable: true
          },
          getElementHandler: {
            value: function getElementHandler(target) {
              if (target.tagName) {
                var handler = this.elementHandlerLookup[target.tagName.toLowerCase()];
                if (handler) {
                  return handler;
                }
              }
              return null;
            },
            writable: true,
            configurable: true
          },
          addEventListener: {
            value: function addEventListener(target, targetEvent, callback, delegate) {
              return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
            },
            writable: true,
            configurable: true
          }
        });
        return EventManager;
      })());
    }
  };
});

System.register("github:aurelia/task-queue@0.2.3/system/index", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      BrowserMutationObserver,
      hasSetImmediate,
      TaskQueue;
  function makeRequestFlushFromMutationObserver(flush) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestFlush() {
      toggle = -toggle;
      node.data = toggle;
    };
  }
  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      var timeoutHandle = setTimeout(handleFlushTimer, 0);
      var intervalHandle = setInterval(handleFlushTimer, 50);
      function handleFlushTimer() {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      }
    };
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      hasSetImmediate = typeof setImmediate === "function";
      TaskQueue = _export("TaskQueue", (function() {
        function TaskQueue() {
          var _this = this;
          this.microTaskQueue = [];
          this.microTaskQueueCapacity = 1024;
          this.taskQueue = [];
          if (typeof BrowserMutationObserver === "function") {
            this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function() {
              return _this.flushMicroTaskQueue();
            });
          } else {
            this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function() {
              return _this.flushMicroTaskQueue();
            });
          }
          this.requestFlushTaskQueue = makeRequestFlushFromTimer(function() {
            return _this.flushTaskQueue();
          });
        }
        _prototypeProperties(TaskQueue, null, {
          queueMicroTask: {
            value: function queueMicroTask(task) {
              if (this.microTaskQueue.length < 1) {
                this.requestFlushMicroTaskQueue();
              }
              this.microTaskQueue.push(task);
            },
            writable: true,
            configurable: true
          },
          queueTask: {
            value: function queueTask(task) {
              if (this.taskQueue.length < 1) {
                this.requestFlushTaskQueue();
              }
              this.taskQueue.push(task);
            },
            writable: true,
            configurable: true
          },
          flushTaskQueue: {
            value: function flushTaskQueue() {
              var queue = this.taskQueue,
                  index = 0,
                  task;
              this.taskQueue = [];
              while (index < queue.length) {
                task = queue[index];
                try {
                  task.call();
                } catch (error) {
                  this.onError(error, task);
                }
                index++;
              }
            },
            writable: true,
            configurable: true
          },
          flushMicroTaskQueue: {
            value: function flushMicroTaskQueue() {
              var queue = this.microTaskQueue,
                  capacity = this.microTaskQueueCapacity,
                  index = 0,
                  task;
              while (index < queue.length) {
                task = queue[index];
                try {
                  task.call();
                } catch (error) {
                  this.onError(error, task);
                }
                index++;
                if (index > capacity) {
                  for (var scan = 0; scan < index; scan++) {
                    queue[scan] = queue[scan + index];
                  }
                  queue.length -= index;
                  index = 0;
                }
              }
              queue.length = 0;
            },
            writable: true,
            configurable: true
          },
          onError: {
            value: function onError(error, task) {
              if ("onError" in task) {
                task.onError(error);
              } else if (hasSetImmediate) {
                setImmediate(function() {
                  throw error;
                });
              } else {
                setTimeout(function() {
                  throw error;
                }, 0);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return TaskQueue;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/array-change-records", [], function(_export) {
  "use strict";
  var EDIT_LEAVE,
      EDIT_UPDATE,
      EDIT_ADD,
      EDIT_DELETE,
      arraySplice;
  _export("calcSplices", calcSplices);
  _export("projectArraySplices", projectArraySplices);
  function isIndex(s) {
    return +s === s >>> 0;
  }
  function toNumber(s) {
    return +s;
  }
  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }
  function ArraySplice() {}
  function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
  }
  function intersect(start1, end1, start2, end2) {
    if (end1 < start2 || end2 < start1)
      return -1;
    if (end1 == start2 || end2 == start1)
      return 0;
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2;
      else
        return end2 - start2;
    } else {
      if (end2 < end1)
        return end2 - start1;
      else
        return end1 - start1;
    }
  }
  function mergeSplice(splices, index, removed, addedCount) {
    var splice = newSplice(index, removed, addedCount);
    var inserted = false;
    var insertionOffset = 0;
    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;
      if (inserted)
        continue;
      var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
      if (intersectCount >= 0) {
        splices.splice(i, 1);
        i--;
        insertionOffset -= current.addedCount - current.removed.length;
        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length + current.removed.length - intersectCount;
        if (!splice.addedCount && !deleteCount) {
          inserted = true;
        } else {
          var removed = current.removed;
          if (splice.index < current.index) {
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }
          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }
          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        inserted = true;
        splices.splice(i, 0, splice);
        i++;
        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }
    if (!inserted)
      splices.push(splice);
  }
  function createInitialSplices(array, changeRecords) {
    var splices = [];
    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch (record.type) {
        case "splice":
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case "add":
        case "update":
        case "delete":
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error("Unexpected record type: " + JSON.stringify(record));
          break;
      }
    }
    return splices;
  }
  function projectArraySplices(array, changeRecords) {
    var splices = [];
    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);
        return ;
      }
      ;
      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    });
    return splices;
  }
  return {
    setters: [],
    execute: function() {
      EDIT_LEAVE = 0;
      EDIT_UPDATE = 1;
      EDIT_ADD = 2;
      EDIT_DELETE = 3;
      ArraySplice.prototype = {
        calcEditDistances: function(current, currentStart, currentEnd, old, oldStart, oldEnd) {
          var rowCount = oldEnd - oldStart + 1;
          var columnCount = currentEnd - currentStart + 1;
          var distances = new Array(rowCount);
          var i,
              j,
              north,
              west;
          for (i = 0; i < rowCount; ++i) {
            distances[i] = new Array(columnCount);
            distances[i][0] = i;
          }
          for (j = 0; j < columnCount; ++j) {
            distances[0][j] = j;
          }
          for (i = 1; i < rowCount; ++i) {
            for (j = 1; j < columnCount; ++j) {
              if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
                distances[i][j] = distances[i - 1][j - 1];
              else {
                north = distances[i - 1][j] + 1;
                west = distances[i][j - 1] + 1;
                distances[i][j] = north < west ? north : west;
              }
            }
          }
          return distances;
        },
        spliceOperationsFromEditDistances: function(distances) {
          var i = distances.length - 1;
          var j = distances[0].length - 1;
          var current = distances[i][j];
          var edits = [];
          while (i > 0 || j > 0) {
            if (i == 0) {
              edits.push(EDIT_ADD);
              j--;
              continue;
            }
            if (j == 0) {
              edits.push(EDIT_DELETE);
              i--;
              continue;
            }
            var northWest = distances[i - 1][j - 1];
            var west = distances[i - 1][j];
            var north = distances[i][j - 1];
            var min;
            if (west < north)
              min = west < northWest ? west : northWest;
            else
              min = north < northWest ? north : northWest;
            if (min == northWest) {
              if (northWest == current) {
                edits.push(EDIT_LEAVE);
              } else {
                edits.push(EDIT_UPDATE);
                current = northWest;
              }
              i--;
              j--;
            } else if (min == west) {
              edits.push(EDIT_DELETE);
              i--;
              current = west;
            } else {
              edits.push(EDIT_ADD);
              j--;
              current = north;
            }
          }
          edits.reverse();
          return edits;
        },
        calcSplices: function(current, currentStart, currentEnd, old, oldStart, oldEnd) {
          var prefixCount = 0;
          var suffixCount = 0;
          var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
          if (currentStart == 0 && oldStart == 0)
            prefixCount = this.sharedPrefix(current, old, minLength);
          if (currentEnd == current.length && oldEnd == old.length)
            suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
          currentStart += prefixCount;
          oldStart += prefixCount;
          currentEnd -= suffixCount;
          oldEnd -= suffixCount;
          if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
            return [];
          if (currentStart == currentEnd) {
            var splice = newSplice(currentStart, [], 0);
            while (oldStart < oldEnd)
              splice.removed.push(old[oldStart++]);
            return [splice];
          } else if (oldStart == oldEnd)
            return [newSplice(currentStart, [], currentEnd - currentStart)];
          var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
          var splice = undefined;
          var splices = [];
          var index = currentStart;
          var oldIndex = oldStart;
          for (var i = 0; i < ops.length; ++i) {
            switch (ops[i]) {
              case EDIT_LEAVE:
                if (splice) {
                  splices.push(splice);
                  splice = undefined;
                }
                index++;
                oldIndex++;
                break;
              case EDIT_UPDATE:
                if (!splice)
                  splice = newSplice(index, [], 0);
                splice.addedCount++;
                index++;
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
              case EDIT_ADD:
                if (!splice)
                  splice = newSplice(index, [], 0);
                splice.addedCount++;
                index++;
                break;
              case EDIT_DELETE:
                if (!splice)
                  splice = newSplice(index, [], 0);
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            }
          }
          if (splice) {
            splices.push(splice);
          }
          return splices;
        },
        sharedPrefix: function(current, old, searchLength) {
          for (var i = 0; i < searchLength; ++i)
            if (!this.equals(current[i], old[i]))
              return i;
          return searchLength;
        },
        sharedSuffix: function(current, old, searchLength) {
          var index1 = current.length;
          var index2 = old.length;
          var count = 0;
          while (count < searchLength && this.equals(current[--index1], old[--index2]))
            count++;
          return count;
        },
        calculateSplices: function(current, previous) {
          return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
        },
        equals: function(currentValue, previousValue) {
          return currentValue === previousValue;
        }
      };
      arraySplice = new ArraySplice();
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/dirty-checking", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      DirtyChecker,
      DirtyCheckProperty;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      DirtyChecker = _export("DirtyChecker", (function() {
        function DirtyChecker() {
          this.tracked = [];
          this.checkDelay = 120;
        }
        _prototypeProperties(DirtyChecker, null, {
          addProperty: {
            value: function addProperty(property) {
              var tracked = this.tracked;
              tracked.push(property);
              if (tracked.length === 1) {
                this.scheduleDirtyCheck();
              }
            },
            writable: true,
            configurable: true
          },
          removeProperty: {
            value: function removeProperty(property) {
              var tracked = this.tracked;
              tracked.splice(tracked.indexOf(property), 1);
            },
            writable: true,
            configurable: true
          },
          scheduleDirtyCheck: {
            value: function scheduleDirtyCheck() {
              var _this = this;
              setTimeout(function() {
                return _this.check();
              }, this.checkDelay);
            },
            writable: true,
            configurable: true
          },
          check: {
            value: function check() {
              var tracked = this.tracked,
                  i = tracked.length;
              while (i--) {
                var current = tracked[i];
                if (current.isDirty()) {
                  current.call();
                }
              }
              if (tracked.length) {
                this.scheduleDirtyCheck();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return DirtyChecker;
      })());
      DirtyCheckProperty = _export("DirtyCheckProperty", (function() {
        function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
          this.dirtyChecker = dirtyChecker;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.isSVG = obj instanceof SVGElement;
        }
        _prototypeProperties(DirtyCheckProperty, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              if (this.isSVG) {
                this.obj.setAttributeNS(null, this.propertyName, newValue);
              } else {
                this.obj[this.propertyName] = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.getValue();
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
              this.oldValue = newValue;
            },
            writable: true,
            configurable: true
          },
          isDirty: {
            value: function isDirty() {
              return this.oldValue !== this.getValue();
            },
            writable: true,
            configurable: true
          },
          beginTracking: {
            value: function beginTracking() {
              this.tracking = true;
              this.oldValue = this.newValue = this.getValue();
              this.dirtyChecker.addProperty(this);
            },
            writable: true,
            configurable: true
          },
          endTracking: {
            value: function endTracking() {
              this.tracking = false;
              this.dirtyChecker.removeProperty(this);
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks,
                  that = this;
              callbacks.push(callback);
              if (!this.tracking) {
                this.beginTracking();
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
                if (callbacks.length === 0) {
                  that.endTracking();
                }
              };
            },
            writable: true,
            configurable: true
          }
        });
        return DirtyCheckProperty;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/property-observation", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      SetterObserver,
      OoObjectObserver,
      OoPropertyObserver,
      ElementObserver;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      SetterObserver = _export("SetterObserver", (function() {
        function SetterObserver(taskQueue, obj, propertyName) {
          this.taskQueue = taskQueue;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.queued = false;
          this.observing = false;
          this.isSVG = obj instanceof SVGElement;
        }
        _prototypeProperties(SetterObserver, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              if (this.isSVG) {
                this.obj.setAttributeNS(null, this.propertyName, newValue);
              } else {
                this.obj[this.propertyName] = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          getterValue: {
            value: function getterValue() {
              return this.currentValue;
            },
            writable: true,
            configurable: true
          },
          setterValue: {
            value: function setterValue(newValue) {
              var oldValue = this.currentValue;
              if (oldValue != newValue) {
                if (!this.queued) {
                  this.oldValue = oldValue;
                  this.queued = true;
                  this.taskQueue.queueMicroTask(this);
                }
                this.currentValue = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.currentValue;
              this.queued = false;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              if (!this.observing) {
                this.convertProperty();
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          convertProperty: {
            value: function convertProperty() {
              this.observing = true;
              this.currentValue = this.obj[this.propertyName];
              this.setValue = this.setterValue;
              this.getValue = this.getterValue;
              try {
                Object.defineProperty(this.obj, this.propertyName, {
                  configurable: true,
                  enumerable: true,
                  get: this.getValue.bind(this),
                  set: this.setValue.bind(this)
                });
              } catch (_) {}
            },
            writable: true,
            configurable: true
          }
        });
        return SetterObserver;
      })());
      OoObjectObserver = _export("OoObjectObserver", (function() {
        function OoObjectObserver(obj) {
          this.obj = obj;
          this.observers = {};
        }
        _prototypeProperties(OoObjectObserver, null, {
          subscribe: {
            value: function subscribe(propertyObserver, callback) {
              var _this = this;
              var callbacks = propertyObserver.callbacks;
              callbacks.push(callback);
              if (!this.observing) {
                this.observing = true;
                try {
                  Object.observe(this.obj, function(changes) {
                    return _this.handleChanges(changes);
                  }, ["update", "add"]);
                } catch (_) {}
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName) {
              var propertyObserver = this.observers[propertyName] || (this.observers[propertyName] = new OoPropertyObserver(this, this.obj, propertyName));
              return propertyObserver;
            },
            writable: true,
            configurable: true
          },
          handleChanges: {
            value: function handleChanges(changeRecords) {
              var updates = {},
                  observers = this.observers,
                  i = changeRecords.length;
              while (i--) {
                var change = changeRecords[i],
                    name = change.name;
                if (!(name in updates)) {
                  var observer = observers[name];
                  updates[name] = true;
                  if (observer) {
                    observer.trigger(change.object[name], change.oldValue);
                  }
                }
              }
            },
            writable: true,
            configurable: true
          }
        });
        return OoObjectObserver;
      })());
      OoPropertyObserver = _export("OoPropertyObserver", (function() {
        function OoPropertyObserver(owner, obj, propertyName) {
          this.owner = owner;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.isSVG = obj instanceof SVGElement;
        }
        _prototypeProperties(OoPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              if (this.isSVG) {
                this.obj.setAttributeNS(null, this.propertyName, newValue);
              } else {
                this.obj[this.propertyName] = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          trigger: {
            value: function trigger(newValue, oldValue) {
              var callbacks = this.callbacks,
                  i = callbacks.length;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              return this.owner.subscribe(this, callback);
            },
            writable: true,
            configurable: true
          }
        });
        return OoPropertyObserver;
      })());
      ElementObserver = _export("ElementObserver", (function() {
        function ElementObserver(handler, element, propertyName) {
          this.element = element;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.oldValue = element[propertyName];
          this.handler = handler;
        }
        _prototypeProperties(ElementObserver, null, {
          getValue: {
            value: function getValue() {
              return this.element[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              this.element[this.propertyName] = newValue;
              this.call();
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.getValue();
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
              this.oldValue = newValue;
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var that = this;
              if (!this.disposeHandler) {
                this.disposeHandler = this.handler.subscribe(this.element, this.propertyName, this.call.bind(this));
              }
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
                if (callback.length === 0) {
                  that.disposeHandler();
                  that.disposeHandler = null;
                }
              };
            },
            writable: true,
            configurable: true
          }
        });
        return ElementObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/binding-modes", [], function(_export) {
  "use strict";
  var ONE_WAY,
      TWO_WAY,
      ONE_TIME;
  return {
    setters: [],
    execute: function() {
      ONE_WAY = _export("ONE_WAY", 1);
      TWO_WAY = _export("TWO_WAY", 2);
      ONE_TIME = _export("ONE_TIME", 3);
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/lexer", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      Token,
      Lexer,
      Scanner,
      OPERATORS,
      $EOF,
      $TAB,
      $LF,
      $VTAB,
      $FF,
      $CR,
      $SPACE,
      $BANG,
      $DQ,
      $$,
      $PERCENT,
      $AMPERSAND,
      $SQ,
      $LPAREN,
      $RPAREN,
      $STAR,
      $PLUS,
      $COMMA,
      $MINUS,
      $PERIOD,
      $SLASH,
      $COLON,
      $SEMICOLON,
      $LT,
      $EQ,
      $GT,
      $QUESTION,
      $0,
      $9,
      $A,
      $E,
      $Z,
      $LBRACKET,
      $BACKSLASH,
      $RBRACKET,
      $CARET,
      $_,
      $a,
      $e,
      $f,
      $n,
      $r,
      $t,
      $u,
      $v,
      $z,
      $LBRACE,
      $BAR,
      $RBRACE,
      $NBSP;
  function isWhitespace(code) {
    return code >= $TAB && code <= $SPACE || code === $NBSP;
  }
  function isIdentifierStart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || code === $_ || code === $$;
  }
  function isIdentifierPart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || $0 <= code && code <= $9 || code === $_ || code === $$;
  }
  function isDigit(code) {
    return $0 <= code && code <= $9;
  }
  function isExponentStart(code) {
    return code === $e || code === $E;
  }
  function isExponentSign(code) {
    return code === $MINUS || code === $PLUS;
  }
  function unescape(code) {
    switch (code) {
      case $n:
        return $LF;
      case $f:
        return $FF;
      case $r:
        return $CR;
      case $t:
        return $TAB;
      case $v:
        return $VTAB;
      default:
        return code;
    }
  }
  function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Token = _export("Token", (function() {
        function Token(index, text) {
          this.index = index;
          this.text = text;
        }
        _prototypeProperties(Token, null, {
          withOp: {
            value: function withOp(op) {
              this.opKey = op;
              return this;
            },
            writable: true,
            configurable: true
          },
          withGetterSetter: {
            value: function withGetterSetter(key) {
              this.key = key;
              return this;
            },
            writable: true,
            configurable: true
          },
          withValue: {
            value: function withValue(value) {
              this.value = value;
              return this;
            },
            writable: true,
            configurable: true
          },
          toString: {
            value: function toString() {
              return "Token(" + this.text + ")";
            },
            writable: true,
            configurable: true
          }
        });
        return Token;
      })());
      Lexer = _export("Lexer", (function() {
        function Lexer() {}
        _prototypeProperties(Lexer, null, {lex: {
            value: function lex(text) {
              var scanner = new Scanner(text);
              var tokens = [];
              var token = scanner.scanToken();
              while (token) {
                tokens.push(token);
                token = scanner.scanToken();
              }
              return tokens;
            },
            writable: true,
            configurable: true
          }});
        return Lexer;
      })());
      Scanner = _export("Scanner", (function() {
        function Scanner(input) {
          this.input = input;
          this.length = input.length;
          this.peek = 0;
          this.index = -1;
          this.advance();
        }
        _prototypeProperties(Scanner, null, {
          scanToken: {
            value: function scanToken() {
              while (this.peek <= $SPACE) {
                if (++this.index >= this.length) {
                  this.peek = $EOF;
                  return null;
                } else {
                  this.peek = this.input.charCodeAt(this.index);
                }
              }
              if (isIdentifierStart(this.peek)) {
                return this.scanIdentifier();
              }
              if (isDigit(this.peek)) {
                return this.scanNumber(this.index);
              }
              var start = this.index;
              switch (this.peek) {
                case $PERIOD:
                  this.advance();
                  return isDigit(this.peek) ? this.scanNumber(start) : new Token(start, ".");
                case $LPAREN:
                case $RPAREN:
                case $LBRACE:
                case $RBRACE:
                case $LBRACKET:
                case $RBRACKET:
                case $COMMA:
                case $COLON:
                case $SEMICOLON:
                  return this.scanCharacter(start, String.fromCharCode(this.peek));
                case $SQ:
                case $DQ:
                  return this.scanString();
                case $PLUS:
                case $MINUS:
                case $STAR:
                case $SLASH:
                case $PERCENT:
                case $CARET:
                case $QUESTION:
                  return this.scanOperator(start, String.fromCharCode(this.peek));
                case $LT:
                case $GT:
                case $BANG:
                case $EQ:
                  return this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), "=");
                case $AMPERSAND:
                  return this.scanComplexOperator(start, $AMPERSAND, "&", "&");
                case $BAR:
                  return this.scanComplexOperator(start, $BAR, "|", "|");
                case $NBSP:
                  while (isWhitespace(this.peek)) {
                    this.advance();
                  }
                  return this.scanToken();
              }
              var character = String.fromCharCode(this.peek);
              this.error("Unexpected character [" + character + "]");
              return null;
            },
            writable: true,
            configurable: true
          },
          scanCharacter: {
            value: function scanCharacter(start, text) {
              assert(this.peek === text.charCodeAt(0));
              this.advance();
              return new Token(start, text);
            },
            writable: true,
            configurable: true
          },
          scanOperator: {
            value: function scanOperator(start, text) {
              assert(this.peek === text.charCodeAt(0));
              assert(OPERATORS.indexOf(text) !== -1);
              this.advance();
              return new Token(start, text).withOp(text);
            },
            writable: true,
            configurable: true
          },
          scanComplexOperator: {
            value: function scanComplexOperator(start, code, one, two) {
              assert(this.peek === one.charCodeAt(0));
              this.advance();
              var text = one;
              if (this.peek === code) {
                this.advance();
                text += two;
              }
              if (this.peek === code) {
                this.advance();
                text += two;
              }
              assert(OPERATORS.indexOf(text) != -1);
              return new Token(start, text).withOp(text);
            },
            writable: true,
            configurable: true
          },
          scanIdentifier: {
            value: function scanIdentifier() {
              assert(isIdentifierStart(this.peek));
              var start = this.index;
              this.advance();
              while (isIdentifierPart(this.peek)) {
                this.advance();
              }
              var text = this.input.substring(start, this.index);
              var result = new Token(start, text);
              if (OPERATORS.indexOf(text) !== -1) {
                result.withOp(text);
              } else {
                result.withGetterSetter(text);
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          scanNumber: {
            value: function scanNumber(start) {
              assert(isDigit(this.peek));
              var simple = this.index === start;
              this.advance();
              while (true) {
                if (isDigit(this.peek)) {} else if (this.peek === $PERIOD) {
                  simple = false;
                } else if (isExponentStart(this.peek)) {
                  this.advance();
                  if (isExponentSign(this.peek)) {
                    this.advance();
                  }
                  if (!isDigit(this.peek)) {
                    this.error("Invalid exponent", -1);
                  }
                  simple = false;
                } else {
                  break;
                }
                this.advance();
              }
              var text = this.input.substring(start, this.index);
              var value = simple ? parseInt(text) : parseFloat(text);
              return new Token(start, text).withValue(value);
            },
            writable: true,
            configurable: true
          },
          scanString: {
            value: function scanString() {
              assert(this.peek === $SQ || this.peek === $DQ);
              var start = this.index;
              var quote = this.peek;
              this.advance();
              var buffer;
              var marker = this.index;
              while (this.peek !== quote) {
                if (this.peek === $BACKSLASH) {
                  if (buffer === null) {
                    buffer = [];
                  }
                  buffer.push(this.input.substring(marker, this.index));
                  this.advance();
                  var unescaped;
                  if (this.peek === $u) {
                    var hex = this.input.substring(this.index + 1, this.index + 5);
                    if (!/[A-Z0-9]{4}/.test(hex)) {
                      this.error("Invalid unicode escape [\\u" + hex + "]");
                    }
                    unescaped = parseInt(hex, 16);
                    for (var i = 0; i < 5; ++i) {
                      this.advance();
                    }
                  } else {
                    unescaped = decodeURIComponent(this.peek);
                    this.advance();
                  }
                  buffer.push(String.fromCharCode(unescaped));
                  marker = this.index;
                } else if (this.peek === $EOF) {
                  this.error("Unterminated quote");
                } else {
                  this.advance();
                }
              }
              var last = this.input.substring(marker, this.index);
              this.advance();
              var text = this.input.substring(start, this.index);
              var unescaped = last;
              if (buffer != null) {
                buffer.push(last);
                unescaped = buffer.join("");
              }
              return new Token(start, text).withValue(unescaped);
            },
            writable: true,
            configurable: true
          },
          advance: {
            value: function advance() {
              if (++this.index >= this.length) {
                this.peek = $EOF;
              } else {
                this.peek = this.input.charCodeAt(this.index);
              }
            },
            writable: true,
            configurable: true
          },
          error: {
            value: function error(message) {
              var offset = arguments[1] === undefined ? 0 : arguments[1];
              var position = this.index + offset;
              throw new Error("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
            },
            writable: true,
            configurable: true
          }
        });
        return Scanner;
      })());
      OPERATORS = ["undefined", "null", "true", "false", "+", "-", "*", "/", "%", "^", "=", "==", "===", "!=", "!==", "<", ">", "<=", ">=", "&&", "||", "&", "|", "!", "?"];
      $EOF = 0;
      $TAB = 9;
      $LF = 10;
      $VTAB = 11;
      $FF = 12;
      $CR = 13;
      $SPACE = 32;
      $BANG = 33;
      $DQ = 34;
      $$ = 36;
      $PERCENT = 37;
      $AMPERSAND = 38;
      $SQ = 39;
      $LPAREN = 40;
      $RPAREN = 41;
      $STAR = 42;
      $PLUS = 43;
      $COMMA = 44;
      $MINUS = 45;
      $PERIOD = 46;
      $SLASH = 47;
      $COLON = 58;
      $SEMICOLON = 59;
      $LT = 60;
      $EQ = 61;
      $GT = 62;
      $QUESTION = 63;
      $0 = 48;
      $9 = 57;
      $A = 65;
      $E = 69;
      $Z = 90;
      $LBRACKET = 91;
      $BACKSLASH = 92;
      $RBRACKET = 93;
      $CARET = 94;
      $_ = 95;
      $a = 97;
      $e = 101;
      $f = 102;
      $n = 110;
      $r = 114;
      $t = 116;
      $u = 117;
      $v = 118;
      $z = 122;
      $LBRACE = 123;
      $BAR = 124;
      $RBRACE = 125;
      $NBSP = 160;
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/path-observer", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      PathObserver;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      PathObserver = _export("PathObserver", (function() {
        function PathObserver(leftObserver, getRightObserver, value) {
          var _this = this;
          this.leftObserver = leftObserver;
          this.disposeLeft = leftObserver.subscribe(function(newValue) {
            var newRightValue = _this.updateRight(getRightObserver(newValue));
            _this.notify(newRightValue);
          });
          this.updateRight(getRightObserver(value));
        }
        _prototypeProperties(PathObserver, null, {
          updateRight: {
            value: function updateRight(observer) {
              var _this = this;
              this.rightObserver = observer;
              if (this.disposeRight) {
                this.disposeRight();
              }
              if (!observer) {
                return null;
              }
              this.disposeRight = observer.subscribe(function(newValue) {
                return _this.notify(newValue);
              });
              return observer.getValue();
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var that = this;
              that.callback = callback;
              return function() {
                that.callback = null;
              };
            },
            writable: true,
            configurable: true
          },
          notify: {
            value: function notify(newValue) {
              var callback = this.callback;
              if (callback) {
                callback(newValue);
              }
            },
            writable: true,
            configurable: true
          },
          dispose: {
            value: function dispose() {
              if (this.disposeLeft) {
                this.disposeLeft();
              }
              if (this.disposeRight) {
                this.disposeRight();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return PathObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/composite-observer", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      CompositeObserver;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      CompositeObserver = _export("CompositeObserver", (function() {
        function CompositeObserver(observers, evaluate) {
          var _this = this;
          this.subscriptions = new Array(observers.length);
          this.evaluate = evaluate;
          for (var i = 0,
              ii = observers.length; i < ii; i++) {
            this.subscriptions[i] = observers[i].subscribe(function(newValue) {
              _this.notify(_this.evaluate());
            });
          }
        }
        _prototypeProperties(CompositeObserver, null, {
          subscribe: {
            value: function subscribe(callback) {
              var that = this;
              that.callback = callback;
              return function() {
                that.callback = null;
              };
            },
            writable: true,
            configurable: true
          },
          notify: {
            value: function notify(newValue) {
              var callback = this.callback;
              if (callback) {
                callback(newValue);
              }
            },
            writable: true,
            configurable: true
          },
          dispose: {
            value: function dispose() {
              var subscriptions = this.subscriptions;
              while (i--) {
                subscriptions[i]();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return CompositeObserver;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/binding-expression", ["./binding-modes"], function(_export) {
  "use strict";
  var ONE_WAY,
      TWO_WAY,
      _prototypeProperties,
      BindingExpression,
      Binding;
  return {
    setters: [function(_bindingModes) {
      ONE_WAY = _bindingModes.ONE_WAY;
      TWO_WAY = _bindingModes.TWO_WAY;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      BindingExpression = _export("BindingExpression", (function() {
        function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, valueConverterLookupFunction, attribute) {
          this.observerLocator = observerLocator;
          this.targetProperty = targetProperty;
          this.sourceExpression = sourceExpression;
          this.mode = mode;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
          this.attribute = attribute;
          this.discrete = false;
        }
        _prototypeProperties(BindingExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
            },
            writable: true,
            configurable: true
          }});
        return BindingExpression;
      })());
      Binding = (function() {
        function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
          this.observerLocator = observerLocator;
          this.sourceExpression = sourceExpression;
          this.targetProperty = observerLocator.getObserver(target, targetProperty);
          this.mode = mode;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
        }
        _prototypeProperties(Binding, null, {
          getObserver: {
            value: function getObserver(obj, propertyName) {
              return this.observerLocator.getObserver(obj, propertyName);
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(source) {
              var _this = this;
              var targetProperty = this.targetProperty,
                  info;
              if (this.mode == ONE_WAY || this.mode == TWO_WAY) {
                if (this._disposeObserver) {
                  if (this.source === source) {
                    return ;
                  }
                  this.unbind();
                }
                info = this.sourceExpression.connect(this, source);
                if (info.observer) {
                  this._disposeObserver = info.observer.subscribe(function(newValue) {
                    var existing = targetProperty.getValue();
                    if (newValue !== existing) {
                      targetProperty.setValue(newValue);
                    }
                  });
                }
                if (info.value !== undefined) {
                  targetProperty.setValue(info.value);
                }
                if (this.mode == TWO_WAY) {
                  this._disposeListener = targetProperty.subscribe(function(newValue) {
                    _this.sourceExpression.assign(source, newValue, _this.valueConverterLookupFunction);
                  });
                }
                this.source = source;
              } else {
                var value = this.sourceExpression.evaluate(source, this.valueConverterLookupFunction);
                if (value !== undefined) {
                  targetProperty.setValue(value);
                }
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              if (this._disposeObserver) {
                this._disposeObserver();
                this._disposeObserver = null;
              }
              if (this._disposeListener) {
                this._disposeListener();
                this._disposeListener = null;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return Binding;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/listener-expression", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      ListenerExpression,
      Listener;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ListenerExpression = _export("ListenerExpression", (function() {
        function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
          this.eventManager = eventManager;
          this.targetEvent = targetEvent;
          this.sourceExpression = sourceExpression;
          this.delegate = delegate;
          this.discrete = true;
          this.preventDefault = preventDefault;
        }
        _prototypeProperties(ListenerExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new Listener(this.eventManager, this.targetEvent, this.delegate, this.sourceExpression, target, this.preventDefault);
            },
            writable: true,
            configurable: true
          }});
        return ListenerExpression;
      })());
      Listener = (function() {
        function Listener(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault) {
          this.eventManager = eventManager;
          this.targetEvent = targetEvent;
          this.delegate = delegate;
          this.sourceExpression = sourceExpression;
          this.target = target;
          this.preventDefault = preventDefault;
        }
        _prototypeProperties(Listener, null, {
          bind: {
            value: function bind(source) {
              var _this = this;
              if (this._disposeListener) {
                if (this.source === source) {
                  return ;
                }
                this.unbind();
              }
              this.source = source;
              this._disposeListener = this.eventManager.addEventListener(this.target, this.targetEvent, function(event) {
                var prevEvent = source.$event;
                source.$event = event;
                var result = _this.sourceExpression.evaluate(source);
                source.$event = prevEvent;
                if (_this.preventDefault) {
                  event.preventDefault();
                }
                return result;
              }, this.delegate);
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              if (this._disposeListener) {
                this._disposeListener();
                this._disposeListener = null;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return Listener;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/name-expression", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      NameExpression,
      NameBinder;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      NameExpression = _export("NameExpression", (function() {
        function NameExpression(name, mode) {
          this.property = name;
          this.discrete = true;
          this.mode = (mode || "view-model").toLowerCase();
        }
        _prototypeProperties(NameExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new NameBinder(this.property, target, this.mode);
            },
            writable: true,
            configurable: true
          }});
        return NameExpression;
      })());
      NameBinder = (function() {
        function NameBinder(property, target, mode) {
          this.property = property;
          switch (mode) {
            case "element":
              this.target = target;
              break;
            case "view-model":
              this.target = target.primaryBehavior ? target.primaryBehavior.executionContext : target;
              break;
            default:
              throw new Error("Name expressions do not support mode: " + mode);
          }
        }
        _prototypeProperties(NameBinder, null, {
          bind: {
            value: function bind(source) {
              if (this.source) {
                if (this.source === source) {
                  return ;
                }
                this.unbind();
              }
              this.source = source;
              source[this.property] = this.target;
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.source[this.property] = null;
            },
            writable: true,
            configurable: true
          }
        });
        return NameBinder;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/call-expression", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      CallExpression,
      Call;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      CallExpression = _export("CallExpression", (function() {
        function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
          this.observerLocator = observerLocator;
          this.targetProperty = targetProperty;
          this.sourceExpression = sourceExpression;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
        }
        _prototypeProperties(CallExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.valueConverterLookupFunction);
            },
            writable: true,
            configurable: true
          }});
        return CallExpression;
      })());
      Call = (function() {
        function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
          this.sourceExpression = sourceExpression;
          this.target = target;
          this.targetProperty = observerLocator.getObserver(target, targetProperty);
          this.valueConverterLookupFunction = valueConverterLookupFunction;
        }
        _prototypeProperties(Call, null, {
          bind: {
            value: function bind(source) {
              var _this = this;
              if (this.source === source) {
                return ;
              }
              if (this.source) {
                this.unbind();
              }
              this.source = source;
              this.targetProperty.setValue(function() {
                for (var _len = arguments.length,
                    rest = Array(_len),
                    _key = 0; _key < _len; _key++) {
                  rest[_key] = arguments[_key];
                }
                return _this.sourceExpression.evaluate(source, _this.valueConverterLookupFunction, rest);
              });
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.targetProperty.setValue(null);
            },
            writable: true,
            configurable: true
          }
        });
        return Call;
      })();
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/behavior-instance", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      BehaviorInstance;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      BehaviorInstance = _export("BehaviorInstance", (function() {
        function BehaviorInstance(behavior, executionContext, instruction) {
          this.behavior = behavior;
          this.executionContext = executionContext;
          var observerLookup = behavior.observerLocator.getObserversLookup(executionContext),
              handlesBind = behavior.handlesBind,
              attributes = instruction.attributes,
              boundProperties = this.boundProperties = [],
              properties = behavior.properties,
              i,
              ii;
          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].initialize(executionContext, observerLookup, attributes, handlesBind, boundProperties);
          }
        }
        _prototypeProperties(BehaviorInstance, null, {
          created: {
            value: function created(context) {
              if (this.behavior.handlesCreated) {
                this.executionContext.created(context);
              }
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(context) {
              var skipSelfSubscriber = this.behavior.handlesBind,
                  boundProperties = this.boundProperties,
                  i,
                  ii,
                  x,
                  observer,
                  selfSubscriber;
              for (i = 0, ii = boundProperties.length; i < ii; ++i) {
                x = boundProperties[i];
                observer = x.observer;
                selfSubscriber = observer.selfSubscriber;
                observer.publishing = false;
                if (skipSelfSubscriber) {
                  observer.selfSubscriber = null;
                }
                x.binding.bind(context);
                observer.call();
                observer.publishing = true;
                observer.selfSubscriber = selfSubscriber;
              }
              if (skipSelfSubscriber) {
                this.executionContext.bind(context);
              }
              if (this.view) {
                this.view.bind(this.executionContext);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var boundProperties = this.boundProperties,
                  i,
                  ii;
              if (this.view) {
                this.view.unbind();
              }
              if (this.behavior.handlesUnbind) {
                this.executionContext.unbind();
              }
              for (i = 0, ii = boundProperties.length; i < ii; ++i) {
                boundProperties[i].binding.unbind();
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              if (this.behavior.handlesAttached) {
                this.executionContext.attached();
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              if (this.behavior.handlesDetached) {
                this.executionContext.detached();
              }
            },
            writable: true,
            configurable: true
          }
        });
        return BehaviorInstance;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/children", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      noMutations,
      ChildObserver,
      ChildObserverBinder;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      noMutations = [];
      ChildObserver = _export("ChildObserver", (function() {
        function ChildObserver(property, changeHandler, selector) {
          this.selector = selector;
          this.changeHandler = changeHandler;
          this.property = property;
        }
        _prototypeProperties(ChildObserver, null, {createBinding: {
            value: function createBinding(target, behavior) {
              return new ChildObserverBinder(this.selector, target, this.property, behavior, this.changeHandler);
            },
            writable: true,
            configurable: true
          }});
        return ChildObserver;
      })());
      ChildObserverBinder = _export("ChildObserverBinder", (function() {
        function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
          this.selector = selector;
          this.target = target;
          this.property = property;
          this.target = target;
          this.behavior = behavior;
          this.changeHandler = changeHandler;
          this.observer = new MutationObserver(this.onChange.bind(this));
        }
        _prototypeProperties(ChildObserverBinder, null, {
          bind: {
            value: function bind(source) {
              var items,
                  results,
                  i,
                  ii,
                  node,
                  behavior = this.behavior;
              this.observer.observe(this.target, {
                childList: true,
                subtree: true
              });
              items = behavior[this.property];
              if (!items) {
                items = behavior[this.property] = [];
              } else {
                items.length = 0;
              }
              results = this.target.querySelectorAll(this.selector);
              for (i = 0, ii = results.length; i < ii; ++i) {
                node = results[i];
                items.push(node.primaryBehavior ? node.primaryBehavior.executionContext : node);
              }
              if (this.changeHandler) {
                this.behavior[this.changeHandler](noMutations);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.observer.disconnect();
            },
            writable: true,
            configurable: true
          },
          onChange: {
            value: function onChange(mutations) {
              var items = this.behavior[this.property],
                  selector = this.selector;
              mutations.forEach(function(record) {
                var added = record.addedNodes,
                    removed = record.removedNodes,
                    prev = record.previousSibling,
                    i,
                    ii,
                    primary,
                    index,
                    node;
                for (i = 0, ii = removed.length; i < ii; ++i) {
                  node = removed[i];
                  if (node.nodeType === 1 && node.matches(selector)) {
                    primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
                    index = items.indexOf(primary);
                    if (index != -1) {
                      items.splice(index, 1);
                    }
                  }
                }
                for (i = 0, ii = added.length; i < ii; ++i) {
                  node = added[i];
                  if (node.nodeType === 1 && node.matches(selector)) {
                    primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
                    index = 0;
                    while (prev) {
                      if (prev.nodeType === 1 && prev.matches(selector)) {
                        index++;
                      }
                      prev = prev.previousSibling;
                    }
                    items.splice(index, 0, primary);
                  }
                }
              });
              if (this.changeHandler) {
                this.behavior[this.changeHandler](mutations);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ChildObserverBinder;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/content-selector", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      proto,
      placeholder,
      ContentSelector;
  function findInsertionPoint(groups, index) {
    var insertionPoint;
    while (!insertionPoint && index >= 0) {
      insertionPoint = groups[index][0];
      index--;
    }
    return insertionPoint || anchor;
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      if (Element && !Element.prototype.matches) {
        proto = Element.prototype;
        proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
      }
      placeholder = [];
      ContentSelector = _export("ContentSelector", (function() {
        function ContentSelector(anchor, selector) {
          this.anchor = anchor;
          this.selector = selector;
          this.all = !this.selector;
          this.groups = [];
        }
        _prototypeProperties(ContentSelector, {applySelectors: {
            value: function applySelectors(view, contentSelectors, callback) {
              var currentChild = view.fragment.firstChild,
                  contentMap = new Map(),
                  nextSibling,
                  i,
                  ii,
                  contentSelector;
              while (currentChild) {
                nextSibling = currentChild.nextSibling;
                if (currentChild.viewSlot) {
                  var viewSlotSelectors = contentSelectors.map(function(x) {
                    return x.copyForViewSlot();
                  });
                  currentChild.viewSlot.installContentSelectors(viewSlotSelectors);
                } else {
                  for (i = 0, ii = contentSelectors.length; i < ii; i++) {
                    contentSelector = contentSelectors[i];
                    if (contentSelector.matches(currentChild)) {
                      var elements = contentMap.get(contentSelector);
                      if (!elements) {
                        elements = [];
                        contentMap.set(contentSelector, elements);
                      }
                      elements.push(currentChild);
                      break;
                    }
                  }
                }
                currentChild = nextSibling;
              }
              for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
                contentSelector = contentSelectors[i];
                callback(contentSelector, contentMap.get(contentSelector) || placeholder);
              }
            },
            writable: true,
            configurable: true
          }}, {
          copyForViewSlot: {
            value: function copyForViewSlot() {
              return new ContentSelector(this.anchor, this.selector);
            },
            writable: true,
            configurable: true
          },
          matches: {
            value: function matches(node) {
              return this.all || node.nodeType === 1 && node.matches(this.selector);
            },
            writable: true,
            configurable: true
          },
          add: {
            value: function add(group) {
              var anchor = this.anchor,
                  parent = anchor.parentNode,
                  i,
                  ii;
              for (i = 0, ii = group.length; i < ii; ++i) {
                parent.insertBefore(group[i], anchor);
              }
              this.groups.push(group);
            },
            writable: true,
            configurable: true
          },
          insert: {
            value: function insert(index, group) {
              if (group.length) {
                var anchor = findInsertionPoint(this.groups, index) || this.anchor,
                    parent = anchor.parentNode,
                    i,
                    ii;
                for (i = 0, ii = group.length; i < ii; ++i) {
                  parent.insertBefore(group[i], anchor);
                }
              }
              this.groups.splice(index, 0, group);
            },
            writable: true,
            configurable: true
          },
          removeAt: {
            value: function removeAt(index, fragment) {
              var group = this.groups[index],
                  i,
                  ii;
              for (i = 0, ii = group.length; i < ii; ++i) {
                fragment.appendChild(group[i]);
              }
              this.groups.splice(index, 1);
            },
            writable: true,
            configurable: true
          }
        });
        return ContentSelector;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/resource-registry", ["aurelia-path"], function(_export) {
  "use strict";
  var relativeToFile,
      _get,
      _inherits,
      _prototypeProperties,
      ResourceRegistry,
      ViewResources;
  function register(lookup, name, resource, type) {
    if (!name) {
      return ;
    }
    var existing = lookup[name];
    if (existing) {
      if (existing != resource) {
        throw new Error("Attempted to register " + type + " when one with the same name already exists. Name: " + name + ".");
      }
      return ;
    }
    lookup[name] = resource;
  }
  return {
    setters: [function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }],
    execute: function() {
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ResourceRegistry = _export("ResourceRegistry", (function() {
        function ResourceRegistry() {
          this.attributes = {};
          this.elements = {};
          this.valueConverters = {};
          this.attributeMap = {};
          this.baseResourceUrl = "";
        }
        _prototypeProperties(ResourceRegistry, null, {
          registerElement: {
            value: function registerElement(tagName, behavior) {
              register(this.elements, tagName, behavior, "an Element");
            },
            writable: true,
            configurable: true
          },
          getElement: {
            value: function getElement(tagName) {
              return this.elements[tagName];
            },
            writable: true,
            configurable: true
          },
          registerAttribute: {
            value: function registerAttribute(attribute, behavior, knownAttribute) {
              this.attributeMap[attribute] = knownAttribute;
              register(this.attributes, attribute, behavior, "an Attribute");
            },
            writable: true,
            configurable: true
          },
          getAttribute: {
            value: function getAttribute(attribute) {
              return this.attributes[attribute];
            },
            writable: true,
            configurable: true
          },
          registerValueConverter: {
            value: function registerValueConverter(name, valueConverter) {
              register(this.valueConverters, name, valueConverter, "a ValueConverter");
            },
            writable: true,
            configurable: true
          },
          getValueConverter: {
            value: function getValueConverter(name) {
              return this.valueConverters[name];
            },
            writable: true,
            configurable: true
          }
        });
        return ResourceRegistry;
      })());
      ViewResources = _export("ViewResources", (function(ResourceRegistry) {
        function ViewResources(parent, viewUrl) {
          _get(Object.getPrototypeOf(ViewResources.prototype), "constructor", this).call(this);
          this.parent = parent;
          this.viewUrl = viewUrl;
          this.valueConverterLookupFunction = this.getValueConverter.bind(this);
        }
        _inherits(ViewResources, ResourceRegistry);
        _prototypeProperties(ViewResources, null, {
          relativeToView: {
            value: function relativeToView(path) {
              return relativeToFile(path, this.viewUrl);
            },
            writable: true,
            configurable: true
          },
          getElement: {
            value: function getElement(tagName) {
              return this.elements[tagName] || this.parent.getElement(tagName);
            },
            writable: true,
            configurable: true
          },
          mapAttribute: {
            value: function mapAttribute(attribute) {
              return this.attributeMap[attribute] || this.parent.attributeMap[attribute];
            },
            writable: true,
            configurable: true
          },
          getAttribute: {
            value: function getAttribute(attribute) {
              return this.attributes[attribute] || this.parent.getAttribute(attribute);
            },
            writable: true,
            configurable: true
          },
          getValueConverter: {
            value: function getValueConverter(name) {
              return this.valueConverters[name] || this.parent.getValueConverter(name);
            },
            writable: true,
            configurable: true
          }
        });
        return ViewResources;
      })(ResourceRegistry));
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/view", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      View;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      View = _export("View", (function() {
        function View(fragment, behaviors, bindings, children, systemControlled, contentSelectors) {
          this.fragment = fragment;
          this.behaviors = behaviors;
          this.bindings = bindings;
          this.children = children;
          this.systemControlled = systemControlled;
          this.contentSelectors = contentSelectors;
          this.firstChild = fragment.firstChild;
          this.lastChild = fragment.lastChild;
          this.isBound = false;
          this.isAttached = false;
        }
        _prototypeProperties(View, null, {
          created: {
            value: function created(executionContext) {
              var i,
                  ii,
                  behaviors = this.behaviors;
              for (i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].created(executionContext);
              }
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(executionContext, systemUpdate) {
              var context,
                  behaviors,
                  bindings,
                  children,
                  i,
                  ii;
              if (systemUpdate && !this.systemControlled) {
                context = this.executionContext || executionContext;
              } else {
                context = executionContext || this.executionContext;
              }
              if (this.isBound) {
                if (this.executionContext === context) {
                  return ;
                }
                this.unbind();
              }
              this.isBound = true;
              this.executionContext = context;
              if (this.owner) {
                this.owner.bind(context);
              }
              bindings = this.bindings;
              for (i = 0, ii = bindings.length; i < ii; ++i) {
                bindings[i].bind(context);
              }
              behaviors = this.behaviors;
              for (i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(context);
              }
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].bind(context, true);
              }
            },
            writable: true,
            configurable: true
          },
          addBinding: {
            value: function addBinding(binding) {
              this.bindings.push(binding);
              if (this.isBound) {
                binding.bind(this.executionContext);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var behaviors,
                  bindings,
                  children,
                  i,
                  ii;
              if (this.isBound) {
                this.isBound = false;
                if (this.owner) {
                  this.owner.unbind();
                }
                bindings = this.bindings;
                for (i = 0, ii = bindings.length; i < ii; ++i) {
                  bindings[i].unbind();
                }
                behaviors = this.behaviors;
                for (i = 0, ii = behaviors.length; i < ii; ++i) {
                  behaviors[i].unbind();
                }
                children = this.children;
                for (i = 0, ii = children.length; i < ii; ++i) {
                  children[i].unbind();
                }
              }
            },
            writable: true,
            configurable: true
          },
          insertNodesBefore: {
            value: function insertNodesBefore(refNode) {
              var parent = refNode.parentNode;
              parent.insertBefore(this.fragment, refNode);
            },
            writable: true,
            configurable: true
          },
          appendNodesTo: {
            value: function appendNodesTo(parent) {
              parent.appendChild(this.fragment);
            },
            writable: true,
            configurable: true
          },
          removeNodes: {
            value: function removeNodes() {
              var start = this.firstChild,
                  end = this.lastChild,
                  fragment = this.fragment,
                  next;
              var current = start,
                  loop = true,
                  nodes = [];
              while (loop) {
                if (current === end) {
                  loop = false;
                }
                next = current.nextSibling;
                this.fragment.appendChild(current);
                current = next;
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              var behaviors,
                  children,
                  i,
                  ii;
              if (this.isAttached) {
                return ;
              }
              this.isAttached = true;
              if (this.owner) {
                this.owner.attached();
              }
              behaviors = this.behaviors;
              for (i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].attached();
              }
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].attached();
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              var behaviors,
                  children,
                  i,
                  ii;
              if (this.isAttached) {
                this.isAttached = false;
                if (this.owner) {
                  this.owner.detached();
                }
                behaviors = this.behaviors;
                for (i = 0, ii = behaviors.length; i < ii; ++i) {
                  behaviors[i].detached();
                }
                children = this.children;
                for (i = 0, ii = children.length; i < ii; ++i) {
                  children[i].detached();
                }
              }
            },
            writable: true,
            configurable: true
          }
        });
        return View;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/view-slot", ["./content-selector"], function(_export) {
  "use strict";
  var ContentSelector,
      _prototypeProperties,
      ViewSlot;
  return {
    setters: [function(_contentSelector) {
      ContentSelector = _contentSelector.ContentSelector;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ViewSlot = _export("ViewSlot", (function() {
        function ViewSlot(anchor, anchorIsContainer, executionContext) {
          this.anchor = anchor;
          this.viewAddMethod = anchorIsContainer ? "appendNodesTo" : "insertNodesBefore";
          this.executionContext = executionContext;
          this.children = [];
          this.isBound = false;
          this.isAttached = false;
          anchor.viewSlot = this;
        }
        _prototypeProperties(ViewSlot, null, {
          transformChildNodesIntoView: {
            value: function transformChildNodesIntoView() {
              var parent = this.anchor;
              this.children.push({
                removeNodes: function removeNodes() {
                  var last;
                  while (last = parent.lastChild) {
                    parent.removeChild(last);
                  }
                },
                created: function created() {},
                bind: function bind() {},
                unbind: function unbind() {},
                attached: function attached() {},
                detached: function detached() {}
              });
            },
            writable: true,
            configurable: true
          },
          bind: {
            value: function bind(executionContext) {
              var i,
                  ii,
                  children;
              if (this.isBound) {
                if (this.executionContext === executionContext) {
                  return ;
                }
                this.unbind();
              }
              this.isBound = true;
              this.executionContext = executionContext = executionContext || this.executionContext;
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].bind(executionContext, true);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var i,
                  ii,
                  children = this.children;
              this.isBound = false;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].unbind();
              }
            },
            writable: true,
            configurable: true
          },
          add: {
            value: function add(view) {
              view[this.viewAddMethod](this.anchor);
              this.children.push(view);
              if (this.isAttached) {
                view.attached();
              }
            },
            writable: true,
            configurable: true
          },
          insert: {
            value: function insert(index, view) {
              if (index === 0 && !this.children.length || index >= this.children.length) {
                this.add(view);
              } else {
                view.insertNodesBefore(this.children[index].firstChild);
                this.children.splice(index, 0, view);
                if (this.isAttached) {
                  view.attached();
                }
              }
            },
            writable: true,
            configurable: true
          },
          remove: {
            value: function remove(view) {
              view.removeNodes();
              this.children.splice(this.children.indexOf(view), 1);
              if (this.isAttached) {
                view.detached();
              }
            },
            writable: true,
            configurable: true
          },
          removeAt: {
            value: function removeAt(index) {
              var view = this.children[index];
              view.removeNodes();
              this.children.splice(index, 1);
              if (this.isAttached) {
                view.detached();
              }
              return view;
            },
            writable: true,
            configurable: true
          },
          removeAll: {
            value: function removeAll() {
              var children = this.children,
                  ii = children.length,
                  i;
              for (i = 0; i < ii; ++i) {
                children[i].removeNodes();
              }
              if (this.isAttached) {
                for (i = 0; i < ii; ++i) {
                  children[i].detached();
                }
              }
              this.children = [];
            },
            writable: true,
            configurable: true
          },
          swap: {
            value: function swap(view) {
              this.removeAll();
              this.add(view);
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              var i,
                  ii,
                  children;
              if (this.isAttached) {
                return ;
              }
              this.isAttached = true;
              children = this.children;
              for (i = 0, ii = children.length; i < ii; ++i) {
                children[i].attached();
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              var i,
                  ii,
                  children;
              if (this.isAttached) {
                this.isAttached = false;
                children = this.children;
                for (i = 0, ii = children.length; i < ii; ++i) {
                  children[i].detached();
                }
              }
            },
            writable: true,
            configurable: true
          },
          installContentSelectors: {
            value: function installContentSelectors(contentSelectors) {
              this.contentSelectors = contentSelectors;
              this.add = this.contentSelectorAdd;
              this.insert = this.contentSelectorInsert;
              this.remove = this.contentSelectorRemove;
              this.removeAt = this.contentSelectorRemoveAt;
              this.removeAll = this.contentSelectorRemoveAll;
            },
            writable: true,
            configurable: true
          },
          contentSelectorAdd: {
            value: function contentSelectorAdd(view) {
              ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
                return contentSelector.add(group);
              });
              this.children.push(view);
              if (this.isAttached) {
                view.attached();
              }
            },
            writable: true,
            configurable: true
          },
          contentSelectorInsert: {
            value: function contentSelectorInsert(index, view) {
              if (index === 0 && !this.children.length || index >= this.children.length) {
                this.add(view);
              } else {
                ContentSelector.applySelectors(view, this.contentSelectors, function(contentSelector, group) {
                  return contentSelector.insert(index, group);
                });
                this.children.splice(index, 0, view);
                if (this.isAttached) {
                  view.attached();
                }
              }
            },
            writable: true,
            configurable: true
          },
          contentSelectorRemove: {
            value: function contentSelectorRemove(view) {
              var index = this.children.indexOf(view),
                  contentSelectors = this.contentSelectors,
                  i,
                  ii;
              for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
                contentSelectors[i].removeAt(index, view.fragment);
              }
              this.children.splice(index, 1);
              if (this.isAttached) {
                view.detached();
              }
            },
            writable: true,
            configurable: true
          },
          contentSelectorRemoveAt: {
            value: function contentSelectorRemoveAt(index) {
              var view = this.children[index],
                  contentSelectors = this.contentSelectors,
                  i,
                  ii;
              for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
                contentSelectors[i].removeAt(index, view.fragment);
              }
              this.children.splice(index, 1);
              if (this.isAttached) {
                view.detached();
              }
              return view;
            },
            writable: true,
            configurable: true
          },
          contentSelectorRemoveAll: {
            value: function contentSelectorRemoveAll() {
              var children = this.children,
                  contentSelectors = this.contentSelectors,
                  ii = children.length,
                  jj = contentSelectors.length,
                  i,
                  j,
                  view;
              for (i = 0; i < ii; ++i) {
                view = children[i];
                for (j = 0; j < jj; ++j) {
                  contentSelectors[j].removeAt(i, view.fragment);
                }
              }
              if (this.isAttached) {
                for (i = 0; i < ii; ++i) {
                  children[i].detached();
                }
              }
              this.children = [];
            },
            writable: true,
            configurable: true
          }
        });
        return ViewSlot;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/binding-language", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      BindingLanguage;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      BindingLanguage = _export("BindingLanguage", (function() {
        function BindingLanguage() {}
        _prototypeProperties(BindingLanguage, null, {
          inspectAttribute: {
            value: function inspectAttribute(resources, attrName, attrValue) {
              throw new Error("A BindingLanguage must implement inspectAttribute(...)");
            },
            writable: true,
            configurable: true
          },
          createAttributeInstruction: {
            value: function createAttributeInstruction(resources, element, info, existingInstruction) {
              throw new Error("A BindingLanguage must implement createAttributeInstruction(...)");
            },
            writable: true,
            configurable: true
          },
          parseText: {
            value: function parseText(resources, value) {
              throw new Error("A BindingLanguage must implement parseText(...)");
            },
            writable: true,
            configurable: true
          }
        });
        return BindingLanguage;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/view-strategy", ["aurelia-metadata", "aurelia-path"], function(_export) {
  "use strict";
  var Metadata,
      Origin,
      relativeToFile,
      _inherits,
      _prototypeProperties,
      ViewStrategy,
      UseView,
      ConventionalView,
      NoView;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
    }, function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }],
    execute: function() {
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ViewStrategy = _export("ViewStrategy", (function() {
        function ViewStrategy() {}
        _prototypeProperties(ViewStrategy, {
          normalize: {
            value: function normalize(value) {
              if (typeof value === "string") {
                value = new UseView(value);
              }
              if (value && !(value instanceof ViewStrategy)) {
                throw new Error("The view must be a string or an instance of ViewStrategy.");
              }
              return value;
            },
            writable: true,
            configurable: true
          },
          getDefault: {
            value: function getDefault(target) {
              var strategy,
                  annotation;
              if (typeof target !== "function") {
                target = target.constructor;
              }
              annotation = Origin.get(target);
              strategy = Metadata.on(target).first(ViewStrategy);
              if (!strategy) {
                if (!annotation) {
                  throw new Error("Cannot determinte default view strategy for object.", target);
                }
                strategy = new ConventionalView(annotation.moduleId);
              } else if (annotation) {
                strategy.moduleId = annotation.moduleId;
              }
              return strategy;
            },
            writable: true,
            configurable: true
          }
        }, {
          makeRelativeTo: {
            value: function makeRelativeTo(baseUrl) {},
            writable: true,
            configurable: true
          },
          loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              throw new Error("A ViewStrategy must implement loadViewFactory(viewEngine, options).");
            },
            writable: true,
            configurable: true
          }
        });
        return ViewStrategy;
      })());
      UseView = _export("UseView", (function(ViewStrategy) {
        function UseView(path) {
          this.path = path;
        }
        _inherits(UseView, ViewStrategy);
        _prototypeProperties(UseView, null, {
          loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              if (!this.absolutePath && this.moduleId) {
                this.absolutePath = relativeToFile(this.path, this.moduleId);
              }
              return viewEngine.loadViewFactory(this.absolutePath || this.path, options, this.moduleId);
            },
            writable: true,
            configurable: true
          },
          makeRelativeTo: {
            value: function makeRelativeTo(file) {
              this.absolutePath = relativeToFile(this.path, file);
            },
            writable: true,
            configurable: true
          }
        });
        return UseView;
      })(ViewStrategy));
      ConventionalView = _export("ConventionalView", (function(ViewStrategy) {
        function ConventionalView(moduleId) {
          this.moduleId = moduleId;
          this.viewUrl = ConventionalView.convertModuleIdToViewUrl(moduleId);
        }
        _inherits(ConventionalView, ViewStrategy);
        _prototypeProperties(ConventionalView, {convertModuleIdToViewUrl: {
            value: function convertModuleIdToViewUrl(moduleId) {
              return moduleId + ".html";
            },
            writable: true,
            configurable: true
          }}, {loadViewFactory: {
            value: function loadViewFactory(viewEngine, options) {
              return viewEngine.loadViewFactory(this.viewUrl, options, this.moduleId);
            },
            writable: true,
            configurable: true
          }});
        return ConventionalView;
      })(ViewStrategy));
      NoView = _export("NoView", (function(ViewStrategy) {
        function NoView() {
          if (Object.getPrototypeOf(NoView) !== null) {
            Object.getPrototypeOf(NoView).apply(this, arguments);
          }
        }
        _inherits(NoView, ViewStrategy);
        _prototypeProperties(NoView, null, {loadViewFactory: {
            value: function loadViewFactory() {
              return Promise.resolve(null);
            },
            writable: true,
            configurable: true
          }});
        return NoView;
      })(ViewStrategy));
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/element-config", ["aurelia-metadata", "aurelia-binding"], function(_export) {
  "use strict";
  var ResourceType,
      EventManager,
      _prototypeProperties,
      _inherits,
      ElementConfig;
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_aureliaBinding) {
      EventManager = _aureliaBinding.EventManager;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      ElementConfig = _export("ElementConfig", (function(ResourceType) {
        function ElementConfig() {
          if (Object.getPrototypeOf(ElementConfig) !== null) {
            Object.getPrototypeOf(ElementConfig).apply(this, arguments);
          }
        }
        _inherits(ElementConfig, ResourceType);
        _prototypeProperties(ElementConfig, null, {
          load: {
            value: function load(container, target) {
              var config = new target(),
                  eventManager = container.get(EventManager);
              eventManager.registerElementConfig(config);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register() {},
            writable: true,
            configurable: true
          }
        });
        return ElementConfig;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/template-controller", ["aurelia-metadata", "./behavior-instance", "./behaviors", "./util"], function(_export) {
  "use strict";
  var ResourceType,
      BehaviorInstance,
      configureBehavior,
      hyphenate,
      _prototypeProperties,
      _inherits,
      TemplateController;
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_behaviorInstance) {
      BehaviorInstance = _behaviorInstance.BehaviorInstance;
    }, function(_behaviors) {
      configureBehavior = _behaviors.configureBehavior;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      TemplateController = _export("TemplateController", (function(ResourceType) {
        function TemplateController(attribute) {
          this.name = attribute;
          this.properties = [];
          this.attributes = {};
          this.liftsContent = true;
        }
        _inherits(TemplateController, ResourceType);
        _prototypeProperties(TemplateController, {convention: {
            value: function convention(name) {
              if (name.endsWith("TemplateController")) {
                return new TemplateController(hyphenate(name.substring(0, name.length - 18)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              configureBehavior(container, this, target);
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target) {
              return Promise.resolve(this);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerAttribute(name || this.name, this, this.name);
            },
            writable: true,
            configurable: true
          },
          compile: {
            value: function compile(compiler, resources, node, instruction, parentNode) {
              if (!instruction.viewFactory) {
                var template = document.createElement("template"),
                    fragment = document.createDocumentFragment();
                node.removeAttribute(instruction.originalAttrName);
                if (node.parentNode) {
                  node.parentNode.replaceChild(template, node);
                } else if (window.ShadowDOMPolyfill) {
                  ShadowDOMPolyfill.unwrap(parentNode).replaceChild(ShadowDOMPolyfill.unwrap(template), ShadowDOMPolyfill.unwrap(node));
                } else {
                  parentNode.replaceChild(template, node);
                }
                fragment.appendChild(node);
                instruction.viewFactory = compiler.compile(fragment, resources);
                node = template;
              }
              instruction.suppressBind = true;
              return node;
            },
            writable: true,
            configurable: true
          },
          create: {
            value: function create(container, instruction, element) {
              var executionContext = instruction.executionContext || container.get(this.target),
                  behaviorInstance = new BehaviorInstance(this, executionContext, instruction);
              element.primaryBehavior = behaviorInstance;
              if (!(this.apiName in element)) {
                element[this.apiName] = behaviorInstance.executionContext;
              }
              return behaviorInstance;
            },
            writable: true,
            configurable: true
          }
        });
        return TemplateController;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/resource-coordinator", ["aurelia-loader", "aurelia-path", "aurelia-dependency-injection", "aurelia-metadata", "aurelia-binding", "./custom-element", "./attached-behavior", "./template-controller", "./view-engine", "./resource-registry"], function(_export) {
  "use strict";
  var Loader,
      relativeToFile,
      join,
      Container,
      Metadata,
      ResourceType,
      Origin,
      ValueConverter,
      CustomElement,
      AttachedBehavior,
      TemplateController,
      ViewEngine,
      ResourceRegistry,
      _prototypeProperties,
      id,
      ResourceCoordinator,
      ResourceModule;
  function nextId() {
    return ++id;
  }
  function analyzeModule(moduleInstance, viewModelMember) {
    var viewModelType,
        fallback,
        annotation,
        key,
        meta,
        exportedValue,
        resources = [],
        name,
        conventional;
    if (typeof moduleInstance === "function") {
      moduleInstance = {"default": moduleInstance};
    }
    if (viewModelMember) {
      viewModelType = moduleInstance[viewModelMember];
    }
    for (key in moduleInstance) {
      exportedValue = moduleInstance[key];
      if (key === viewModelMember || typeof exportedValue !== "function") {
        continue;
      }
      meta = Metadata.on(exportedValue);
      annotation = meta.first(ResourceType);
      if (annotation) {
        if (!viewModelType && annotation instanceof CustomElement) {
          viewModelType = exportedValue;
        } else {
          resources.push({
            type: annotation,
            value: exportedValue
          });
        }
      } else {
        name = exportedValue.name;
        if (conventional = CustomElement.convention(name)) {
          if (!viewModelType) {
            meta.add(conventional);
            viewModelType = exportedValue;
          } else {
            resources.push({
              type: conventional,
              value: exportedValue
            });
          }
        } else if (conventional = AttachedBehavior.convention(name)) {
          resources.push({
            type: conventional,
            value: exportedValue
          });
        } else if (conventional = TemplateController.convention(name)) {
          resources.push({
            type: conventional,
            value: exportedValue
          });
        } else if (conventional = ValueConverter.convention(name)) {
          resources.push({
            type: conventional,
            value: exportedValue
          });
        } else if (!fallback) {
          fallback = exportedValue;
        }
      }
    }
    viewModelType = viewModelType || fallback;
    return new ResourceModule(moduleInstance, viewModelType ? {
      value: viewModelType,
      type: Metadata.on(viewModelType).first(CustomElement) || new CustomElement()
    } : null, resources);
  }
  return {
    setters: [function(_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
      join = _aureliaPath.join;
    }, function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      ResourceType = _aureliaMetadata.ResourceType;
      Origin = _aureliaMetadata.Origin;
    }, function(_aureliaBinding) {
      ValueConverter = _aureliaBinding.ValueConverter;
    }, function(_customElement) {
      CustomElement = _customElement.CustomElement;
    }, function(_attachedBehavior) {
      AttachedBehavior = _attachedBehavior.AttachedBehavior;
    }, function(_templateController) {
      TemplateController = _templateController.TemplateController;
    }, function(_viewEngine) {
      ViewEngine = _viewEngine.ViewEngine;
    }, function(_resourceRegistry) {
      ResourceRegistry = _resourceRegistry.ResourceRegistry;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      id = 0;
      ResourceCoordinator = _export("ResourceCoordinator", (function() {
        function ResourceCoordinator(loader, container, viewEngine, appResources) {
          this.loader = loader;
          this.container = container;
          this.viewEngine = viewEngine;
          this.importedModules = {};
          this.appResources = appResources;
          viewEngine.resourceCoordinator = this;
        }
        _prototypeProperties(ResourceCoordinator, {inject: {
            value: function inject() {
              return [Loader, Container, ViewEngine, ResourceRegistry];
            },
            writable: true,
            configurable: true
          }}, {
          getExistingModuleAnalysis: {
            value: function getExistingModuleAnalysis(id) {
              return this.importedModules[id];
            },
            writable: true,
            configurable: true
          },
          loadViewModelInfo: {
            value: function loadViewModelInfo(moduleImport, moduleMember) {
              return this._loadAndAnalyzeModuleForElement(moduleImport, moduleMember);
            },
            writable: true,
            configurable: true
          },
          loadElement: {
            value: function loadElement(moduleImport, moduleMember, viewStategy) {
              var _this = this;
              return this._loadAndAnalyzeModuleForElement(moduleImport, moduleMember, this.importedModules).then(function(info) {
                var type = info.type;
                if (type.isLoaded) {
                  return type;
                }
                type.isLoaded = true;
                return type.load(_this.container, info.value, viewStategy);
              });
            },
            writable: true,
            configurable: true
          },
          _loadAndAnalyzeModuleForElement: {
            value: function _loadAndAnalyzeModuleForElement(moduleImport, moduleMember, cache) {
              var _this = this;
              var existing = cache && cache[moduleImport];
              if (existing) {
                return Promise.resolve(existing.element);
              }
              return this.loader.loadModule(moduleImport).then(function(elementModule) {
                var analysis = analyzeModule(elementModule, moduleMember),
                    resources = analysis.resources,
                    container = _this.container,
                    loads = [],
                    type,
                    current,
                    i,
                    ii;
                if (!analysis.element) {
                  throw new Error("No element found in module \"" + moduleImport + "\".");
                }
                analysis.analyze(container);
                for (i = 0, ii = resources.length; i < ii; ++i) {
                  current = resources[i];
                  type = current.type;
                  if (!type.isLoaded) {
                    type.isLoaded = true;
                    loads.push(type.load(container, current.value));
                  }
                }
                if (cache) {
                  cache[analysis.id] = analysis;
                }
                return Promise.all(loads).then(function() {
                  return analysis.element;
                });
              });
            },
            writable: true,
            configurable: true
          },
          importResources: {
            value: function importResources(imports, resourceManifestUrl) {
              var i,
                  ii,
                  current,
                  annotation,
                  existing,
                  lookup = {},
                  finalModules = [],
                  importIds = [],
                  analysis,
                  type;
              var container = this.container;
              for (i = 0, ii = imports.length; i < ii; ++i) {
                current = imports[i];
                annotation = Origin.get(current);
                if (!annotation) {
                  analysis = analyzeModule({"default": current});
                  analysis.analyze(container);
                  type = (analysis.element || analysis.resources[0]).type;
                  if (resourceManifestUrl) {
                    annotation = new Origin(relativeToFile("./" + type.name, resourceManifestUrl));
                  } else {
                    annotation = new Origin(join(this.appResources.baseResourceUrl, type.name));
                  }
                  Origin.set(current, annotation);
                }
                existing = lookup[annotation.moduleId];
                if (!existing) {
                  existing = {};
                  importIds.push(annotation.moduleId);
                  finalModules.push(existing);
                  lookup[annotation.moduleId] = existing;
                }
                existing[nextId()] = current;
              }
              return this.importResourcesFromModules(finalModules, importIds);
            },
            writable: true,
            configurable: true
          },
          importResourcesFromModuleIds: {
            value: function importResourcesFromModuleIds(importIds) {
              var _this = this;
              return this.loader.loadAllModules(importIds).then(function(imports) {
                return _this.importResourcesFromModules(imports, importIds);
              });
            },
            writable: true,
            configurable: true
          },
          importResourcesFromModules: {
            value: function importResourcesFromModules(imports, importIds) {
              var loads = [],
                  i,
                  ii,
                  analysis,
                  type,
                  key,
                  annotation,
                  j,
                  jj,
                  resources,
                  current,
                  existing = this.importedModules,
                  container = this.container,
                  allAnalysis = new Array(imports.length);
              if (!importIds) {
                importIds = new Array(imports.length);
                for (i = 0, ii = imports.length; i < ii; ++i) {
                  current = imports[i];
                  for (key in current) {
                    type = current[key];
                    annotation = Origin.get(type);
                    if (annotation) {
                      importIds[i] = annotation.moduleId;
                      break;
                    }
                  }
                }
              }
              for (i = 0, ii = imports.length; i < ii; ++i) {
                analysis = existing[importIds[i]];
                if (analysis) {
                  allAnalysis[i] = analysis;
                  continue;
                }
                analysis = analyzeModule(imports[i]);
                analysis.analyze(container);
                existing[analysis.id] = analysis;
                allAnalysis[i] = analysis;
                resources = analysis.resources;
                for (j = 0, jj = resources.length; j < jj; ++j) {
                  current = resources[j];
                  type = current.type;
                  if (!type.isLoaded) {
                    type.isLoaded = true;
                    loads.push(type.load(container, current.value));
                  }
                }
                if (analysis.element) {
                  type = analysis.element.type;
                  if (!type.isLoaded) {
                    type.isLoaded = true;
                    loads.push(type.load(container, analysis.element.value));
                  }
                }
              }
              return Promise.all(loads).then(function() {
                return allAnalysis;
              });
            },
            writable: true,
            configurable: true
          }
        });
        return ResourceCoordinator;
      })());
      ResourceModule = (function() {
        function ResourceModule(source, element, resources) {
          var i,
              ii,
              org;
          this.source = source;
          this.element = element;
          this.resources = resources;
          if (element) {
            org = Origin.get(element.value);
          } else if (resources.length) {
            org = Origin.get(resources[0].value);
          } else {
            org = Origin.get(source);
          }
          if (org) {
            this.id = org.moduleId;
          }
        }
        _prototypeProperties(ResourceModule, null, {
          analyze: {
            value: function analyze(container) {
              var current = this.element,
                  resources = this.resources,
                  i,
                  ii;
              if (current) {
                if (!current.type.isAnalyzed) {
                  current.type.isAnalyzed = true;
                  current.type.analyze(container, current.value);
                }
              }
              for (i = 0, ii = resources.length; i < ii; ++i) {
                current = resources[i];
                if ("analyze" in current.type && !current.type.isAnalyzed) {
                  current.type.isAnalyzed = true;
                  current.type.analyze(container, current.value);
                }
              }
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              var i,
                  ii,
                  resources = this.resources;
              if (this.element) {
                this.element.type.register(registry, name);
                name = null;
              }
              for (i = 0, ii = resources.length; i < ii; ++i) {
                resources[i].type.register(registry, name);
                name = null;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ResourceModule;
      })();
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/composition-engine", ["aurelia-metadata", "./view-strategy", "./resource-coordinator", "./view-engine", "./custom-element"], function(_export) {
  "use strict";
  var Origin,
      ViewStrategy,
      UseView,
      ResourceCoordinator,
      ViewEngine,
      CustomElement,
      _prototypeProperties,
      CompositionEngine;
  return {
    setters: [function(_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function(_viewStrategy) {
      ViewStrategy = _viewStrategy.ViewStrategy;
      UseView = _viewStrategy.UseView;
    }, function(_resourceCoordinator) {
      ResourceCoordinator = _resourceCoordinator.ResourceCoordinator;
    }, function(_viewEngine) {
      ViewEngine = _viewEngine.ViewEngine;
    }, function(_customElement) {
      CustomElement = _customElement.CustomElement;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      CompositionEngine = _export("CompositionEngine", (function() {
        function CompositionEngine(resourceCoordinator, viewEngine) {
          this.resourceCoordinator = resourceCoordinator;
          this.viewEngine = viewEngine;
        }
        _prototypeProperties(CompositionEngine, {inject: {
            value: function inject() {
              return [ResourceCoordinator, ViewEngine];
            },
            writable: true,
            configurable: true
          }}, {
          activate: {
            value: function activate(instruction) {
              if (instruction.skipActivation || typeof instruction.viewModel.activate !== "function") {
                return Promise.resolve();
              }
              return instruction.viewModel.activate(instruction.model) || Promise.resolve();
            },
            writable: true,
            configurable: true
          },
          createBehaviorAndSwap: {
            value: function createBehaviorAndSwap(instruction) {
              return this.createBehavior(instruction).then(function(behavior) {
                behavior.view.bind(behavior.executionContext);
                instruction.viewSlot.swap(behavior.view);
                if (instruction.currentBehavior) {
                  instruction.currentBehavior.unbind();
                }
                return behavior;
              });
            },
            writable: true,
            configurable: true
          },
          createBehavior: {
            value: function createBehavior(instruction) {
              var childContainer = instruction.childContainer,
                  viewModelInfo = instruction.viewModelInfo,
                  viewModel = instruction.viewModel;
              return this.activate(instruction).then(function() {
                var doneLoading,
                    viewStrategyFromViewModel,
                    origin;
                if ("getViewStrategy" in viewModel && !instruction.view) {
                  viewStrategyFromViewModel = true;
                  instruction.view = ViewStrategy.normalize(viewModel.getViewStrategy());
                }
                if (instruction.view) {
                  if (viewStrategyFromViewModel) {
                    origin = Origin.get(viewModel.constructor);
                    if (origin) {
                      instruction.view.makeRelativeTo(origin.moduleId);
                    }
                  } else if (instruction.viewResources) {
                    instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
                  }
                }
                if (viewModelInfo) {
                  doneLoading = viewModelInfo.type.load(childContainer, viewModelInfo.value, instruction.view);
                } else {
                  doneLoading = new CustomElement().load(childContainer, viewModel.constructor, instruction.view);
                }
                return doneLoading.then(function(behaviorType) {
                  return behaviorType.create(childContainer, {
                    executionContext: viewModel,
                    suppressBind: true
                  });
                });
              });
            },
            writable: true,
            configurable: true
          },
          createViewModel: {
            value: function createViewModel(instruction) {
              var childContainer = instruction.childContainer || instruction.container.createChild();
              instruction.viewModel = instruction.viewResources ? instruction.viewResources.relativeToView(instruction.viewModel) : instruction.viewModel;
              return this.resourceCoordinator.loadViewModelInfo(instruction.viewModel).then(function(viewModelInfo) {
                childContainer.autoRegister(viewModelInfo.value);
                instruction.viewModel = childContainer.viewModel = childContainer.get(viewModelInfo.value);
                instruction.viewModelInfo = viewModelInfo;
                return instruction;
              });
            },
            writable: true,
            configurable: true
          },
          compose: {
            value: function compose(instruction) {
              var _this = this;
              instruction.childContainer = instruction.childContainer || instruction.container.createChild();
              instruction.view = ViewStrategy.normalize(instruction.view);
              if (instruction.viewModel) {
                if (typeof instruction.viewModel === "string") {
                  return this.createViewModel(instruction).then(function(instruction) {
                    return _this.createBehaviorAndSwap(instruction);
                  });
                } else {
                  return this.createBehaviorAndSwap(instruction);
                }
              } else if (instruction.view) {
                if (instruction.viewResources) {
                  instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
                }
                return instruction.view.loadViewFactory(this.viewEngine).then(function(viewFactory) {
                  var result = viewFactory.create(instruction.childContainer, instruction.executionContext);
                  instruction.viewSlot.swap(result);
                  return result;
                });
              } else if (instruction.viewSlot) {
                instruction.viewSlot.removeAll();
                return Promise.resolve(null);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return CompositionEngine;
      })());
    }
  };
});

System.register("github:aurelia/framework@0.8.6/system/plugins", ["aurelia-logging", "aurelia-metadata"], function(_export) {
  "use strict";
  var LogManager,
      Metadata,
      _prototypeProperties,
      logger,
      Plugins;
  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");
    aurelia.currentPluginId = info.moduleId;
    var baseUrl = info.moduleId.startsWith("./") ? undefined : "";
    return loader.loadModule(info.moduleId, baseUrl).then(function(exportedValue) {
      if ("install" in exportedValue) {
        var result = exportedValue.install(aurelia, info.config || {});
        if (result) {
          return result.then(function() {
            aurelia.currentPluginId = null;
            logger.debug("Installed plugin " + info.moduleId + ".");
          });
        } else {
          logger.debug("Installed plugin " + info.moduleId + ".");
        }
      } else {
        logger.debug("Loaded plugin " + info.moduleId + ".");
      }
      aurelia.currentPluginId = null;
    });
  }
  return {
    setters: [function(_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      logger = LogManager.getLogger("aurelia");
      Plugins = _export("Plugins", (function() {
        function Plugins(aurelia) {
          this.aurelia = aurelia;
          this.info = [];
          this.processed = false;
        }
        _prototypeProperties(Plugins, null, {
          plugin: {
            value: function plugin(moduleId, config) {
              var plugin = {
                moduleId: moduleId,
                config: config || {}
              };
              if (this.processed) {
                loadPlugin(this.aurelia, this.aurelia.loader, plugin);
              } else {
                this.info.push(plugin);
              }
              return this;
            },
            writable: true,
            configurable: true
          },
          es5: {
            value: function es5() {
              Function.prototype.computed = function(computedProperties) {
                for (var key in computedProperties) {
                  if (computedProperties.hasOwnProperty(key)) {
                    Object.defineProperty(this.prototype, key, {
                      get: computedProperties[key],
                      enumerable: true
                    });
                  }
                }
              };
              return this;
            },
            writable: true,
            configurable: true
          },
          atscript: {
            value: function atscript() {
              this.aurelia.container.supportAtScript();
              Metadata.configure.locator(function(fn) {
                return fn.annotate || fn.annotations;
              });
              return this;
            },
            writable: true,
            configurable: true
          },
          _process: {
            value: function _process() {
              var _this = this;
              var aurelia = this.aurelia,
                  loader = aurelia.loader,
                  info = this.info,
                  current;
              if (this.processed) {
                return ;
              }
              var next = function() {
                if (current = info.shift()) {
                  return loadPlugin(aurelia, loader, current).then(next);
                }
                _this.processed = true;
                return Promise.resolve();
              };
              return next();
            },
            writable: true,
            configurable: true
          }
        });
        return Plugins;
      })());
    }
  };
});

System.register("github:aurelia/logging-console@0.2.2/system/index", [], function(_export) {
  "use strict";
  var _toArray,
      _prototypeProperties,
      ConsoleAppender;
  return {
    setters: [],
    execute: function() {
      _toArray = function(arr) {
        return Array.isArray(arr) ? arr : Array.from(arr);
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ConsoleAppender = (function() {
        function ConsoleAppender() {}
        _prototypeProperties(ConsoleAppender, null, {
          debug: {
            value: function debug(logger, message) {
              for (var _len = arguments.length,
                  rest = Array(_len > 2 ? _len - 2 : 0),
                  _key = 2; _key < _len; _key++) {
                rest[_key - 2] = arguments[_key];
              }
              console.debug.apply(console, ["DEBUG [" + logger.id + "] " + message].concat(_toArray(rest)));
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          info: {
            value: function info(logger, message) {
              for (var _len2 = arguments.length,
                  rest = Array(_len2 > 2 ? _len2 - 2 : 0),
                  _key2 = 2; _key2 < _len2; _key2++) {
                rest[_key2 - 2] = arguments[_key2];
              }
              console.info.apply(console, ["INFO [" + logger.id + "] " + message].concat(_toArray(rest)));
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          warn: {
            value: function warn(logger, message) {
              for (var _len3 = arguments.length,
                  rest = Array(_len3 > 2 ? _len3 - 2 : 0),
                  _key3 = 2; _key3 < _len3; _key3++) {
                rest[_key3 - 2] = arguments[_key3];
              }
              console.warn.apply(console, ["WARN [" + logger.id + "] " + message].concat(_toArray(rest)));
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          error: {
            value: function error(logger, message) {
              for (var _len4 = arguments.length,
                  rest = Array(_len4 > 2 ? _len4 - 2 : 0),
                  _key4 = 2; _key4 < _len4; _key4++) {
                rest[_key4 - 2] = arguments[_key4];
              }
              console.error.apply(console, ["ERROR [" + logger.id + "] " + message].concat(_toArray(rest)));
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return ConsoleAppender;
      })();
      _export("ConsoleAppender", ConsoleAppender);
    }
  };
});

System.register("github:aurelia/templating-binding@0.8.4/system/syntax-interpreter", ["aurelia-binding"], function(_export) {
  "use strict";
  var Parser,
      ObserverLocator,
      EventManager,
      ListenerExpression,
      BindingExpression,
      NameExpression,
      CallExpression,
      ONE_WAY,
      TWO_WAY,
      ONE_TIME,
      _prototypeProperties,
      SyntaxInterpreter;
  return {
    setters: [function(_aureliaBinding) {
      Parser = _aureliaBinding.Parser;
      ObserverLocator = _aureliaBinding.ObserverLocator;
      EventManager = _aureliaBinding.EventManager;
      ListenerExpression = _aureliaBinding.ListenerExpression;
      BindingExpression = _aureliaBinding.BindingExpression;
      NameExpression = _aureliaBinding.NameExpression;
      CallExpression = _aureliaBinding.CallExpression;
      ONE_WAY = _aureliaBinding.ONE_WAY;
      TWO_WAY = _aureliaBinding.TWO_WAY;
      ONE_TIME = _aureliaBinding.ONE_TIME;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      SyntaxInterpreter = (function() {
        function SyntaxInterpreter(parser, observerLocator, eventManager) {
          this.parser = parser;
          this.observerLocator = observerLocator;
          this.eventManager = eventManager;
        }
        _prototypeProperties(SyntaxInterpreter, {inject: {
            value: function inject() {
              return [Parser, ObserverLocator, EventManager];
            },
            writable: true,
            enumerable: true,
            configurable: true
          }}, {
          interpret: {
            value: function interpret(resources, element, info, existingInstruction) {
              if (info.command in this) {
                return this[info.command](resources, element, info, existingInstruction);
              }
              return this.handleUnknownCommand(resources, element, info, existingInstruction);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          handleUnknownCommand: {
            value: function handleUnknownCommand(resources, element, info, existingInstruction) {
              var attrName = info.attrName,
                  command = info.command;
              var instruction = this.options(resources, element, info, existingInstruction);
              instruction.alteredAttr = true;
              instruction.attrName = "global-behavior";
              instruction.attributes.aureliaAttrName = attrName;
              instruction.attributes.aureliaCommand = command;
              return instruction;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          determineDefaultBindingMode: {
            value: function determineDefaultBindingMode(element, attrName) {
              var tagName = element.tagName.toLowerCase();
              if (tagName === "input") {
                return attrName === "value" || attrName === "checked" ? TWO_WAY : ONE_WAY;
              } else if (tagName == "textarea" || tagName == "select") {
                return attrName == "value" ? TWO_WAY : ONE_WAY;
              }
              return ONE_WAY;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          bind: {
            value: function bind(resources, element, info, existingInstruction) {
              var instruction = existingInstruction || {
                attrName: info.attrName,
                attributes: {}
              };
              instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), info.defaultBindingMode || this.determineDefaultBindingMode(element, info.attrName), resources.valueConverterLookupFunction);
              return instruction;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          trigger: {
            value: function trigger(resources, element, info) {
              return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), false, true);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          delegate: {
            value: function delegate(resources, element, info) {
              return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), true, true);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          call: {
            value: function call(resources, element, info, existingInstruction) {
              var instruction = existingInstruction || {
                attrName: info.attrName,
                attributes: {}
              };
              instruction.attributes[info.attrName] = new CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.valueConverterLookupFunction);
              return instruction;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          options: {
            value: function options(resources, element, info, existingInstruction) {
              var instruction = existingInstruction || {
                attrName: info.attrName,
                attributes: {}
              },
                  attrValue = info.attrValue,
                  language = this.language,
                  name = null,
                  target = "",
                  current,
                  i,
                  ii;
              for (i = 0, ii = attrValue.length; i < ii; ++i) {
                current = attrValue[i];
                if (current === ";") {
                  info = language.inspectAttribute(resources, name, target.trim());
                  language.createAttributeInstruction(resources, element, info, instruction);
                  if (!instruction.attributes[info.attrName]) {
                    instruction.attributes[info.attrName] = info.attrValue;
                  }
                  target = "";
                  name = null;
                } else if (current === ":" && name === null) {
                  name = target.trim();
                  target = "";
                } else {
                  target += current;
                }
              }
              if (name !== null) {
                info = language.inspectAttribute(resources, name, target.trim());
                language.createAttributeInstruction(resources, element, info, instruction);
                if (!instruction.attributes[info.attrName]) {
                  instruction.attributes[info.attrName] = info.attrValue;
                }
              }
              return instruction;
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return SyntaxInterpreter;
      })();
      _export("SyntaxInterpreter", SyntaxInterpreter);
      SyntaxInterpreter.prototype["for"] = function(resources, element, info, existingInstruction) {
        var parts = info.attrValue.split(" of ");
        if (parts.length !== 2) {
          throw new Error("Incorrect syntax for \"for\". The form is: \"$local of $items\".");
        }
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        };
        instruction.attributes.local = parts[0];
        instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, info.attrName, this.parser.parse(parts[1]), ONE_WAY, resources.valueConverterLookupFunction);
        return instruction;
      };
      SyntaxInterpreter.prototype["two-way"] = function(resources, element, info, existingInstruction) {
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        };
        instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), TWO_WAY, resources.valueConverterLookupFunction);
        return instruction;
      };
      SyntaxInterpreter.prototype["one-way"] = function(resources, element, info, existingInstruction) {
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        };
        instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), ONE_WAY, resources.valueConverterLookupFunction);
        return instruction;
      };
      SyntaxInterpreter.prototype["one-time"] = function(resources, element, info, existingInstruction) {
        var instruction = existingInstruction || {
          attrName: info.attrName,
          attributes: {}
        };
        instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), ONE_TIME, resources.valueConverterLookupFunction);
        return instruction;
      };
      SyntaxInterpreter.prototype["view-model"] = function(resources, element, info) {
        return new NameExpression(info.attrValue, "view-model");
      };
    }
  };
});

System.register("github:aurelia/route-recognizer@0.2.2/system/dsl", [], function(_export) {
  "use strict";
  _export("map", map);
  function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }
  function Matcher(target) {
    this.routes = {};
    this.children = {};
    this.target = target;
  }
  function generateMatch(startingPath, matcher, delegate) {
    return function(path, nestedCallback) {
      var fullPath = startingPath + path;
      if (nestedCallback) {
        nestedCallback(generateMatch(fullPath, matcher, delegate));
      } else {
        return new Target(startingPath + path, matcher, delegate);
      }
    };
  }
  function addRoute(routeArray, path, handler) {
    var len = 0;
    for (var i = 0,
        l = routeArray.length; i < l; i++) {
      len += routeArray[i].path.length;
    }
    path = path.substr(len);
    var route = {
      path: path,
      handler: handler
    };
    routeArray.push(route);
  }
  function eachRoute(baseRoute, matcher, callback, binding) {
    var routes = matcher.routes;
    for (var path in routes) {
      if (routes.hasOwnProperty(path)) {
        var routeArray = baseRoute.slice();
        addRoute(routeArray, path, routes[path]);
        if (matcher.children[path]) {
          eachRoute(routeArray, matcher.children[path], callback, binding);
        } else {
          callback.call(binding, routeArray);
        }
      }
    }
  }
  function map(callback, addRouteCallback) {
    var matcher = new Matcher();
    callback(generateMatch("", matcher, this.delegate));
    eachRoute([], matcher, function(route) {
      if (addRouteCallback) {
        addRouteCallback(this, route);
      } else {
        this.add(route);
      }
    }, this);
  }
  return {
    setters: [],
    execute: function() {
      Target.prototype = {to: function(target, callback) {
          var delegate = this.delegate;
          if (delegate && delegate.willAddRoute) {
            target = delegate.willAddRoute(this.matcher.target, target);
          }
          this.matcher.add(this.path, target);
          if (callback) {
            if (callback.length === 0) {
              throw new Error("You must have an argument in the function passed to `to`");
            }
            this.matcher.addChild(this.path, target, callback, this.delegate);
          }
          return this;
        }};
      Matcher.prototype = {
        add: function(path, handler) {
          this.routes[path] = handler;
        },
        addChild: function(path, target, callback, delegate) {
          var matcher = new Matcher(target);
          this.children[path] = matcher;
          var match = generateMatch(path, matcher, delegate);
          if (delegate && delegate.contextEntered) {
            delegate.contextEntered(target, match);
          }
          callback(match);
        }
      };
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/navigation-plan", [], function(_export) {
  "use strict";
  var _toArray,
      _prototypeProperties,
      NO_CHANGE,
      INVOKE_LIFECYCLE,
      REPLACE,
      BuildNavigationPlanStep;
  _export("buildNavigationPlan", buildNavigationPlan);
  function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
    var prev = navigationContext.prevInstruction;
    var next = navigationContext.nextInstruction;
    var plan = {},
        viewPortName;
    if (prev) {
      var newParams = hasDifferentParameterValues(prev, next);
      var pending = [];
      for (viewPortName in prev.viewPortInstructions) {
        var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
        var nextViewPortConfig = next.config.viewPorts[viewPortName];
        var viewPortPlan = plan[viewPortName] = {
          name: viewPortName,
          config: nextViewPortConfig,
          prevComponent: prevViewPortInstruction.component,
          prevModuleId: prevViewPortInstruction.moduleId
        };
        if (prevViewPortInstruction.moduleId != nextViewPortConfig.moduleId) {
          viewPortPlan.strategy = REPLACE;
        } else if ("determineActivationStrategy" in prevViewPortInstruction.component.executionContext) {
          var _prevViewPortInstruction$component$executionContext;
          viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, _toArray(next.lifecycleArgs));
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = INVOKE_LIFECYCLE;
        } else {
          viewPortPlan.strategy = NO_CHANGE;
        }
        if (viewPortPlan.strategy !== REPLACE && prevViewPortInstruction.childRouter) {
          var path = next.getWildcardPath();
          var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then(function(childInstruction) {
            viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);
            return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == INVOKE_LIFECYCLE).then(function(childPlan) {
              viewPortPlan.childNavigationContext.plan = childPlan;
            });
          });
          pending.push(task);
        }
      }
      return Promise.all(pending).then(function() {
        return plan;
      });
    } else {
      for (viewPortName in next.config.viewPorts) {
        plan[viewPortName] = {
          name: viewPortName,
          strategy: REPLACE,
          config: next.config.viewPorts[viewPortName]
        };
      }
      return Promise.resolve(plan);
    }
  }
  function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params,
        nextParams = next.params,
        nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;
    for (var key in nextParams) {
      if (key == nextWildCardName) {
        continue;
      }
      if (prevParams[key] != nextParams[key]) {
        return true;
      }
    }
    return false;
  }
  return {
    setters: [],
    execute: function() {
      _toArray = function(arr) {
        return Array.isArray(arr) ? arr : Array.from(arr);
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      NO_CHANGE = _export("NO_CHANGE", "no-change");
      INVOKE_LIFECYCLE = _export("INVOKE_LIFECYCLE", "invoke-lifecycle");
      REPLACE = _export("REPLACE", "replace");
      BuildNavigationPlanStep = _export("BuildNavigationPlanStep", (function() {
        function BuildNavigationPlanStep() {}
        _prototypeProperties(BuildNavigationPlanStep, null, {run: {
            value: function run(navigationContext, next) {
              return buildNavigationPlan(navigationContext).then(function(plan) {
                navigationContext.plan = plan;
                return next();
              })["catch"](next.cancel);
            },
            writable: true,
            configurable: true
          }});
        return BuildNavigationPlanStep;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/navigation-instruction", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      NavigationInstruction;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      NavigationInstruction = _export("NavigationInstruction", (function() {
        function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
          this.fragment = fragment;
          this.queryString = queryString;
          this.params = params || {};
          this.queryParams = queryParams;
          this.config = config;
          this.lifecycleArgs = [params, queryParams, config];
          this.viewPortInstructions = {};
          if (parentInstruction) {
            this.params.$parent = parentInstruction.params;
          }
        }
        _prototypeProperties(NavigationInstruction, null, {
          addViewPortInstruction: {
            value: function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
              return this.viewPortInstructions[viewPortName] = {
                name: viewPortName,
                strategy: strategy,
                moduleId: moduleId,
                component: component,
                childRouter: component.executionContext.router,
                lifecycleArgs: this.lifecycleArgs.slice()
              };
            },
            writable: true,
            configurable: true
          },
          getWildCardName: {
            value: function getWildCardName() {
              var wildcardIndex = this.config.route.lastIndexOf("*");
              return this.config.route.substr(wildcardIndex + 1);
            },
            writable: true,
            configurable: true
          },
          getWildcardPath: {
            value: function getWildcardPath() {
              var wildcardName = this.getWildCardName(),
                  path = this.params[wildcardName];
              if (this.queryString) {
                path += "?" + this.queryString;
              }
              return path;
            },
            writable: true,
            configurable: true
          },
          getBaseUrl: {
            value: function getBaseUrl() {
              if (!this.params) {
                return this.fragment;
              }
              var wildcardName = this.getWildCardName(),
                  path = this.params[wildcardName];
              if (!path) {
                return this.fragment;
              }
              return this.fragment.substr(0, this.fragment.lastIndexOf(path));
            },
            writable: true,
            configurable: true
          }
        });
        return NavigationInstruction;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/router-configuration", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      RouterConfiguration;
  function ensureConfigValue(config, property, getter) {
    var value = config[property];
    if (value || value === "") {
      return value;
    }
    return getter(config);
  }
  function stripParametersFromRoute(route) {
    var colonIndex = route.indexOf(":");
    var length = colonIndex > 0 ? colonIndex - 1 : route.length;
    return route.substr(0, length);
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      RouterConfiguration = _export("RouterConfiguration", (function() {
        function RouterConfiguration() {
          this.instructions = [];
          this.options = {};
        }
        _prototypeProperties(RouterConfiguration, null, {
          map: {
            value: function map(route, config) {
              if (Array.isArray(route)) {
                for (var i = 0; i < route.length; i++) {
                  this.map(route[i]);
                }
                return this;
              }
              if (typeof route == "string") {
                if (!config) {
                  config = {};
                } else if (typeof config == "string") {
                  config = {moduleId: config};
                }
                config.route = route;
              } else {
                config = route;
              }
              return this.mapRoute(config);
            },
            writable: true,
            configurable: true
          },
          mapRoute: {
            value: function mapRoute(config) {
              var _this = this;
              this.instructions.push(function(router) {
                if (Array.isArray(config.route)) {
                  var navModel = {},
                      i,
                      ii,
                      current;
                  for (i = 0, ii = config.route.length; i < ii; ++i) {
                    current = Object.assign({}, config);
                    current.route = config.route[i];
                    _this.configureRoute(router, current, navModel);
                  }
                } else {
                  _this.configureRoute(router, Object.assign({}, config));
                }
              });
              return this;
            },
            writable: true,
            configurable: true
          },
          mapUnknownRoutes: {
            value: function mapUnknownRoutes(config) {
              this.unknownRouteConfig = config;
              return this;
            },
            writable: true,
            configurable: true
          },
          exportToRouter: {
            value: function exportToRouter(router) {
              var instructions = this.instructions,
                  i,
                  ii;
              for (i = 0, ii = instructions.length; i < ii; ++i) {
                instructions[i](router);
              }
              if (this.title) {
                router.title = this.title;
              }
              if (this.unknownRouteConfig) {
                router.handleUnknownRoutes(this.unknownRouteConfig);
              }
              router.options = this.options;
            },
            writable: true,
            configurable: true
          },
          configureRoute: {
            value: function configureRoute(router, config, navModel) {
              this.ensureDefaultsForRouteConfig(config);
              router.addRoute(config, navModel);
            },
            writable: true,
            configurable: true
          },
          ensureDefaultsForRouteConfig: {
            value: function ensureDefaultsForRouteConfig(config) {
              config.name = ensureConfigValue(config, "name", this.deriveName);
              config.route = ensureConfigValue(config, "route", this.deriveRoute);
              config.title = ensureConfigValue(config, "title", this.deriveTitle);
              config.moduleId = ensureConfigValue(config, "moduleId", this.deriveModuleId);
            },
            writable: true,
            configurable: true
          },
          deriveName: {
            value: function deriveName(config) {
              return config.title || (config.route ? stripParametersFromRoute(config.route) : config.moduleId);
            },
            writable: true,
            configurable: true
          },
          deriveRoute: {
            value: function deriveRoute(config) {
              return config.moduleId || config.name;
            },
            writable: true,
            configurable: true
          },
          deriveTitle: {
            value: function deriveTitle(config) {
              var value = config.name;
              return value.substr(0, 1).toUpperCase() + value.substr(1);
            },
            writable: true,
            configurable: true
          },
          deriveModuleId: {
            value: function deriveModuleId(config) {
              return stripParametersFromRoute(config.route);
            },
            writable: true,
            configurable: true
          }
        });
        return RouterConfiguration;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/util", [], function(_export) {
  "use strict";
  _export("processPotential", processPotential);
  function processPotential(obj, resolve, reject) {
    if (obj && typeof obj.then === "function") {
      var dfd = obj.then(resolve);
      if (typeof dfd["catch"] === "function") {
        return dfd["catch"](reject);
      } else if (typeof dfd.fail === "function") {
        return dfd.fail(reject);
      }
      return dfd;
    } else {
      try {
        return resolve(obj);
      } catch (error) {
        return reject(error);
      }
    }
  }
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("github:aurelia/history@0.2.2/system/index", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      History;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      History = (function() {
        function History() {}
        _prototypeProperties(History, null, {
          activate: {
            value: function activate() {
              throw new Error("History must implement activate().");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {
              throw new Error("History must implement deactivate().");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          navigate: {
            value: function navigate() {
              throw new Error("History must implement navigate().");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          navigateBack: {
            value: function navigateBack() {
              throw new Error("History must implement navigateBack().");
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return History;
      })();
      _export("History", History);
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/pipeline", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      COMPLETED,
      CANCELLED,
      REJECTED,
      RUNNING,
      Pipeline;
  function createResult(ctx, next) {
    return {
      status: next.status,
      context: ctx,
      output: next.output,
      completed: next.status == COMPLETED
    };
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      COMPLETED = _export("COMPLETED", "completed");
      CANCELLED = _export("CANCELLED", "cancelled");
      REJECTED = _export("REJECTED", "rejected");
      RUNNING = _export("RUNNING", "running");
      Pipeline = _export("Pipeline", (function() {
        function Pipeline() {
          this.steps = [];
        }
        _prototypeProperties(Pipeline, null, {
          withStep: {
            value: function withStep(step) {
              var run;
              if (typeof step == "function") {
                run = step;
              } else {
                run = step.run.bind(step);
              }
              this.steps.push(run);
              return this;
            },
            writable: true,
            configurable: true
          },
          run: {
            value: function run(ctx) {
              var index = -1,
                  steps = this.steps,
                  next,
                  currentStep;
              next = function() {
                index++;
                if (index < steps.length) {
                  currentStep = steps[index];
                  try {
                    return currentStep(ctx, next);
                  } catch (e) {
                    return next.reject(e);
                  }
                } else {
                  return next.complete();
                }
              };
              next.complete = function(output) {
                next.status = COMPLETED;
                next.output = output;
                return Promise.resolve(createResult(ctx, next));
              };
              next.cancel = function(reason) {
                next.status = CANCELLED;
                next.output = reason;
                return Promise.resolve(createResult(ctx, next));
              };
              next.reject = function(error) {
                next.status = REJECTED;
                next.output = error;
                return Promise.reject(createResult(ctx, next));
              };
              next.status = RUNNING;
              return next();
            },
            writable: true,
            configurable: true
          }
        });
        return Pipeline;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/model-binding", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      ApplyModelBindersStep;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      ApplyModelBindersStep = _export("ApplyModelBindersStep", (function() {
        function ApplyModelBindersStep() {}
        _prototypeProperties(ApplyModelBindersStep, null, {run: {
            value: function run(navigationContext, next) {
              return next();
            },
            writable: true,
            configurable: true
          }});
        return ApplyModelBindersStep;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/route-loading", ["./navigation-plan"], function(_export) {
  "use strict";
  var REPLACE,
      buildNavigationPlan,
      _prototypeProperties,
      RouteLoader,
      LoadRouteStep;
  _export("loadNewRoute", loadNewRoute);
  function loadNewRoute(routers, routeLoader, navigationContext) {
    var toLoad = determineWhatToLoad(navigationContext);
    var loadPromises = toLoad.map(function(current) {
      return loadRoute(routers, routeLoader, current.navigationContext, current.viewPortPlan);
    });
    return Promise.all(loadPromises);
  }
  function determineWhatToLoad(navigationContext, toLoad) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;
    toLoad = toLoad || [];
    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      if (viewPortPlan.strategy == REPLACE) {
        toLoad.push({
          viewPortPlan: viewPortPlan,
          navigationContext: navigationContext
        });
        if (viewPortPlan.childNavigationContext) {
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      } else {
        var viewPortInstruction = next.addViewPortInstruction(viewPortName, viewPortPlan.strategy, viewPortPlan.prevModuleId, viewPortPlan.prevComponent);
        if (viewPortPlan.childNavigationContext) {
          viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      }
    }
    return toLoad;
  }
  function loadRoute(routers, routeLoader, navigationContext, viewPortPlan) {
    var moduleId = viewPortPlan.config.moduleId;
    var next = navigationContext.nextInstruction;
    routers.push(navigationContext.router);
    return loadComponent(routeLoader, navigationContext.router, viewPortPlan.config).then(function(component) {
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);
      var controller = component.executionContext;
      if (controller.router && routers.indexOf(controller.router) === -1) {
        var path = next.getWildcardPath();
        return controller.router.createNavigationInstruction(path, next).then(function(childInstruction) {
          viewPortPlan.childNavigationContext = controller.router.createNavigationContext(childInstruction);
          return buildNavigationPlan(viewPortPlan.childNavigationContext).then(function(childPlan) {
            viewPortPlan.childNavigationContext.plan = childPlan;
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
            return loadNewRoute(routers, routeLoader, viewPortPlan.childNavigationContext);
          });
        });
      }
    });
  }
  function loadComponent(routeLoader, router, config) {
    return routeLoader.loadRoute(router, config).then(function(component) {
      if ("configureRouter" in component.executionContext) {
        var result = component.executionContext.configureRouter() || Promise.resolve();
        return result.then(function() {
          return component;
        });
      }
      component.router = router;
      component.config = config;
      return component;
    });
  }
  return {
    setters: [function(_navigationPlan) {
      REPLACE = _navigationPlan.REPLACE;
      buildNavigationPlan = _navigationPlan.buildNavigationPlan;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      RouteLoader = _export("RouteLoader", (function() {
        function RouteLoader() {}
        _prototypeProperties(RouteLoader, null, {loadRoute: {
            value: function loadRoute(router, config) {
              throw Error("Route loaders must implment \"loadRoute(router, config)\".");
            },
            writable: true,
            configurable: true
          }});
        return RouteLoader;
      })());
      LoadRouteStep = _export("LoadRouteStep", (function() {
        function LoadRouteStep(routeLoader) {
          this.routeLoader = routeLoader;
        }
        _prototypeProperties(LoadRouteStep, {inject: {
            value: function inject() {
              return [RouteLoader];
            },
            writable: true,
            configurable: true
          }}, {run: {
            value: function run(navigationContext, next) {
              return loadNewRoute([], this.routeLoader, navigationContext).then(next)["catch"](next.cancel);
            },
            writable: true,
            configurable: true
          }});
        return LoadRouteStep;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/navigation-commands", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      Redirect;
  _export("isNavigationCommand", isNavigationCommand);
  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === "function";
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Redirect = _export("Redirect", (function() {
        function Redirect(url) {
          this.url = url;
          this.shouldContinueProcessing = false;
        }
        _prototypeProperties(Redirect, null, {navigate: {
            value: function navigate(appRouter) {
              (this.router || appRouter).navigate(this.url, {
                trigger: true,
                replace: true
              });
            },
            writable: true,
            configurable: true
          }});
        return Redirect;
      })());
    }
  };
});

System.register("github:aurelia/templating-router@0.9.2/system/route-loader", ["aurelia-templating", "aurelia-router", "aurelia-path", "aurelia-metadata"], function(_export) {
  "use strict";
  var CompositionEngine,
      RouteLoader,
      Router,
      relativeToFile,
      Origin,
      _prototypeProperties,
      _inherits,
      TemplatingRouteLoader;
  return {
    setters: [function(_aureliaTemplating) {
      CompositionEngine = _aureliaTemplating.CompositionEngine;
    }, function(_aureliaRouter) {
      RouteLoader = _aureliaRouter.RouteLoader;
      Router = _aureliaRouter.Router;
    }, function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }, function(_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      TemplatingRouteLoader = (function(RouteLoader) {
        function TemplatingRouteLoader(compositionEngine) {
          this.compositionEngine = compositionEngine;
        }
        _inherits(TemplatingRouteLoader, RouteLoader);
        _prototypeProperties(TemplatingRouteLoader, {inject: {
            value: function inject() {
              return [CompositionEngine];
            },
            writable: true,
            enumerable: true,
            configurable: true
          }}, {loadRoute: {
            value: function loadRoute(router, config) {
              var childContainer = router.container.createChild(),
                  instruction = {
                    viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
                    childContainer: childContainer,
                    view: config.view
                  },
                  childRouter;
              childContainer.registerHandler(Router, function(c) {
                return childRouter || (childRouter = router.createChild(childContainer));
              });
              return this.compositionEngine.createViewModel(instruction).then(function(instruction) {
                instruction.executionContext = instruction.viewModel;
                instruction.router = router;
                return instruction;
              });
            },
            writable: true,
            enumerable: true,
            configurable: true
          }});
        return TemplatingRouteLoader;
      })(RouteLoader);
      _export("TemplatingRouteLoader", TemplatingRouteLoader);
    }
  };
});

System.register("github:aurelia/templating-router@0.9.2/system/router-view", ["aurelia-dependency-injection", "aurelia-templating", "aurelia-router", "aurelia-metadata"], function(_export) {
  "use strict";
  var Container,
      ViewSlot,
      ViewStrategy,
      Router,
      Metadata,
      Origin,
      _prototypeProperties,
      RouterView;
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaTemplating) {
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewStrategy = _aureliaTemplating.ViewStrategy;
    }, function(_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      RouterView = (function() {
        function RouterView(element, container, viewSlot, router) {
          this.element = element;
          this.container = container;
          this.viewSlot = viewSlot;
          this.router = router;
          router.registerViewPort(this, element.getAttribute("name"));
        }
        _prototypeProperties(RouterView, {
          metadata: {
            value: function metadata() {
              return Metadata.customElement("router-view").noView();
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element, Container, ViewSlot, Router];
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        }, {
          process: {
            value: function process(viewPortInstruction, waitToSwap) {
              var _this = this;
              var component = viewPortInstruction.component,
                  viewStrategy = component.view,
                  viewModelInfo = component.viewModelInfo,
                  childContainer = component.childContainer,
                  viewModel = component.executionContext;
              if (!viewStrategy && "getViewStrategy" in viewModel) {
                viewStrategy = viewModel.getViewStrategy();
              }
              if (viewStrategy) {
                viewStrategy = ViewStrategy.normalize(viewStrategy);
                viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
              }
              return viewModelInfo.type.load(childContainer, viewModelInfo.value, viewStrategy).then(function(behaviorType) {
                viewPortInstruction.behavior = behaviorType.create(childContainer, {
                  executionContext: viewModel,
                  suppressBind: true
                });
                if (waitToSwap) {
                  return ;
                }
                _this.swap(viewPortInstruction);
              });
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          swap: {
            value: function swap(viewPortInstruction) {
              viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
              this.viewSlot.swap(viewPortInstruction.behavior.view);
              if (this.view) {
                this.view.unbind();
              }
              this.view = viewPortInstruction.behavior.view;
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return RouterView;
      })();
      _export("RouterView", RouterView);
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/compose", ["aurelia-dependency-injection", "aurelia-templating"], function(_export) {
  "use strict";
  var Container,
      Behavior,
      CompositionEngine,
      ViewSlot,
      ViewResources,
      _prototypeProperties,
      Compose;
  function processInstruction(composer, instruction) {
    composer.compositionEngine.compose(Object.assign(instruction, {
      executionContext: composer.executionContext,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentBehavior: composer.current
    })).then(function(next) {
      composer.current = next;
    });
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
      CompositionEngine = _aureliaTemplating.CompositionEngine;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ViewResources = _aureliaTemplating.ViewResources;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Compose = _export("Compose", (function() {
        function Compose(container, compositionEngine, viewSlot, viewResources) {
          this.container = container;
          this.compositionEngine = compositionEngine;
          this.viewSlot = viewSlot;
          this.viewResources = viewResources;
        }
        _prototypeProperties(Compose, {
          metadata: {
            value: function metadata() {
              return Behavior.customElement("compose").withProperty("model").withProperty("view").withProperty("viewModel").noView();
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Container, CompositionEngine, ViewSlot, ViewResources];
            },
            writable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function bind(executionContext) {
              this.executionContext = executionContext;
              processInstruction(this, {
                view: this.view,
                viewModel: this.viewModel,
                model: this.model
              });
            },
            writable: true,
            configurable: true
          },
          modelChanged: {
            value: function modelChanged(newValue, oldValue) {
              if (this.viewModel && typeof this.viewModel.activate === "function") {
                this.viewModel.activate(newValue);
              }
            },
            writable: true,
            configurable: true
          },
          viewChanged: {
            value: function viewChanged(newValue, oldValue) {
              processInstruction(this, {
                view: newValue,
                viewModel: this.viewModel,
                model: this.model
              });
            },
            writable: true,
            configurable: true
          },
          viewModelChanged: {
            value: function viewModelChanged(newValue, oldValue) {
              processInstruction(this, {
                viewModel: newValue,
                view: this.view,
                model: this.model
              });
            },
            writable: true,
            configurable: true
          }
        });
        return Compose;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/if", ["aurelia-templating"], function(_export) {
  "use strict";
  var Behavior,
      BoundViewFactory,
      ViewSlot,
      _prototypeProperties,
      If;
  return {
    setters: [function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      If = _export("If", (function() {
        function If(viewFactory, viewSlot) {
          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.showing = false;
        }
        _prototypeProperties(If, {
          metadata: {
            value: function metadata() {
              return Behavior.templateController("if").withProperty("value", "valueChanged", "if");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [BoundViewFactory, ViewSlot];
            },
            writable: true,
            configurable: true
          }
        }, {valueChanged: {
            value: function valueChanged(newValue) {
              if (!newValue) {
                if (this.view) {
                  this.viewSlot.remove(this.view);
                  this.view.unbind();
                }
                this.showing = false;
                return ;
              }
              if (!this.view) {
                this.view = this.viewFactory.create();
              }
              if (!this.showing) {
                this.showing = true;
                if (!this.view.bound) {
                  this.view.bind();
                }
                this.viewSlot.add(this.view);
              }
            },
            writable: true,
            configurable: true
          }});
        return If;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/repeat", ["aurelia-binding", "aurelia-templating"], function(_export) {
  "use strict";
  var ObserverLocator,
      calcSplices,
      Behavior,
      BoundViewFactory,
      ViewSlot,
      _prototypeProperties,
      Repeat;
  return {
    setters: [function(_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
      calcSplices = _aureliaBinding.calcSplices;
    }, function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
      BoundViewFactory = _aureliaTemplating.BoundViewFactory;
      ViewSlot = _aureliaTemplating.ViewSlot;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Repeat = _export("Repeat", (function() {
        function Repeat(viewFactory, viewSlot, observerLocator) {
          this.viewFactory = viewFactory;
          this.viewSlot = viewSlot;
          this.observerLocator = observerLocator;
          this.local = "item";
        }
        _prototypeProperties(Repeat, {
          metadata: {
            value: function metadata() {
              return Behavior.templateController("repeat").withProperty("items", "itemsChanged", "repeat").withProperty("local");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [BoundViewFactory, ViewSlot, ObserverLocator];
            },
            writable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function bind(executionContext) {
              var _this = this;
              var items = this.items;
              this.executionContext = executionContext;
              if (!items) {
                if (this.oldItems) {
                  this.viewSlot.removeAll();
                }
                return ;
              }
              if (this.oldItems === items) {
                var splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
                var observer = this.observerLocator.getArrayObserver(items);
                this.handleSplices(items, splices);
                this.lastBoundItems = this.oldItems = null;
                this.disposeArraySubscription = observer.subscribe(function(splices) {
                  _this.handleSplices(items, splices);
                });
              } else {
                this.processItems();
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.oldItems = this.items;
              if (this.items) {
                this.lastBoundItems = this.items.slice(0);
              }
              if (this.disposeArraySubscription) {
                this.disposeArraySubscription();
                this.disposeArraySubscription = null;
              }
            },
            writable: true,
            configurable: true
          },
          itemsChanged: {
            value: function itemsChanged() {
              this.processItems();
            },
            writable: true,
            configurable: true
          },
          processItems: {
            value: function processItems() {
              var _this = this;
              var items = this.items,
                  viewSlot = this.viewSlot,
                  viewFactory = this.viewFactory,
                  i,
                  ii,
                  row,
                  view,
                  observer;
              if (this.disposeArraySubscription) {
                this.disposeArraySubscription();
                viewSlot.removeAll();
              }
              if (!items) {
                return ;
              }
              observer = this.observerLocator.getArrayObserver(items);
              for (i = 0, ii = items.length; i < ii; ++i) {
                row = this.createFullExecutionContext(items[i], i, ii);
                view = viewFactory.create(row);
                viewSlot.add(view);
              }
              this.disposeArraySubscription = observer.subscribe(function(splices) {
                _this.handleSplices(items, splices);
              });
            },
            writable: true,
            configurable: true
          },
          createBaseExecutionContext: {
            value: function createBaseExecutionContext(data) {
              var context = {};
              context[this.local] = data;
              return context;
            },
            writable: true,
            configurable: true
          },
          createFullExecutionContext: {
            value: function createFullExecutionContext(data, index, length) {
              var context = this.createBaseExecutionContext(data);
              return this.updateExecutionContext(context, index, length);
            },
            writable: true,
            configurable: true
          },
          updateExecutionContext: {
            value: function updateExecutionContext(context, index, length) {
              var first = index === 0,
                  last = index === length - 1,
                  even = index % 2 === 0;
              context.$parent = this.executionContext;
              context.$index = index;
              context.$first = first;
              context.$last = last;
              context.$middle = !(first || last);
              context.$odd = !even;
              context.$even = even;
              return context;
            },
            writable: true,
            configurable: true
          },
          handleSplices: {
            value: function handleSplices(array, splices) {
              var viewLookup = new Map(),
                  removeDelta = 0,
                  arrayLength = array.length,
                  viewSlot = this.viewSlot,
                  viewFactory = this.viewFactory,
                  i,
                  ii,
                  j,
                  jj,
                  splice,
                  removed,
                  addIndex,
                  end,
                  model,
                  view,
                  children,
                  length,
                  row;
              for (i = 0, ii = splices.length; i < ii; ++i) {
                splice = splices[i];
                removed = splice.removed;
                for (j = 0, jj = removed.length; j < jj; ++j) {
                  model = removed[j];
                  view = viewSlot.removeAt(splice.index + removeDelta);
                  if (view) {
                    viewLookup.set(model, view);
                  }
                }
                removeDelta -= splice.addedCount;
              }
              for (i = 0, ii = splices.length; i < ii; ++i) {
                splice = splices[i];
                addIndex = splice.index;
                end = splice.index + splice.addedCount;
                for (; addIndex < end; ++addIndex) {
                  model = array[addIndex];
                  view = viewLookup.get(model);
                  if (view) {
                    viewLookup["delete"](model);
                    viewSlot.insert(addIndex, view);
                  } else {
                    row = this.createBaseExecutionContext(model);
                    view = this.viewFactory.create(row);
                    viewSlot.insert(addIndex, view);
                  }
                }
              }
              children = viewSlot.children;
              length = children.length;
              for (i = 0; i < length; i++) {
                this.updateExecutionContext(children[i].executionContext, i, length);
              }
              viewLookup.forEach(function(x) {
                return x.unbind();
              });
            },
            writable: true,
            configurable: true
          }
        });
        return Repeat;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/show", ["aurelia-templating"], function(_export) {
  "use strict";
  var Behavior,
      _prototypeProperties,
      Show;
  function addStyleString(str) {
    var node = document.createElement("style");
    node.innerHTML = str;
    node.type = "text/css";
    document.head.appendChild(node);
  }
  return {
    setters: [function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      addStyleString(".aurelia-hide { display:none !important; }");
      Show = _export("Show", (function() {
        function Show(element) {
          this.element = element;
        }
        _prototypeProperties(Show, {
          metadata: {
            value: function metadata() {
              return Behavior.attachedBehavior("show").withProperty("value", "valueChanged", "show");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
            configurable: true
          }
        }, {valueChanged: {
            value: function valueChanged(newValue) {
              if (newValue) {
                this.element.classList.remove("aurelia-hide");
              } else {
                this.element.classList.add("aurelia-hide");
              }
            },
            writable: true,
            configurable: true
          }});
        return Show;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/selected-item", ["aurelia-templating"], function(_export) {
  "use strict";
  var Behavior,
      _prototypeProperties,
      SelectedItem;
  return {
    setters: [function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      SelectedItem = _export("SelectedItem", (function() {
        function SelectedItem(element) {
          this.element = element;
          this.options = [];
          this.callback = this.selectedIndexChanged.bind(this);
        }
        _prototypeProperties(SelectedItem, {
          metadata: {
            value: function metadata() {
              return Behavior.attachedBehavior("selected-item").withProperty("value", "valueChanged", "selected-item").and(function(x) {
                return x.bindingIsTwoWay();
              }).syncChildren("options", "optionsChanged", "option");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function bind() {
              this.element.addEventListener("change", this.callback, false);
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              this.element.removeEventListener("change", this.callback);
            },
            writable: true,
            configurable: true
          },
          valueChanged: {
            value: function valueChanged(newValue) {
              this.optionsChanged();
            },
            writable: true,
            configurable: true
          },
          selectedIndexChanged: {
            value: function selectedIndexChanged() {
              var index = this.element.selectedIndex,
                  option = this.options[index];
              this.value = option ? option.model : null;
            },
            writable: true,
            configurable: true
          },
          optionsChanged: {
            value: function optionsChanged(mutations) {
              var value = this.value,
                  options = this.options,
                  option,
                  i,
                  ii;
              for (i = 0, ii = options.length; i < ii; ++i) {
                option = options[i];
                if (option.model === value) {
                  if (this.element.selectedIndex !== i) {
                    this.element.selectedIndex = i;
                  }
                  return ;
                }
              }
              this.element.selectedIndex = 0;
            },
            writable: true,
            configurable: true
          }
        });
        return SelectedItem;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/global-behavior", ["aurelia-templating"], function(_export) {
  "use strict";
  var Behavior,
      _prototypeProperties,
      GlobalBehavior;
  return {
    setters: [function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      GlobalBehavior = _export("GlobalBehavior", (function() {
        function GlobalBehavior(element) {
          this.element = element;
        }
        _prototypeProperties(GlobalBehavior, {
          metadata: {
            value: function metadata() {
              return Behavior.attachedBehavior("global-behavior").withOptions().and(function(x) {
                return x.dynamic();
              });
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
            configurable: true
          }
        }, {
          bind: {
            value: function bind() {
              var handler = GlobalBehavior.handlers[this.aureliaAttrName];
              if (!handler) {
                throw new Error("Conventional binding handler not found for " + this.aureliaAttrName + ".");
              }
              try {
                this.handler = handler.bind(this, this.element, this.aureliaCommand) || handler;
              } catch (error) {
                throw new Error("Conventional binding handler failed.", error);
              }
            },
            writable: true,
            configurable: true
          },
          attached: {
            value: function attached() {
              if (this.handler && "attached" in this.handler) {
                this.handler.attached(this, this.element);
              }
            },
            writable: true,
            configurable: true
          },
          detached: {
            value: function detached() {
              if (this.handler && "detached" in this.handler) {
                this.handler.detached(this, this.element);
              }
            },
            writable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              if (this.handler && "unbind" in this.handler) {
                this.handler.unbind(this, this.element);
              }
              this.handler = null;
            },
            writable: true,
            configurable: true
          }
        });
        return GlobalBehavior;
      })());
      GlobalBehavior.createSettingsFromBehavior = function(behavior) {
        var settings = {};
        for (var key in behavior) {
          if (key === "aureliaAttrName" || key === "aureliaCommand" || !behavior.hasOwnProperty(key)) {
            continue;
          }
          settings[key] = behavior[key];
        }
        return settings;
      };
      GlobalBehavior.jQueryPlugins = {};
      GlobalBehavior.handlers = {jquery: {
          bind: function bind(behavior, element, command) {
            var settings = GlobalBehavior.createSettingsFromBehavior(behavior);
            var pluginName = GlobalBehavior.jQueryPlugins[command] || command;
            behavior.plugin = window.jQuery(element)[pluginName](settings);
          },
          unbind: function unbind(behavior, element) {
            if (typeof behavior.plugin.destroy === "function") {
              behavior.plugin.destroy();
              behavior.plugin = null;
            }
          }
        }};
    }
  };
});

System.register("github:aurelia/event-aggregator@0.2.2/system/index", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      Handler,
      EventAggregator;
  _export("includeEventsIn", includeEventsIn);
  _export("install", install);
  function includeEventsIn(obj) {
    var ea = new EventAggregator();
    obj.subscribe = function(event, callback) {
      return ea.subscribe(event, callback);
    };
    obj.publish = function(event, data) {
      ea.publish(event, data);
    };
    return ea;
  }
  function install(aurelia) {
    aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
  }
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Handler = (function() {
        function Handler(messageType, callback) {
          this.messageType = messageType;
          this.callback = callback;
        }
        _prototypeProperties(Handler, null, {handle: {
            value: function handle(message) {
              if (message instanceof this.messageType) {
                this.callback.call(null, message);
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          }});
        return Handler;
      })();
      EventAggregator = (function() {
        function EventAggregator() {
          this.eventLookup = {};
          this.messageHandlers = [];
        }
        _prototypeProperties(EventAggregator, null, {
          publish: {
            value: function publish(event, data) {
              var subscribers,
                  i,
                  handler;
              if (typeof event === "string") {
                subscribers = this.eventLookup[event];
                if (subscribers) {
                  subscribers = subscribers.slice();
                  i = subscribers.length;
                  while (i--) {
                    subscribers[i](data, event);
                  }
                }
              } else {
                subscribers = this.messageHandlers.slice();
                i = subscribers.length;
                while (i--) {
                  subscribers[i].handle(event);
                }
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(event, callback) {
              var subscribers,
                  handler;
              if (typeof event === "string") {
                subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
                subscribers.push(callback);
                return function() {
                  subscribers.splice(subscribers.indexOf(callback), 1);
                };
              } else {
                handler = new Handler(event, callback);
                subscribers = this.messageHandlers;
                subscribers.push(handler);
                return function() {
                  subscribers.splice(subscribers.indexOf(handler), 1);
                };
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return EventAggregator;
      })();
      _export("EventAggregator", EventAggregator);
    }
  };
});

System.register("github:aurelia/history-browser@0.2.3/system/index", ["aurelia-history"], function(_export) {
  "use strict";
  var History,
      _prototypeProperties,
      _inherits,
      routeStripper,
      rootStripper,
      isExplorer,
      trailingSlash,
      BrowserHistory;
  function updateHash(location, fragment, replace) {
    if (replace) {
      var href = location.href.replace(/(javascript:|#).*$/, "");
      location.replace(href + "#" + fragment);
    } else {
      location.hash = "#" + fragment;
    }
  }
  function install(aurelia) {
    aurelia.withSingleton(History, BrowserHistory);
  }
  return {
    setters: [function(_aureliaHistory) {
      History = _aureliaHistory.History;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      routeStripper = /^[#\/]|\s+$/g;
      rootStripper = /^\/+|\/+$/g;
      isExplorer = /msie [\w.]+/;
      trailingSlash = /\/$/;
      BrowserHistory = (function(History) {
        function BrowserHistory() {
          this.interval = 50;
          this.active = false;
          this.previousFragment = "";
          this._checkUrlCallback = this.checkUrl.bind(this);
          if (typeof window !== "undefined") {
            this.location = window.location;
            this.history = window.history;
          }
        }
        _inherits(BrowserHistory, History);
        _prototypeProperties(BrowserHistory, null, {
          getHash: {
            value: function getHash(window) {
              var match = (window || this).location.href.match(/#(.*)$/);
              return match ? match[1] : "";
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          getFragment: {
            value: function getFragment(fragment, forcePushState) {
              var root;
              if (!fragment) {
                if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                  fragment = this.location.pathname + this.location.search;
                  root = this.root.replace(trailingSlash, "");
                  if (!fragment.indexOf(root)) {
                    fragment = fragment.substr(root.length);
                  }
                } else {
                  fragment = this.getHash();
                }
              }
              return fragment.replace(routeStripper, "");
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          activate: {
            value: function activate(options) {
              if (this.active) {
                throw new Error("History has already been activated.");
              }
              this.active = true;
              this.options = Object.assign({}, {root: "/"}, this.options, options);
              this.root = this.options.root;
              this._wantsHashChange = this.options.hashChange !== false;
              this._wantsPushState = !!this.options.pushState;
              this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
              var fragment = this.getFragment();
              this.root = ("/" + this.root + "/").replace(rootStripper, "/");
              if (this._hasPushState) {
                window.onpopstate = this._checkUrlCallback;
              } else if (this._wantsHashChange && "onhashchange" in window) {
                window.addEventListener("hashchange", this._checkUrlCallback);
              } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this._checkUrlCallback, this.interval);
              }
              this.fragment = fragment;
              var loc = this.location;
              var atRoot = loc.pathname.replace(/[^\/]$/, "$&/") === this.root;
              if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !atRoot) {
                  this.fragment = this.getFragment(null, true);
                  this.location.replace(this.root + this.location.search + "#" + this.fragment);
                  return true;
                } else if (this._hasPushState && atRoot && loc.hash) {
                  this.fragment = this.getHash().replace(routeStripper, "");
                  this["this"].replaceState({}, document.title, this.root + this.fragment + loc.search);
                }
              }
              if (!this.options.silent) {
                return this.loadUrl();
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {
              window.onpopstate = null;
              window.removeEventListener("hashchange", this._checkUrlCallback);
              clearInterval(this._checkUrlInterval);
              this.active = false;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          checkUrl: {
            value: function checkUrl() {
              var current = this.getFragment();
              if (current === this.fragment && this.iframe) {
                current = this.getFragment(this.getHash(this.iframe));
              }
              if (current === this.fragment) {
                return false;
              }
              if (this.iframe) {
                this.navigate(current, false);
              }
              this.loadUrl();
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          loadUrl: {
            value: function loadUrl(fragmentOverride) {
              var fragment = this.fragment = this.getFragment(fragmentOverride);
              return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          navigate: {
            value: function navigate(fragment, options) {
              if (fragment && fragment.indexOf("://") != -1) {
                window.location.href = fragment;
                return true;
              }
              if (!this.active) {
                return false;
              }
              if (options === undefined) {
                options = {trigger: true};
              } else if (typeof options === "boolean") {
                options = {trigger: options};
              }
              fragment = this.getFragment(fragment || "");
              if (this.fragment === fragment) {
                return ;
              }
              this.fragment = fragment;
              var url = this.root + fragment;
              if (fragment === "" && url !== "/") {
                url = url.slice(0, -1);
              }
              if (this._hasPushState) {
                this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
              } else if (this._wantsHashChange) {
                updateHash(this.location, fragment, options.replace);
                if (this.iframe && fragment !== this.getFragment(this.getHash(this.iframe))) {
                  if (!options.replace) {
                    this.iframe.document.open().close();
                  }
                  updateHash(this.iframe.location, fragment, options.replace);
                }
              } else {
                return this.location.assign(url);
              }
              if (options.trigger) {
                return this.loadUrl(fragment);
              } else {
                this.previousFragment = fragment;
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          navigateBack: {
            value: function navigateBack() {
              this.history.back();
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return BrowserHistory;
      })(History);
      _export("BrowserHistory", BrowserHistory);
      _export("install", install);
    }
  };
});

System.register("dist/behaviors/focus", ["aurelia-templating"], function(_export) {
  "use strict";
  var Behavior,
      _prototypeProperties,
      _classCallCheck,
      Focus;
  return {
    setters: [function(_aureliaTemplating) {
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      Focus = _export("Focus", (function() {
        function Focus(element) {
          _classCallCheck(this, Focus);
          this.element = element;
        }
        _prototypeProperties(Focus, {
          metadata: {
            value: function metadata() {
              return Behavior.attachedBehavior("focus").withProperty("value", "valueChanged", "focus");
            },
            writable: true,
            configurable: true
          },
          inject: {
            value: function inject() {
              return [Element];
            },
            writable: true,
            configurable: true
          }
        }, {valueChanged: {
            value: function valueChanged(value) {
              if (value) {
                this.element.focus();
              }
            },
            writable: true,
            configurable: true
          }});
        return Focus;
      })());
    }
  };
});

System.register("dist/todo-item", [], function(_export) {
  "use strict";
  var _prototypeProperties,
      _classCallCheck,
      ESC_KEY,
      lastLabelClick,
      TodoItem;
  return {
    setters: [],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      ESC_KEY = 27;
      lastLabelClick = Symbol();
      TodoItem = _export("TodoItem", (function() {
        function TodoItem(title) {
          _classCallCheck(this, TodoItem);
          this.isCompleted = false;
          this.isEditing = false;
          this.title = title.trim();
          this.editTitle = null;
          this[lastLabelClick] = 0;
        }
        _prototypeProperties(TodoItem, null, {
          labelClicked: {
            value: function labelClicked() {
              var now = Date.now();
              var duration = now - this[lastLabelClick];
              if (duration < 350) {
                this.editTitle = this.title;
                this.isEditing = true;
              }
              this[lastLabelClick] = Date.now();
            },
            writable: true,
            configurable: true
          },
          finishEditing: {
            value: function finishEditing() {
              this.title = this.editTitle.trim();
              this.isEditing = false;
            },
            writable: true,
            configurable: true
          },
          onKeyUp: {
            value: function onKeyUp(ev) {
              if (ev.keyCode == ESC_KEY) {
                this.editTitle = this.title;
                this.isEditing = false;
              }
            },
            writable: true,
            configurable: true
          }
        });
        return TodoItem;
      })());
    }
  };
});

System.register("npm:underscore@1.7.0/underscore", [], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "format cjs";
  (function() {
    var root = this;
    var previousUnderscore = root._;
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind;
    var _ = function(obj) {
      if (obj instanceof _)
        return obj;
      if (!(this instanceof _))
        return new _(obj);
      this._wrapped = obj;
    };
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }
    _.VERSION = '1.7.0';
    var createCallback = function(func, context, argCount) {
      if (context === void 0)
        return func;
      switch (argCount == null ? 3 : argCount) {
        case 1:
          return function(value) {
            return func.call(context, value);
          };
        case 2:
          return function(value, other) {
            return func.call(context, value, other);
          };
        case 3:
          return function(value, index, collection) {
            return func.call(context, value, index, collection);
          };
        case 4:
          return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
      }
      return function() {
        return func.apply(context, arguments);
      };
    };
    _.iteratee = function(value, context, argCount) {
      if (value == null)
        return _.identity;
      if (_.isFunction(value))
        return createCallback(value, context, argCount);
      if (_.isObject(value))
        return _.matches(value);
      return _.property(value);
    };
    _.each = _.forEach = function(obj, iteratee, context) {
      if (obj == null)
        return obj;
      iteratee = createCallback(iteratee, context);
      var i,
          length = obj.length;
      if (length === +length) {
        for (i = 0; i < length; i++) {
          iteratee(obj[i], i, obj);
        }
      } else {
        var keys = _.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
          iteratee(obj[keys[i]], keys[i], obj);
        }
      }
      return obj;
    };
    _.map = _.collect = function(obj, iteratee, context) {
      if (obj == null)
        return [];
      iteratee = _.iteratee(iteratee, context);
      var keys = obj.length !== +obj.length && _.keys(obj),
          length = (keys || obj).length,
          results = Array(length),
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys ? keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
    };
    var reduceError = 'Reduce of empty array with no initial value';
    _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
      if (obj == null)
        obj = [];
      iteratee = createCallback(iteratee, context, 4);
      var keys = obj.length !== +obj.length && _.keys(obj),
          length = (keys || obj).length,
          index = 0,
          currentKey;
      if (arguments.length < 3) {
        if (!length)
          throw new TypeError(reduceError);
        memo = obj[keys ? keys[index++] : index++];
      }
      for (; index < length; index++) {
        currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };
    _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
      if (obj == null)
        obj = [];
      iteratee = createCallback(iteratee, context, 4);
      var keys = obj.length !== +obj.length && _.keys(obj),
          index = (keys || obj).length,
          currentKey;
      if (arguments.length < 3) {
        if (!index)
          throw new TypeError(reduceError);
        memo = obj[keys ? keys[--index] : --index];
      }
      while (index--) {
        currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };
    _.find = _.detect = function(obj, predicate, context) {
      var result;
      predicate = _.iteratee(predicate, context);
      _.some(obj, function(value, index, list) {
        if (predicate(value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    };
    _.filter = _.select = function(obj, predicate, context) {
      var results = [];
      if (obj == null)
        return results;
      predicate = _.iteratee(predicate, context);
      _.each(obj, function(value, index, list) {
        if (predicate(value, index, list))
          results.push(value);
      });
      return results;
    };
    _.reject = function(obj, predicate, context) {
      return _.filter(obj, _.negate(_.iteratee(predicate)), context);
    };
    _.every = _.all = function(obj, predicate, context) {
      if (obj == null)
        return true;
      predicate = _.iteratee(predicate, context);
      var keys = obj.length !== +obj.length && _.keys(obj),
          length = (keys || obj).length,
          index,
          currentKey;
      for (index = 0; index < length; index++) {
        currentKey = keys ? keys[index] : index;
        if (!predicate(obj[currentKey], currentKey, obj))
          return false;
      }
      return true;
    };
    _.some = _.any = function(obj, predicate, context) {
      if (obj == null)
        return false;
      predicate = _.iteratee(predicate, context);
      var keys = obj.length !== +obj.length && _.keys(obj),
          length = (keys || obj).length,
          index,
          currentKey;
      for (index = 0; index < length; index++) {
        currentKey = keys ? keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj))
          return true;
      }
      return false;
    };
    _.contains = _.include = function(obj, target) {
      if (obj == null)
        return false;
      if (obj.length !== +obj.length)
        obj = _.values(obj);
      return _.indexOf(obj, target) >= 0;
    };
    _.invoke = function(obj, method) {
      var args = slice.call(arguments, 2);
      var isFunc = _.isFunction(method);
      return _.map(obj, function(value) {
        return (isFunc ? method : value[method]).apply(value, args);
      });
    };
    _.pluck = function(obj, key) {
      return _.map(obj, _.property(key));
    };
    _.where = function(obj, attrs) {
      return _.filter(obj, _.matches(attrs));
    };
    _.findWhere = function(obj, attrs) {
      return _.find(obj, _.matches(attrs));
    };
    _.max = function(obj, iteratee, context) {
      var result = -Infinity,
          lastComputed = -Infinity,
          value,
          computed;
      if (iteratee == null && obj != null) {
        obj = obj.length === +obj.length ? obj : _.values(obj);
        for (var i = 0,
            length = obj.length; i < length; i++) {
          value = obj[i];
          if (value > result) {
            result = value;
          }
        }
      } else {
        iteratee = _.iteratee(iteratee, context);
        _.each(obj, function(value, index, list) {
          computed = iteratee(value, index, list);
          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = value;
            lastComputed = computed;
          }
        });
      }
      return result;
    };
    _.min = function(obj, iteratee, context) {
      var result = Infinity,
          lastComputed = Infinity,
          value,
          computed;
      if (iteratee == null && obj != null) {
        obj = obj.length === +obj.length ? obj : _.values(obj);
        for (var i = 0,
            length = obj.length; i < length; i++) {
          value = obj[i];
          if (value < result) {
            result = value;
          }
        }
      } else {
        iteratee = _.iteratee(iteratee, context);
        _.each(obj, function(value, index, list) {
          computed = iteratee(value, index, list);
          if (computed < lastComputed || computed === Infinity && result === Infinity) {
            result = value;
            lastComputed = computed;
          }
        });
      }
      return result;
    };
    _.shuffle = function(obj) {
      var set = obj && obj.length === +obj.length ? obj : _.values(obj);
      var length = set.length;
      var shuffled = Array(length);
      for (var index = 0,
          rand; index < length; index++) {
        rand = _.random(0, index);
        if (rand !== index)
          shuffled[index] = shuffled[rand];
        shuffled[rand] = set[index];
      }
      return shuffled;
    };
    _.sample = function(obj, n, guard) {
      if (n == null || guard) {
        if (obj.length !== +obj.length)
          obj = _.values(obj);
        return obj[_.random(obj.length - 1)];
      }
      return _.shuffle(obj).slice(0, Math.max(0, n));
    };
    _.sortBy = function(obj, iteratee, context) {
      iteratee = _.iteratee(iteratee, context);
      return _.pluck(_.map(obj, function(value, index, list) {
        return {
          value: value,
          index: index,
          criteria: iteratee(value, index, list)
        };
      }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0)
            return 1;
          if (a < b || b === void 0)
            return -1;
        }
        return left.index - right.index;
      }), 'value');
    };
    var group = function(behavior) {
      return function(obj, iteratee, context) {
        var result = {};
        iteratee = _.iteratee(iteratee, context);
        _.each(obj, function(value, index) {
          var key = iteratee(value, index, obj);
          behavior(result, value, key);
        });
        return result;
      };
    };
    _.groupBy = group(function(result, value, key) {
      if (_.has(result, key))
        result[key].push(value);
      else
        result[key] = [value];
    });
    _.indexBy = group(function(result, value, key) {
      result[key] = value;
    });
    _.countBy = group(function(result, value, key) {
      if (_.has(result, key))
        result[key]++;
      else
        result[key] = 1;
    });
    _.sortedIndex = function(array, obj, iteratee, context) {
      iteratee = _.iteratee(iteratee, context, 1);
      var value = iteratee(obj);
      var low = 0,
          high = array.length;
      while (low < high) {
        var mid = low + high >>> 1;
        if (iteratee(array[mid]) < value)
          low = mid + 1;
        else
          high = mid;
      }
      return low;
    };
    _.toArray = function(obj) {
      if (!obj)
        return [];
      if (_.isArray(obj))
        return slice.call(obj);
      if (obj.length === +obj.length)
        return _.map(obj, _.identity);
      return _.values(obj);
    };
    _.size = function(obj) {
      if (obj == null)
        return 0;
      return obj.length === +obj.length ? obj.length : _.keys(obj).length;
    };
    _.partition = function(obj, predicate, context) {
      predicate = _.iteratee(predicate, context);
      var pass = [],
          fail = [];
      _.each(obj, function(value, key, obj) {
        (predicate(value, key, obj) ? pass : fail).push(value);
      });
      return [pass, fail];
    };
    _.first = _.head = _.take = function(array, n, guard) {
      if (array == null)
        return void 0;
      if (n == null || guard)
        return array[0];
      if (n < 0)
        return [];
      return slice.call(array, 0, n);
    };
    _.initial = function(array, n, guard) {
      return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };
    _.last = function(array, n, guard) {
      if (array == null)
        return void 0;
      if (n == null || guard)
        return array[array.length - 1];
      return slice.call(array, Math.max(array.length - n, 0));
    };
    _.rest = _.tail = _.drop = function(array, n, guard) {
      return slice.call(array, n == null || guard ? 1 : n);
    };
    _.compact = function(array) {
      return _.filter(array, _.identity);
    };
    var flatten = function(input, shallow, strict, output) {
      if (shallow && _.every(input, _.isArray)) {
        return concat.apply(output, input);
      }
      for (var i = 0,
          length = input.length; i < length; i++) {
        var value = input[i];
        if (!_.isArray(value) && !_.isArguments(value)) {
          if (!strict)
            output.push(value);
        } else if (shallow) {
          push.apply(output, value);
        } else {
          flatten(value, shallow, strict, output);
        }
      }
      return output;
    };
    _.flatten = function(array, shallow) {
      return flatten(array, shallow, false, []);
    };
    _.without = function(array) {
      return _.difference(array, slice.call(arguments, 1));
    };
    _.uniq = _.unique = function(array, isSorted, iteratee, context) {
      if (array == null)
        return [];
      if (!_.isBoolean(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
      }
      if (iteratee != null)
        iteratee = _.iteratee(iteratee, context);
      var result = [];
      var seen = [];
      for (var i = 0,
          length = array.length; i < length; i++) {
        var value = array[i];
        if (isSorted) {
          if (!i || seen !== value)
            result.push(value);
          seen = value;
        } else if (iteratee) {
          var computed = iteratee(value, i, array);
          if (_.indexOf(seen, computed) < 0) {
            seen.push(computed);
            result.push(value);
          }
        } else if (_.indexOf(result, value) < 0) {
          result.push(value);
        }
      }
      return result;
    };
    _.union = function() {
      return _.uniq(flatten(arguments, true, true, []));
    };
    _.intersection = function(array) {
      if (array == null)
        return [];
      var result = [];
      var argsLength = arguments.length;
      for (var i = 0,
          length = array.length; i < length; i++) {
        var item = array[i];
        if (_.contains(result, item))
          continue;
        for (var j = 1; j < argsLength; j++) {
          if (!_.contains(arguments[j], item))
            break;
        }
        if (j === argsLength)
          result.push(item);
      }
      return result;
    };
    _.difference = function(array) {
      var rest = flatten(slice.call(arguments, 1), true, true, []);
      return _.filter(array, function(value) {
        return !_.contains(rest, value);
      });
    };
    _.zip = function(array) {
      if (array == null)
        return [];
      var length = _.max(arguments, 'length').length;
      var results = Array(length);
      for (var i = 0; i < length; i++) {
        results[i] = _.pluck(arguments, i);
      }
      return results;
    };
    _.object = function(list, values) {
      if (list == null)
        return {};
      var result = {};
      for (var i = 0,
          length = list.length; i < length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    };
    _.indexOf = function(array, item, isSorted) {
      if (array == null)
        return -1;
      var i = 0,
          length = array.length;
      if (isSorted) {
        if (typeof isSorted == 'number') {
          i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
        } else {
          i = _.sortedIndex(array, item);
          return array[i] === item ? i : -1;
        }
      }
      for (; i < length; i++)
        if (array[i] === item)
          return i;
      return -1;
    };
    _.lastIndexOf = function(array, item, from) {
      if (array == null)
        return -1;
      var idx = array.length;
      if (typeof from == 'number') {
        idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
      }
      while (--idx >= 0)
        if (array[idx] === item)
          return idx;
      return -1;
    };
    _.range = function(start, stop, step) {
      if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
      }
      step = step || 1;
      var length = Math.max(Math.ceil((stop - start) / step), 0);
      var range = Array(length);
      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
      }
      return range;
    };
    var Ctor = function() {};
    _.bind = function(func, context) {
      var args,
          bound;
      if (nativeBind && func.bind === nativeBind)
        return nativeBind.apply(func, slice.call(arguments, 1));
      if (!_.isFunction(func))
        throw new TypeError('Bind must be called on a function');
      args = slice.call(arguments, 2);
      bound = function() {
        if (!(this instanceof bound))
          return func.apply(context, args.concat(slice.call(arguments)));
        Ctor.prototype = func.prototype;
        var self = new Ctor;
        Ctor.prototype = null;
        var result = func.apply(self, args.concat(slice.call(arguments)));
        if (_.isObject(result))
          return result;
        return self;
      };
      return bound;
    };
    _.partial = function(func) {
      var boundArgs = slice.call(arguments, 1);
      return function() {
        var position = 0;
        var args = boundArgs.slice();
        for (var i = 0,
            length = args.length; i < length; i++) {
          if (args[i] === _)
            args[i] = arguments[position++];
        }
        while (position < arguments.length)
          args.push(arguments[position++]);
        return func.apply(this, args);
      };
    };
    _.bindAll = function(obj) {
      var i,
          length = arguments.length,
          key;
      if (length <= 1)
        throw new Error('bindAll must be passed function names');
      for (i = 1; i < length; i++) {
        key = arguments[i];
        obj[key] = _.bind(obj[key], obj);
      }
      return obj;
    };
    _.memoize = function(func, hasher) {
      var memoize = function(key) {
        var cache = memoize.cache;
        var address = hasher ? hasher.apply(this, arguments) : key;
        if (!_.has(cache, address))
          cache[address] = func.apply(this, arguments);
        return cache[address];
      };
      memoize.cache = {};
      return memoize;
    };
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function() {
        return func.apply(null, args);
      }, wait);
    };
    _.defer = function(func) {
      return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };
    _.throttle = function(func, wait, options) {
      var context,
          args,
          result;
      var timeout = null;
      var previous = 0;
      if (!options)
        options = {};
      var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout)
          context = args = null;
      };
      return function() {
        var now = _.now();
        if (!previous && options.leading === false)
          previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
          if (!timeout)
            context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };
    _.debounce = function(func, wait, immediate) {
      var timeout,
          args,
          context,
          timestamp,
          result;
      var later = function() {
        var last = _.now() - timestamp;
        if (last < wait && last > 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout)
              context = args = null;
          }
        }
      };
      return function() {
        context = this;
        args = arguments;
        timestamp = _.now();
        var callNow = immediate && !timeout;
        if (!timeout)
          timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }
        return result;
      };
    };
    _.wrap = function(func, wrapper) {
      return _.partial(wrapper, func);
    };
    _.negate = function(predicate) {
      return function() {
        return !predicate.apply(this, arguments);
      };
    };
    _.compose = function() {
      var args = arguments;
      var start = args.length - 1;
      return function() {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--)
          result = args[i].call(this, result);
        return result;
      };
    };
    _.after = function(times, func) {
      return function() {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    };
    _.before = function(times, func) {
      var memo;
      return function() {
        if (--times > 0) {
          memo = func.apply(this, arguments);
        } else {
          func = null;
        }
        return memo;
      };
    };
    _.once = _.partial(_.before, 2);
    _.keys = function(obj) {
      if (!_.isObject(obj))
        return [];
      if (nativeKeys)
        return nativeKeys(obj);
      var keys = [];
      for (var key in obj)
        if (_.has(obj, key))
          keys.push(key);
      return keys;
    };
    _.values = function(obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var values = Array(length);
      for (var i = 0; i < length; i++) {
        values[i] = obj[keys[i]];
      }
      return values;
    };
    _.pairs = function(obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var pairs = Array(length);
      for (var i = 0; i < length; i++) {
        pairs[i] = [keys[i], obj[keys[i]]];
      }
      return pairs;
    };
    _.invert = function(obj) {
      var result = {};
      var keys = _.keys(obj);
      for (var i = 0,
          length = keys.length; i < length; i++) {
        result[obj[keys[i]]] = keys[i];
      }
      return result;
    };
    _.functions = _.methods = function(obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key]))
          names.push(key);
      }
      return names.sort();
    };
    _.extend = function(obj) {
      if (!_.isObject(obj))
        return obj;
      var source,
          prop;
      for (var i = 1,
          length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
          if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
          }
        }
      }
      return obj;
    };
    _.pick = function(obj, iteratee, context) {
      var result = {},
          key;
      if (obj == null)
        return result;
      if (_.isFunction(iteratee)) {
        iteratee = createCallback(iteratee, context);
        for (key in obj) {
          var value = obj[key];
          if (iteratee(value, key, obj))
            result[key] = value;
        }
      } else {
        var keys = concat.apply([], slice.call(arguments, 1));
        obj = new Object(obj);
        for (var i = 0,
            length = keys.length; i < length; i++) {
          key = keys[i];
          if (key in obj)
            result[key] = obj[key];
        }
      }
      return result;
    };
    _.omit = function(obj, iteratee, context) {
      if (_.isFunction(iteratee)) {
        iteratee = _.negate(iteratee);
      } else {
        var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
        iteratee = function(value, key) {
          return !_.contains(keys, key);
        };
      }
      return _.pick(obj, iteratee, context);
    };
    _.defaults = function(obj) {
      if (!_.isObject(obj))
        return obj;
      for (var i = 1,
          length = arguments.length; i < length; i++) {
        var source = arguments[i];
        for (var prop in source) {
          if (obj[prop] === void 0)
            obj[prop] = source[prop];
        }
      }
      return obj;
    };
    _.clone = function(obj) {
      if (!_.isObject(obj))
        return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
    _.tap = function(obj, interceptor) {
      interceptor(obj);
      return obj;
    };
    var eq = function(a, b, aStack, bStack) {
      if (a === b)
        return a !== 0 || 1 / a === 1 / b;
      if (a == null || b == null)
        return a === b;
      if (a instanceof _)
        a = a._wrapped;
      if (b instanceof _)
        b = b._wrapped;
      var className = toString.call(a);
      if (className !== toString.call(b))
        return false;
      switch (className) {
        case '[object RegExp]':
        case '[object String]':
          return '' + a === '' + b;
        case '[object Number]':
          if (+a !== +a)
            return +b !== +b;
          return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
          return +a === +b;
      }
      if (typeof a != 'object' || typeof b != 'object')
        return false;
      var length = aStack.length;
      while (length--) {
        if (aStack[length] === a)
          return bStack[length] === b;
      }
      var aCtor = a.constructor,
          bCtor = b.constructor;
      if (aCtor !== bCtor && 'constructor' in a && 'constructor' in b && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
        return false;
      }
      aStack.push(a);
      bStack.push(b);
      var size,
          result;
      if (className === '[object Array]') {
        size = a.length;
        result = size === b.length;
        if (result) {
          while (size--) {
            if (!(result = eq(a[size], b[size], aStack, bStack)))
              break;
          }
        }
      } else {
        var keys = _.keys(a),
            key;
        size = keys.length;
        result = _.keys(b).length === size;
        if (result) {
          while (size--) {
            key = keys[size];
            if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack)))
              break;
          }
        }
      }
      aStack.pop();
      bStack.pop();
      return result;
    };
    _.isEqual = function(a, b) {
      return eq(a, b, [], []);
    };
    _.isEmpty = function(obj) {
      if (obj == null)
        return true;
      if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))
        return obj.length === 0;
      for (var key in obj)
        if (_.has(obj, key))
          return false;
      return true;
    };
    _.isElement = function(obj) {
      return !!(obj && obj.nodeType === 1);
    };
    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) === '[object Array]';
    };
    _.isObject = function(obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    };
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
      _['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
      };
    });
    if (!_.isArguments(arguments)) {
      _.isArguments = function(obj) {
        return _.has(obj, 'callee');
      };
    }
    if (typeof/./ !== 'function') {
      _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
      };
    }
    _.isFinite = function(obj) {
      return isFinite(obj) && !isNaN(parseFloat(obj));
    };
    _.isNaN = function(obj) {
      return _.isNumber(obj) && obj !== +obj;
    };
    _.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };
    _.isNull = function(obj) {
      return obj === null;
    };
    _.isUndefined = function(obj) {
      return obj === void 0;
    };
    _.has = function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
    };
    _.noConflict = function() {
      root._ = previousUnderscore;
      return this;
    };
    _.identity = function(value) {
      return value;
    };
    _.constant = function(value) {
      return function() {
        return value;
      };
    };
    _.noop = function() {};
    _.property = function(key) {
      return function(obj) {
        return obj[key];
      };
    };
    _.matches = function(attrs) {
      var pairs = _.pairs(attrs),
          length = pairs.length;
      return function(obj) {
        if (obj == null)
          return !length;
        obj = new Object(obj);
        for (var i = 0; i < length; i++) {
          var pair = pairs[i],
              key = pair[0];
          if (pair[1] !== obj[key] || !(key in obj))
            return false;
        }
        return true;
      };
    };
    _.times = function(n, iteratee, context) {
      var accum = Array(Math.max(0, n));
      iteratee = createCallback(iteratee, context, 1);
      for (var i = 0; i < n; i++)
        accum[i] = iteratee(i);
      return accum;
    };
    _.random = function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };
    _.now = Date.now || function() {
      return new Date().getTime();
    };
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);
    var createEscaper = function(map) {
      var escaper = function(match) {
        return map[match];
      };
      var source = '(?:' + _.keys(map).join('|') + ')';
      var testRegexp = RegExp(source);
      var replaceRegexp = RegExp(source, 'g');
      return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);
    _.result = function(object, property) {
      if (object == null)
        return void 0;
      var value = object[property];
      return _.isFunction(value) ? object[property]() : value;
    };
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };
    _.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/;
    var escapes = {
      "'": "'",
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function(match) {
      return '\\' + escapes[match];
    };
    _.template = function(text, settings, oldSettings) {
      if (!settings && oldSettings)
        settings = oldSettings;
      settings = _.defaults({}, settings, _.templateSettings);
      var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;
        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
        return match;
      });
      source += "';\n";
      if (!settings.variable)
        source = 'with(obj||{}){\n' + source + '}\n';
      source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
      try {
        var render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }
      var template = function(data) {
        return render.call(this, data, _);
      };
      var argument = settings.variable || 'obj';
      template.source = 'function(' + argument + '){\n' + source + '}';
      return template;
    };
    _.chain = function(obj) {
      var instance = _(obj);
      instance._chain = true;
      return instance;
    };
    var result = function(obj) {
      return this._chain ? _(obj).chain() : obj;
    };
    _.mixin = function(obj) {
      _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return result.call(this, func.apply(_, args));
        };
      });
    };
    _.mixin(_);
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0)
          delete obj[0];
        return result.call(this, obj);
      };
    });
    _.each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        return result.call(this, method.apply(this._wrapped, arguments));
      };
    });
    _.prototype.value = function() {
      return this._wrapped;
    };
    if (typeof define === 'function' && define.amd) {
      define('underscore', [], function() {
        return _;
      });
    }
  }.call(this));
  global.define = __define;
  return module.exports;
});

System.register("dist/app", ["aurelia-router", "./todos"], function(_export) {
  "use strict";
  var Router,
      Todos,
      _prototypeProperties,
      _classCallCheck,
      App;
  return {
    setters: [function(_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function(_todos) {
      Todos = _todos.Todos;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      App = _export("App", (function() {
        function App(router) {
          _classCallCheck(this, App);
          this.router = router;
          this.router.configure(this.configureRoutes);
        }
        _prototypeProperties(App, {inject: {
            value: function inject() {
              return [Router];
            },
            writable: true,
            configurable: true
          }}, {configureRoutes: {
            value: function configureRoutes(cfg) {
              cfg.title = "TodoMVC";
              cfg.map([{
                route: ["", ":filter"],
                moduleId: "todos"
              }]);
            },
            writable: true,
            configurable: true
          }});
        return App;
      })());
    }
  };
});

System.register("npm:process@0.10.0", ["npm:process@0.10.0/browser"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:process@0.10.0/browser");
  global.define = __define;
  return module.exports;
});

System.register("github:aurelia/metadata@0.3.1/system/index", ["./origin", "./resource-type", "./metadata"], function(_export) {
  "use strict";
  return {
    setters: [function(_origin) {
      _export("Origin", _origin.Origin);
    }, function(_resourceType) {
      _export("ResourceType", _resourceType.ResourceType);
    }, function(_metadata) {
      _export("Metadata", _metadata.Metadata);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/loader@0.3.3", ["github:aurelia/loader@0.3.3/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/path@0.4.3", ["github:aurelia/path@0.4.3/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/logging@0.2.2", ["github:aurelia/logging@0.2.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/dependency-injection@0.4.2/system/container", ["aurelia-metadata", "./metadata", "./util"], function(_export) {
  "use strict";
  var Metadata,
      Resolver,
      Registration,
      isClass,
      _prototypeProperties,
      emptyParameters,
      Container;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_metadata) {
      Resolver = _metadata.Resolver;
      Registration = _metadata.Registration;
    }, function(_util) {
      isClass = _util.isClass;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      emptyParameters = Object.freeze([]);
      Container = _export("Container", (function() {
        function Container(constructionInfo) {
          this.constructionInfo = constructionInfo || new Map();
          this.entries = new Map();
        }
        _prototypeProperties(Container, null, {
          supportAtScript: {
            value: function supportAtScript() {
              this.addParameterInfoLocator(function(fn) {
                var parameters = fn.parameters,
                    keys,
                    i,
                    ii;
                if (parameters) {
                  keys = new Array(parameters.length);
                  for (i = 0, ii = parameters.length; i < ii; ++i) {
                    keys[i] = parameters[i].is || parameters[i][0];
                  }
                }
                return keys;
              });
            },
            writable: true,
            configurable: true
          },
          addParameterInfoLocator: {
            value: function addParameterInfoLocator(locator) {
              if (this.locateParameterInfoElsewhere === undefined) {
                this.locateParameterInfoElsewhere = locator;
                return ;
              }
              var original = this.locateParameterInfoElsewhere;
              this.locateParameterInfoElsewhere = function(fn) {
                return original(fn) || locator(fn);
              };
            },
            writable: true,
            configurable: true
          },
          registerInstance: {
            value: function registerInstance(key, instance) {
              this.registerHandler(key, function(x) {
                return instance;
              });
            },
            writable: true,
            configurable: true
          },
          registerTransient: {
            value: function registerTransient(key, fn) {
              fn = fn || key;
              this.registerHandler(key, function(x) {
                return x.invoke(fn);
              });
            },
            writable: true,
            configurable: true
          },
          registerSingleton: {
            value: function registerSingleton(key, fn) {
              var singleton = null;
              fn = fn || key;
              this.registerHandler(key, function(x) {
                return singleton || (singleton = x.invoke(fn));
              });
            },
            writable: true,
            configurable: true
          },
          autoRegister: {
            value: function autoRegister(fn, key) {
              var registration = Metadata.on(fn).first(Registration, true);
              if (registration) {
                registration.register(this, key || fn, fn);
              } else {
                this.registerSingleton(key || fn, fn);
              }
            },
            writable: true,
            configurable: true
          },
          autoRegisterAll: {
            value: function autoRegisterAll(fns) {
              var i = fns.length;
              while (i--) {
                this.autoRegister(fns[i]);
              }
            },
            writable: true,
            configurable: true
          },
          registerHandler: {
            value: function registerHandler(key, handler) {
              this.getOrCreateEntry(key).push(handler);
            },
            writable: true,
            configurable: true
          },
          get: {
            value: function get(key) {
              var entry;
              if (key instanceof Resolver) {
                return key.get(this);
              }
              if (key === Container) {
                return this;
              }
              entry = this.entries.get(key);
              if (entry !== undefined) {
                return entry[0](this);
              }
              if (this.parent) {
                return this.parent.get(key);
              }
              this.autoRegister(key);
              entry = this.entries.get(key);
              return entry[0](this);
            },
            writable: true,
            configurable: true
          },
          getAll: {
            value: function getAll(key) {
              var _this = this;
              var entry = this.entries.get(key);
              if (entry !== undefined) {
                return entry.map(function(x) {
                  return x(_this);
                });
              }
              if (this.parent) {
                return this.parent.getAll(key);
              }
              return [];
            },
            writable: true,
            configurable: true
          },
          hasHandler: {
            value: function hasHandler(key) {
              var checkParent = arguments[1] === undefined ? false : arguments[1];
              return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
            },
            writable: true,
            configurable: true
          },
          createChild: {
            value: function createChild() {
              var childContainer = new Container(this.constructionInfo);
              childContainer.parent = this;
              childContainer.locateParameterInfoElsewhere = this.locateParameterInfoElsewhere;
              return childContainer;
            },
            writable: true,
            configurable: true
          },
          invoke: {
            value: function invoke(fn) {
              var info = this.getOrCreateConstructionInfo(fn),
                  keys = info.keys,
                  args = new Array(keys.length),
                  context,
                  i,
                  ii;
              for (i = 0, ii = keys.length; i < ii; ++i) {
                args[i] = this.get(keys[i]);
              }
              if (info.isClass) {
                context = Object.create(fn.prototype);
                if ("initialize" in fn) {
                  fn.initialize(context);
                }
                return fn.apply(context, args) || context;
              } else {
                return fn.apply(undefined, args);
              }
            },
            writable: true,
            configurable: true
          },
          getOrCreateEntry: {
            value: function getOrCreateEntry(key) {
              var entry = this.entries.get(key);
              if (entry === undefined) {
                entry = [];
                this.entries.set(key, entry);
              }
              return entry;
            },
            writable: true,
            configurable: true
          },
          getOrCreateConstructionInfo: {
            value: function getOrCreateConstructionInfo(fn) {
              var info = this.constructionInfo.get(fn);
              if (info === undefined) {
                info = this.createConstructionInfo(fn);
                this.constructionInfo.set(fn, info);
              }
              return info;
            },
            writable: true,
            configurable: true
          },
          createConstructionInfo: {
            value: function createConstructionInfo(fn) {
              var info = {isClass: isClass(fn)};
              if (fn.inject !== undefined) {
                if (typeof fn.inject === "function") {
                  info.keys = fn.inject();
                } else {
                  info.keys = fn.inject;
                }
                return info;
              }
              if (this.locateParameterInfoElsewhere !== undefined) {
                info.keys = this.locateParameterInfoElsewhere(fn) || emptyParameters;
              } else {
                info.keys = emptyParameters;
              }
              return info;
            },
            writable: true,
            configurable: true
          }
        });
        return Container;
      })());
    }
  };
});

System.register("github:aurelia/task-queue@0.2.3", ["github:aurelia/task-queue@0.2.3/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/binding@0.3.4/system/array-observation", ["./array-change-records"], function(_export) {
  "use strict";
  var calcSplices,
      projectArraySplices,
      _prototypeProperties,
      arrayProto,
      hasArrayObserve,
      ModifyArrayObserver,
      ArrayObserveObserver,
      ArrayLengthObserver;
  _export("getArrayObserver", getArrayObserver);
  function getArrayObserver(taskQueue, array) {
    if (hasArrayObserve) {
      return new ArrayObserveObserver(array);
    } else {
      return ModifyArrayObserver.create(taskQueue, array);
    }
  }
  return {
    setters: [function(_arrayChangeRecords) {
      calcSplices = _arrayChangeRecords.calcSplices;
      projectArraySplices = _arrayChangeRecords.projectArraySplices;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      arrayProto = Array.prototype;
      hasArrayObserve = (function detectArrayObserve() {
        if (typeof Array.observe !== "function") {
          return false;
        }
        var records = [];
        function callback(recs) {
          records = recs;
        }
        var arr = [];
        Array.observe(arr, callback);
        arr.push(1, 2);
        arr.length = 0;
        Object.deliverChangeRecords(callback);
        if (records.length !== 2)
          return false;
        if (records[0].type != "splice" || records[1].type != "splice") {
          return false;
        }
        Array.unobserve(arr, callback);
        return true;
      })();
      ModifyArrayObserver = (function() {
        function ModifyArrayObserver(taskQueue, array) {
          this.taskQueue = taskQueue;
          this.callbacks = [];
          this.changeRecords = [];
          this.queued = false;
          this.array = array;
          this.oldArray = null;
        }
        _prototypeProperties(ModifyArrayObserver, {create: {
            value: function create(taskQueue, array) {
              var observer = new ModifyArrayObserver(taskQueue, array);
              array.pop = function() {
                var methodCallResult = arrayProto.pop.apply(array, arguments);
                observer.addChangeRecord({
                  type: "delete",
                  object: array,
                  name: array.length,
                  oldValue: methodCallResult
                });
                return methodCallResult;
              };
              array.push = function() {
                var methodCallResult = arrayProto.push.apply(array, arguments);
                observer.addChangeRecord({
                  type: "splice",
                  object: array,
                  index: array.length - arguments.length,
                  removed: [],
                  addedCount: arguments.length
                });
                return methodCallResult;
              };
              array.reverse = function() {
                var oldArray = array.slice();
                var methodCallResult = arrayProto.reverse.apply(array, arguments);
                observer.reset(oldArray);
                return methodCallResult;
              };
              array.shift = function() {
                var methodCallResult = arrayProto.shift.apply(array, arguments);
                observer.addChangeRecord({
                  type: "delete",
                  object: array,
                  name: 0,
                  oldValue: methodCallResult
                });
                return methodCallResult;
              };
              array.sort = function() {
                var oldArray = array.slice();
                var methodCallResult = arrayProto.sort.apply(array, arguments);
                observer.reset(oldArray);
                return methodCallResult;
              };
              array.splice = function() {
                var methodCallResult = arrayProto.splice.apply(array, arguments);
                observer.addChangeRecord({
                  type: "splice",
                  object: array,
                  index: arguments[0],
                  removed: methodCallResult,
                  addedCount: arguments.length > 2 ? arguments.length - 2 : 0
                });
                return methodCallResult;
              };
              array.unshift = function() {
                var methodCallResult = arrayProto.unshift.apply(array, arguments);
                observer.addChangeRecord({
                  type: "splice",
                  object: array,
                  index: 0,
                  removed: [],
                  addedCount: arguments.length
                });
                return methodCallResult;
              };
              return observer;
            },
            writable: true,
            configurable: true
          }}, {
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          addChangeRecord: {
            value: function addChangeRecord(changeRecord) {
              if (!this.callbacks.length) {
                return ;
              }
              this.changeRecords.push(changeRecord);
              if (!this.queued) {
                this.queued = true;
                this.taskQueue.queueMicroTask(this);
              }
            },
            writable: true,
            configurable: true
          },
          reset: {
            value: function reset(oldArray) {
              if (!this.callbacks.length) {
                return ;
              }
              this.oldArray = oldArray;
              if (!this.queued) {
                this.queued = true;
                this.taskQueue.queueMicroTask(this);
              }
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName) {
              if (propertyName == "length") {
                return this.lengthObserver || (this.lengthObserver = new ArrayLengthObserver(this.array));
              } else {
                throw new Error("You cannot observe the " + propertyName + " property of an array.");
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  changeRecords = this.changeRecords,
                  oldArray = this.oldArray,
                  splices;
              this.queued = false;
              this.changeRecords = [];
              this.oldArray = null;
              if (i) {
                if (oldArray) {
                  splices = calcSplices(this.array, 0, this.array.length, oldArray, 0, oldArray.length);
                } else {
                  splices = projectArraySplices(this.array, changeRecords);
                }
                while (i--) {
                  callbacks[i](splices);
                }
              }
              if (this.lengthObserver) {
                this.lengthObserver(this.array.length);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ModifyArrayObserver;
      })();
      ArrayObserveObserver = (function() {
        function ArrayObserveObserver(array) {
          this.array = array;
          this.callbacks = [];
          this.observing = false;
        }
        _prototypeProperties(ArrayObserveObserver, null, {
          subscribe: {
            value: function subscribe(callback) {
              var _this = this;
              var callbacks = this.callbacks;
              callbacks.push(callback);
              if (!this.observing) {
                this.observing = true;
                Array.observe(this.array, function(changes) {
                  return _this.handleChanges(changes);
                });
              }
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName) {
              if (propertyName == "length") {
                return this.lengthObserver || (this.lengthObserver = new ArrayLengthObserver(this.array));
              } else {
                throw new Error("You cannot observe the " + propertyName + " property of an array.");
              }
            },
            writable: true,
            configurable: true
          },
          handleChanges: {
            value: function handleChanges(changeRecords) {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  splices;
              if (!i) {
                return ;
              }
              var splices = projectArraySplices(this.array, changeRecords);
              while (i--) {
                callbacks[i](splices);
              }
              if (this.lengthObserver) {
                this.lengthObserver.call(this.array.length);
              }
            },
            writable: true,
            configurable: true
          }
        });
        return ArrayObserveObserver;
      })();
      ArrayLengthObserver = (function() {
        function ArrayLengthObserver(array) {
          this.array = array;
          this.callbacks = [];
          this.currentValue = array.length;
        }
        _prototypeProperties(ArrayLengthObserver, null, {
          getValue: {
            value: function getValue() {
              return this.array.length;
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              this.array.length = newValue;
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call(newValue) {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.currentValue;
              while (i--) {
                callbacks[i](newValue, oldValue);
              }
              this.currentValue = newValue;
            },
            writable: true,
            configurable: true
          }
        });
        return ArrayLengthObserver;
      })();
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/ast", ["./path-observer", "./composite-observer"], function(_export) {
  "use strict";
  var PathObserver,
      CompositeObserver,
      _get,
      _inherits,
      _prototypeProperties,
      Expression,
      Chain,
      ValueConverter,
      Assign,
      Conditional,
      AccessScope,
      AccessMember,
      AccessKeyed,
      CallScope,
      CallMember,
      CallFunction,
      Binary,
      PrefixNot,
      LiteralPrimitive,
      LiteralString,
      LiteralArray,
      LiteralObject,
      Unparser,
      evalListCache;
  function evalList(scope, list, valueConverters) {
    var length = list.length,
        cacheLength,
        i;
    for (cacheLength = evalListCache.length; cacheLength <= length; ++cacheLength) {
      _evalListCache.push([]);
    }
    var result = evalListCache[length];
    for (i = 0; i < length; ++i) {
      result[i] = list[i].evaluate(scope, valueConverters);
    }
    return result;
  }
  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      if (typeof a == "string" && typeof b != "string") {
        return a + b.toString();
      }
      if (typeof a != "string" && typeof b == "string") {
        return a.toString() + b;
      }
      return a + b;
    }
    if (a != null) {
      return a;
    }
    if (b != null) {
      return b;
    }
    return 0;
  }
  function ensureFunctionFromMap(obj, name) {
    var func = obj[name];
    if (typeof func === "function") {
      return func;
    }
    if (func === null) {
      throw new Error("Undefined function " + name);
    } else {
      throw new Error("" + name + " is not a function");
    }
  }
  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key)];
    } else if (obj) {
      return obj[key];
    } else if (obj === null) {
      throw new Error("Accessing null object");
    } else {
      return obj[key];
    }
  }
  function setKeyed(obj, key, value) {
    if (Array.isArray(obj)) {
      var index = parseInt(key);
      if (obj.length <= index) {
        obj.length = index + 1;
      }
      obj[index] = value;
    } else {
      obj[key] = value;
    }
    return value;
  }
  return {
    setters: [function(_pathObserver) {
      PathObserver = _pathObserver.PathObserver;
    }, function(_compositeObserver) {
      CompositeObserver = _compositeObserver.CompositeObserver;
    }],
    execute: function() {
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Expression = _export("Expression", (function() {
        function Expression() {
          this.isChain = false;
          this.isAssignable = false;
        }
        _prototypeProperties(Expression, null, {
          evaluate: {
            value: function evaluate() {
              throw new Error("Cannot evaluate " + this);
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign() {
              throw new Error("Cannot assign to " + this);
            },
            writable: true,
            configurable: true
          },
          toString: {
            value: function toString() {
              return Unparser.unparse(this);
            },
            writable: true,
            configurable: true
          }
        });
        return Expression;
      })());
      Chain = _export("Chain", (function(Expression) {
        function Chain(expressions) {
          _get(Object.getPrototypeOf(Chain.prototype), "constructor", this).call(this);
          this.expressions = expressions;
          this.isChain = true;
        }
        _inherits(Chain, Expression);
        _prototypeProperties(Chain, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var result,
                  expressions = this.expressions,
                  length = expressions.length,
                  i,
                  last;
              for (i = 0; i < length; ++i) {
                last = expressions[i].evaluate(scope, valueConverters);
                if (last !== null) {
                  result = last;
                }
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitChain(this);
            },
            writable: true,
            configurable: true
          }
        });
        return Chain;
      })(Expression));
      ValueConverter = _export("ValueConverter", (function(Expression) {
        function ValueConverter(expression, name, args, allArgs) {
          _get(Object.getPrototypeOf(ValueConverter.prototype), "constructor", this).call(this);
          this.expression = expression;
          this.name = name;
          this.args = args;
          this.allArgs = allArgs;
        }
        _inherits(ValueConverter, Expression);
        _prototypeProperties(ValueConverter, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var converter = valueConverters(this.name);
              if (!converter) {
                throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
              }
              if ("toView" in converter) {
                return converter.toView.apply(converter, evalList(scope, this.allArgs, valueConverters));
              }
              return this.allArgs[0].evaluate(scope, valueConverters);
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value, valueConverters) {
              var converter = valueConverters(this.name);
              if (!converter) {
                throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
              }
              if ("fromView" in converter) {
                value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, valueConverters)));
              }
              return this.allArgs[0].assign(scope, value, valueConverters);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitValueConverter(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              for (i = 0, ii = this.allArgs.length; i < ii; ++i) {
                exp = this.allArgs[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return ValueConverter;
      })(Expression));
      Assign = _export("Assign", (function(Expression) {
        function Assign(target, value) {
          _get(Object.getPrototypeOf(Assign.prototype), "constructor", this).call(this);
          this.target = target;
          this.value = value;
        }
        _inherits(Assign, Expression);
        _prototypeProperties(Assign, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return this.target.assign(scope, this.value.evaluate(scope, valueConverters));
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(vistor) {
              vistor.visitAssign(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              return {value: this.evaluate(scope, binding.valueConverterLookupFunction)};
            },
            writable: true,
            configurable: true
          }
        });
        return Assign;
      })(Expression));
      Conditional = _export("Conditional", (function(Expression) {
        function Conditional(condition, yes, no) {
          _get(Object.getPrototypeOf(Conditional.prototype), "constructor", this).call(this);
          this.condition = condition;
          this.yes = yes;
          this.no = no;
        }
        _inherits(Conditional, Expression);
        _prototypeProperties(Conditional, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return !!this.condition.evaluate(scope) ? this.yes.evaluate(scope) : this.no.evaluate(scope);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitConditional(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var conditionInfo = this.condition.connect(binding, scope),
                  yesInfo = this.yes.connect(binding, scope),
                  noInfo = this.no.connect(binding, scope),
                  childObservers = [],
                  observer;
              if (conditionInfo.observer) {
                childObservers.push(conditionInfo.observer);
              }
              if (yesInfo.observer) {
                childObservers.push(yesInfo.observer);
              }
              if (noInfo.observer) {
                childObservers.push(noInfo.observer);
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return Conditional;
      })(Expression));
      AccessScope = _export("AccessScope", (function(Expression) {
        function AccessScope(name) {
          _get(Object.getPrototypeOf(AccessScope.prototype), "constructor", this).call(this);
          this.name = name;
          this.isAssignable = true;
        }
        _inherits(AccessScope, Expression);
        _prototypeProperties(AccessScope, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return scope[this.name];
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value) {
              return scope[this.name] = value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitAccessScope(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var observer = binding.getObserver(scope, this.name);
              return {
                value: observer.getValue(),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return AccessScope;
      })(Expression));
      AccessMember = _export("AccessMember", (function(Expression) {
        function AccessMember(object, name) {
          _get(Object.getPrototypeOf(AccessMember.prototype), "constructor", this).call(this);
          this.object = object;
          this.name = name;
          this.isAssignable = true;
        }
        _inherits(AccessMember, Expression);
        _prototypeProperties(AccessMember, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var instance = this.object.evaluate(scope, valueConverters);
              return instance === null || instance === undefined ? instance : instance[this.name];
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value) {
              var instance = this.object.evaluate(scope);
              if (instance === null || instance === undefined) {
                instance = {};
                this.object.assign(scope, instance);
              }
              return instance[this.name] = value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitAccessMember(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var info = this.object.connect(binding, scope),
                  objectInstance = info.value,
                  objectObserver = info.observer,
                  observer;
              if (objectObserver) {
                observer = new PathObserver(objectObserver, function(value) {
                  if (value == null || value == undefined) {
                    return value;
                  }
                  return binding.getObserver(value, _this.name);
                }, objectInstance);
              } else {
                observer = binding.getObserver(objectInstance, this.name);
              }
              return {
                value: objectInstance == null ? null : objectInstance[this.name],
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return AccessMember;
      })(Expression));
      AccessKeyed = _export("AccessKeyed", (function(Expression) {
        function AccessKeyed(object, key) {
          _get(Object.getPrototypeOf(AccessKeyed.prototype), "constructor", this).call(this);
          this.object = object;
          this.key = key;
          this.isAssignable = true;
        }
        _inherits(AccessKeyed, Expression);
        _prototypeProperties(AccessKeyed, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var instance = this.object.evaluate(scope, valueConverters);
              var lookup = this.key.evaluate(scope, valueConverters);
              return getKeyed(instance, lookup);
            },
            writable: true,
            configurable: true
          },
          assign: {
            value: function assign(scope, value) {
              var instance = this.object.evaluate(scope);
              var lookup = this.key.evaluate(scope);
              return setKeyed(instance, lookup, value);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitAccessKeyed(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var objectInfo = this.object.connect(binding, scope),
                  keyInfo = this.key.connect(binding, scope),
                  childObservers = [],
                  observer;
              if (objectInfo.observer) {
                childObservers.push(objectInfo.observer);
              }
              if (keyInfo.observer) {
                childObservers.push(keyInfo.observer);
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return AccessKeyed;
      })(Expression));
      CallScope = _export("CallScope", (function(Expression) {
        function CallScope(name, args) {
          _get(Object.getPrototypeOf(CallScope.prototype), "constructor", this).call(this);
          this.name = name;
          this.args = args;
        }
        _inherits(CallScope, Expression);
        _prototypeProperties(CallScope, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters, args) {
              args = args || evalList(scope, this.args, valueConverters);
              return ensureFunctionFromMap(scope, this.name).apply(scope, args);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitCallScope(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              for (i = 0, ii = this.args.length; i < ii; ++i) {
                exp = this.args[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return CallScope;
      })(Expression));
      CallMember = _export("CallMember", (function(Expression) {
        function CallMember(object, name, args) {
          _get(Object.getPrototypeOf(CallMember.prototype), "constructor", this).call(this);
          this.object = object;
          this.name = name;
          this.args = args;
        }
        _inherits(CallMember, Expression);
        _prototypeProperties(CallMember, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters, args) {
              var instance = this.object.evaluate(scope, valueConverters);
              args = args || evalList(scope, this.args, valueConverters);
              return ensureFunctionFromMap(instance, this.name).apply(instance, args);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitCallMember(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  objectInfo = this.object.connect(binding, scope),
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              if (objectInfo.observer) {
                childObservers.push(objectInfo.observer);
              }
              for (i = 0, ii = this.args.length; i < ii; ++i) {
                exp = this.args[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return CallMember;
      })(Expression));
      CallFunction = _export("CallFunction", (function(Expression) {
        function CallFunction(func, args) {
          _get(Object.getPrototypeOf(CallFunction.prototype), "constructor", this).call(this);
          this.func = func;
          this.args = args;
        }
        _inherits(CallFunction, Expression);
        _prototypeProperties(CallFunction, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters, args) {
              var func = this.func.evaluate(scope, valueConverters);
              if (typeof func !== "function") {
                throw new Error("" + this.func + " is not a function");
              } else {
                return func.apply(null, args || evalList(scope, this.args, valueConverters));
              }
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitCallFunction(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  funcInfo = this.func.connect(binding, scope),
                  childObservers = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              if (funcInfo.observer) {
                childObservers.push(funcInfo.observer);
              }
              for (i = 0, ii = this.args.length; i < ii; ++i) {
                exp = this.args[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return CallFunction;
      })(Expression));
      Binary = _export("Binary", (function(Expression) {
        function Binary(operation, left, right) {
          _get(Object.getPrototypeOf(Binary.prototype), "constructor", this).call(this);
          this.operation = operation;
          this.left = left;
          this.right = right;
        }
        _inherits(Binary, Expression);
        _prototypeProperties(Binary, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var left = this.left.evaluate(scope);
              switch (this.operation) {
                case "&&":
                  return !!left && !!this.right.evaluate(scope);
                case "||":
                  return !!left || !!this.right.evaluate(scope);
              }
              var right = this.right.evaluate(scope);
              switch (this.operation) {
                case "==":
                  return left == right;
                case "===":
                  return left === right;
                case "!=":
                  return left != right;
                case "!==":
                  return left !== right;
              }
              if (left === null || right === null) {
                switch (this.operation) {
                  case "+":
                    if (left != null)
                      return left;
                    if (right != null)
                      return right;
                    return 0;
                  case "-":
                    if (left != null)
                      return left;
                    if (right != null)
                      return 0 - right;
                    return 0;
                }
                return null;
              }
              switch (this.operation) {
                case "+":
                  return autoConvertAdd(left, right);
                case "-":
                  return left - right;
                case "*":
                  return left * right;
                case "/":
                  return left / right;
                case "%":
                  return left % right;
                case "<":
                  return left < right;
                case ">":
                  return left > right;
                case "<=":
                  return left <= right;
                case ">=":
                  return left >= right;
                case "^":
                  return left ^ right;
                case "&":
                  return left & right;
              }
              throw new Error("Internal error [" + this.operation + "] not handled");
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitBinary(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var leftInfo = this.left.connect(binding, scope),
                  rightInfo = this.right.connect(binding, scope),
                  childObservers = [],
                  observer;
              if (leftInfo.observer) {
                childObservers.push(leftInfo.observer);
              }
              if (rightInfo.observer) {
                childObservers.push(rightInfo.observer);
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: this.evaluate(scope, binding.valueConverterLookupFunction),
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return Binary;
      })(Expression));
      PrefixNot = _export("PrefixNot", (function(Expression) {
        function PrefixNot(operation, expression) {
          _get(Object.getPrototypeOf(PrefixNot.prototype), "constructor", this).call(this);
          this.operation = operation;
          this.expression = expression;
        }
        _inherits(PrefixNot, Expression);
        _prototypeProperties(PrefixNot, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return !this.expression.evaluate(scope);
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitPrefix(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var info = this.expression.connect(binding, scope),
                  observer;
              if (info.observer) {
                observer = new CompositeObserver([info.observer], function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: !info.value,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return PrefixNot;
      })(Expression));
      LiteralPrimitive = _export("LiteralPrimitive", (function(Expression) {
        function LiteralPrimitive(value) {
          _get(Object.getPrototypeOf(LiteralPrimitive.prototype), "constructor", this).call(this);
          this.value = value;
        }
        _inherits(LiteralPrimitive, Expression);
        _prototypeProperties(LiteralPrimitive, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return this.value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralPrimitive(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              return {value: this.value};
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralPrimitive;
      })(Expression));
      LiteralString = _export("LiteralString", (function(Expression) {
        function LiteralString(value) {
          _get(Object.getPrototypeOf(LiteralString.prototype), "constructor", this).call(this);
          this.value = value;
        }
        _inherits(LiteralString, Expression);
        _prototypeProperties(LiteralString, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              return this.value;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralString(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              return {value: this.value};
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralString;
      })(Expression));
      LiteralArray = _export("LiteralArray", (function(Expression) {
        function LiteralArray(elements) {
          _get(Object.getPrototypeOf(LiteralArray.prototype), "constructor", this).call(this);
          this.elements = elements;
        }
        _inherits(LiteralArray, Expression);
        _prototypeProperties(LiteralArray, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var elements = this.elements,
                  length = elements.length,
                  result = [],
                  i;
              for (i = 0; i < length; ++i) {
                result[i] = elements[i].evaluate(scope, valueConverters);
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralArray(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  results = [],
                  i,
                  ii,
                  exp,
                  expInfo;
              for (i = 0, ii = this.elements.length; i < ii; ++i) {
                exp = this.elements[i];
                expInfo = exp.connect(binding, scope);
                if (expInfo.observer) {
                  childObservers.push(expInfo.observer);
                }
                results[i] = expInfo.value;
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: results,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralArray;
      })(Expression));
      LiteralObject = _export("LiteralObject", (function(Expression) {
        function LiteralObject(keys, values) {
          _get(Object.getPrototypeOf(LiteralObject.prototype), "constructor", this).call(this);
          this.keys = keys;
          this.values = values;
        }
        _inherits(LiteralObject, Expression);
        _prototypeProperties(LiteralObject, null, {
          evaluate: {
            value: function evaluate(scope, valueConverters) {
              var instance = {},
                  keys = this.keys,
                  values = this.values,
                  length = keys.length,
                  i;
              for (i = 0; i < length; ++i) {
                instance[keys[i]] = values[i].evaluate(scope, valueConverters);
              }
              return instance;
            },
            writable: true,
            configurable: true
          },
          accept: {
            value: function accept(visitor) {
              visitor.visitLiteralObject(this);
            },
            writable: true,
            configurable: true
          },
          connect: {
            value: function connect(binding, scope) {
              var _this = this;
              var observer,
                  childObservers = [],
                  instance = {},
                  keys = this.keys,
                  values = this.values,
                  length = keys.length,
                  i,
                  valueInfo;
              for (i = 0; i < length; ++i) {
                valueInfo = values[i].connect(binding, scope);
                if (valueInfo.observer) {
                  childObservers.push(valueInfo.observer);
                }
                instance[keys[i]] = valueInfo.value;
              }
              if (childObservers.length) {
                observer = new CompositeObserver(childObservers, function() {
                  return _this.evaluate(scope, binding.valueConverterLookupFunction);
                });
              }
              return {
                value: instance,
                observer: observer
              };
            },
            writable: true,
            configurable: true
          }
        });
        return LiteralObject;
      })(Expression));
      Unparser = _export("Unparser", (function() {
        function Unparser(buffer) {
          this.buffer = buffer;
        }
        _prototypeProperties(Unparser, {unparse: {
            value: function unparse(expression) {
              var buffer = [],
                  visitor = new Unparser(buffer);
              expression.accept(visitor);
              return buffer.join("");
            },
            writable: true,
            configurable: true
          }}, {
          write: {
            value: function write(text) {
              this.buffer.push(text);
            },
            writable: true,
            configurable: true
          },
          writeArgs: {
            value: function writeArgs(args) {
              var i,
                  length;
              this.write("(");
              for (i = 0, length = args.length; i < length; ++i) {
                if (i !== 0) {
                  this.write(",");
                }
                args[i].accept(this);
              }
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitChain: {
            value: function visitChain(chain) {
              var expressions = chain.expressions,
                  length = expressions.length,
                  i;
              for (i = 0; i < length; ++i) {
                if (i !== 0) {
                  this.write(";");
                }
                expressions[i].accept(this);
              }
            },
            writable: true,
            configurable: true
          },
          visitValueConverter: {
            value: function visitValueConverter(converter) {
              var args = converter.args,
                  length = args.length,
                  i;
              this.write("(");
              converter.expression.accept(this);
              this.write("|" + converter.name);
              for (i = 0; i < length; ++i) {
                this.write(" :");
                args[i].accept(this);
              }
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitAssign: {
            value: function visitAssign(assign) {
              assign.target.accept(this);
              this.write("=");
              assign.value.accept(this);
            },
            writable: true,
            configurable: true
          },
          visitConditional: {
            value: function visitConditional(conditional) {
              conditional.condition.accept(this);
              this.write("?");
              conditional.yes.accept(this);
              this.write(":");
              conditional.no.accept(this);
            },
            writable: true,
            configurable: true
          },
          visitAccessScope: {
            value: function visitAccessScope(access) {
              this.write(access.name);
            },
            writable: true,
            configurable: true
          },
          visitAccessMember: {
            value: function visitAccessMember(access) {
              access.object.accept(this);
              this.write("." + access.name);
            },
            writable: true,
            configurable: true
          },
          visitAccessKeyed: {
            value: function visitAccessKeyed(access) {
              access.object.accept(this);
              this.write("[");
              access.key.accept(this);
              this.write("]");
            },
            writable: true,
            configurable: true
          },
          visitCallScope: {
            value: function visitCallScope(call) {
              this.write(call.name);
              this.writeArgs(call.args);
            },
            writable: true,
            configurable: true
          },
          visitCallFunction: {
            value: function visitCallFunction(call) {
              call.func.accept(this);
              this.writeArgs(call.args);
            },
            writable: true,
            configurable: true
          },
          visitCallMember: {
            value: function visitCallMember(call) {
              call.object.accept(this);
              this.write("." + call.name);
              this.writeArgs(call.args);
            },
            writable: true,
            configurable: true
          },
          visitPrefix: {
            value: function visitPrefix(prefix) {
              this.write("(" + prefix.operation);
              prefix.expression.accept(this);
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitBinary: {
            value: function visitBinary(binary) {
              this.write("(");
              binary.left.accept(this);
              this.write(binary.operation);
              binary.right.accept(this);
              this.write(")");
            },
            writable: true,
            configurable: true
          },
          visitLiteralPrimitive: {
            value: function visitLiteralPrimitive(literal) {
              this.write("" + literal.value);
            },
            writable: true,
            configurable: true
          },
          visitLiteralArray: {
            value: function visitLiteralArray(literal) {
              var elements = literal.elements,
                  length = elements.length,
                  i;
              this.write("[");
              for (i = 0; i < length; ++i) {
                if (i !== 0) {
                  this.write(",");
                }
                elements[i].accept(this);
              }
              this.write("]");
            },
            writable: true,
            configurable: true
          },
          visitLiteralObject: {
            value: function visitLiteralObject(literal) {
              var keys = literal.keys,
                  values = literal.values,
                  length = keys.length,
                  i;
              this.write("{");
              for (i = 0; i < length; ++i) {
                if (i !== 0) {
                  this.write(",");
                }
                this.write("'" + keys[i] + "':");
                values[i].accept(this);
              }
              this.write("}");
            },
            writable: true,
            configurable: true
          },
          visitLiteralString: {
            value: function visitLiteralString(literal) {
              var escaped = literal.value.replace(/'/g, "'");
              this.write("'" + escaped + "'");
            },
            writable: true,
            configurable: true
          }
        });
        return Unparser;
      })());
      evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/behaviors", ["aurelia-metadata", "aurelia-task-queue", "aurelia-binding", "./children", "./property", "./util"], function(_export) {
  "use strict";
  var Metadata,
      TaskQueue,
      ObserverLocator,
      ChildObserver,
      BehaviorProperty,
      hyphenate;
  _export("configureBehavior", configureBehavior);
  function configureBehavior(container, behavior, target, valuePropertyName) {
    var proto = target.prototype,
        taskQueue = container.get(TaskQueue),
        meta = Metadata.on(target),
        observerLocator = container.get(ObserverLocator),
        i,
        ii,
        properties;
    if (!behavior.name) {
      behavior.name = hyphenate(target.name);
    }
    behavior.target = target;
    behavior.observerLocator = observerLocator;
    behavior.handlesCreated = "created" in proto;
    behavior.handlesBind = "bind" in proto;
    behavior.handlesUnbind = "unbind" in proto;
    behavior.handlesAttached = "attached" in proto;
    behavior.handlesDetached = "detached" in proto;
    behavior.apiName = behavior.name.replace(/-([a-z])/g, function(m, w) {
      return w.toUpperCase();
    });
    properties = meta.all(BehaviorProperty);
    for (i = 0, ii = properties.length; i < ii; ++i) {
      properties[i].define(taskQueue, behavior);
    }
    properties = behavior.properties;
    if (properties.length === 0 && "valueChanged" in target.prototype) {
      new BehaviorProperty("value", "valueChanged", valuePropertyName || behavior.name).define(taskQueue, behavior);
    }
    if (properties.length !== 0) {
      target.initialize = function(executionContext) {
        var observerLookup = observerLocator.getObserversLookup(executionContext),
            i,
            ii,
            observer;
        for (i = 0, ii = properties.length; i < ii; ++i) {
          observer = properties[i].createObserver(executionContext);
          if (observer !== undefined) {
            observerLookup[observer.propertyName] = observer;
          }
        }
      };
    }
    behavior.childExpression = meta.first(ChildObserver);
  }
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function(_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function(_children) {
      ChildObserver = _children.ChildObserver;
    }, function(_property) {
      BehaviorProperty = _property.BehaviorProperty;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/templating@0.8.10/system/view-factory", ["aurelia-dependency-injection", "./view", "./view-slot", "./content-selector", "./resource-registry"], function(_export) {
  "use strict";
  var Container,
      View,
      ViewSlot,
      ContentSelector,
      ViewResources,
      _prototypeProperties,
      BoundViewFactory,
      defaultFactoryOptions,
      ViewFactory;
  function elementContainerGet(key) {
    if (key === Element) {
      return this.element;
    }
    if (key === BoundViewFactory) {
      return this.boundViewFactory || (this.boundViewFactory = new BoundViewFactory(this, this.instruction.viewFactory, this.executionContext));
    }
    if (key === ViewSlot) {
      if (this.viewSlot === undefined) {
        this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer, this.executionContext);
        this.children.push(this.viewSlot);
      }
      return this.viewSlot;
    }
    if (key === ViewResources) {
      return this.viewResources;
    }
    return this.superGet(key);
  }
  function createElementContainer(parent, element, instruction, executionContext, children, resources) {
    var container = parent.createChild(),
        providers,
        i;
    container.element = element;
    container.instruction = instruction;
    container.executionContext = executionContext;
    container.children = children;
    container.viewResources = resources;
    providers = instruction.providers;
    i = providers.length;
    while (i--) {
      container.registerSingleton(providers[i]);
    }
    container.superGet = container.get;
    container.get = elementContainerGet;
    return container;
  }
  function applyInstructions(containers, executionContext, element, instruction, behaviors, bindings, children, contentSelectors, resources) {
    var behaviorInstructions = instruction.behaviorInstructions,
        expressions = instruction.expressions,
        elementContainer,
        i,
        ii,
        current,
        instance;
    if (instruction.contentExpression) {
      bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
      element.parentNode.removeChild(element);
      return ;
    }
    if (instruction.contentSelector) {
      contentSelectors.push(new ContentSelector(element, instruction.selector));
      return ;
    }
    if (behaviorInstructions.length) {
      containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, executionContext, children, resources);
      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(elementContainer, current, element, bindings);
        if (instance.contentView) {
          children.push(instance.contentView);
        }
        behaviors.push(instance);
      }
    }
    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_view) {
      View = _view.View;
    }, function(_viewSlot) {
      ViewSlot = _viewSlot.ViewSlot;
    }, function(_contentSelector) {
      ContentSelector = _contentSelector.ContentSelector;
    }, function(_resourceRegistry) {
      ViewResources = _resourceRegistry.ViewResources;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      BoundViewFactory = _export("BoundViewFactory", (function() {
        function BoundViewFactory(parentContainer, viewFactory, executionContext) {
          this.parentContainer = parentContainer;
          this.viewFactory = viewFactory;
          this.executionContext = executionContext;
          this.factoryOptions = {behaviorInstance: false};
        }
        _prototypeProperties(BoundViewFactory, null, {create: {
            value: function create(executionContext) {
              var childContainer = this.parentContainer.createChild(),
                  context = executionContext || this.executionContext;
              this.factoryOptions.systemControlled = !executionContext;
              return this.viewFactory.create(childContainer, context, this.factoryOptions);
            },
            writable: true,
            configurable: true
          }});
        return BoundViewFactory;
      })());
      defaultFactoryOptions = {
        systemControlled: false,
        suppressBind: false
      };
      ViewFactory = _export("ViewFactory", (function() {
        function ViewFactory(template, instructions, resources) {
          this.template = template;
          this.instructions = instructions;
          this.resources = resources;
        }
        _prototypeProperties(ViewFactory, null, {create: {
            value: function create(container, executionContext) {
              var options = arguments[2] === undefined ? defaultFactoryOptions : arguments[2];
              var fragment = this.template.cloneNode(true),
                  instructables = fragment.querySelectorAll(".au-target"),
                  instructions = this.instructions,
                  resources = this.resources,
                  behaviors = [],
                  bindings = [],
                  children = [],
                  contentSelectors = [],
                  containers = {root: container},
                  i,
                  ii,
                  view;
              for (i = 0, ii = instructables.length; i < ii; ++i) {
                applyInstructions(containers, executionContext, instructables[i], instructions[i], behaviors, bindings, children, contentSelectors, resources);
              }
              view = new View(fragment, behaviors, bindings, children, options.systemControlled, contentSelectors);
              view.created(executionContext);
              if (!options.suppressBind) {
                view.bind(executionContext);
              }
              return view;
            },
            writable: true,
            configurable: true
          }});
        return ViewFactory;
      })());
    }
  };
});

System.register("github:aurelia/logging-console@0.2.2", ["github:aurelia/logging-console@0.2.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/templating-binding@0.8.4/system/binding-language", ["aurelia-templating", "aurelia-binding", "./syntax-interpreter"], function(_export) {
  "use strict";
  var BindingLanguage,
      Parser,
      ObserverLocator,
      BindingExpression,
      NameExpression,
      ONE_WAY,
      SyntaxInterpreter,
      _prototypeProperties,
      _inherits,
      info,
      TemplatingBindingLanguage,
      InterpolationBindingExpression,
      InterpolationBinding;
  return {
    setters: [function(_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
    }, function(_aureliaBinding) {
      Parser = _aureliaBinding.Parser;
      ObserverLocator = _aureliaBinding.ObserverLocator;
      BindingExpression = _aureliaBinding.BindingExpression;
      NameExpression = _aureliaBinding.NameExpression;
      ONE_WAY = _aureliaBinding.ONE_WAY;
    }, function(_syntaxInterpreter) {
      SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      info = {};
      TemplatingBindingLanguage = (function(BindingLanguage) {
        function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter) {
          this.parser = parser;
          this.observerLocator = observerLocator;
          this.syntaxInterpreter = syntaxInterpreter;
          this.interpolationRegex = /\${(.*?)}/g;
          syntaxInterpreter.language = this;
          this.attributeMap = syntaxInterpreter.attributeMap = {
            "class": "className",
            "for": "htmlFor"
          };
        }
        _inherits(TemplatingBindingLanguage, BindingLanguage);
        _prototypeProperties(TemplatingBindingLanguage, {inject: {
            value: function inject() {
              return [Parser, ObserverLocator, SyntaxInterpreter];
            },
            writable: true,
            enumerable: true,
            configurable: true
          }}, {
          inspectAttribute: {
            value: function inspectAttribute(resources, attrName, attrValue) {
              var parts = attrName.split(".");
              info.defaultBindingMode = null;
              if (parts.length == 2) {
                info.attrName = parts[0].trim();
                info.attrValue = attrValue;
                info.command = parts[1].trim();
                info.expression = null;
              } else if (attrName == "ref") {
                info.attrName = attrName;
                info.attrValue = attrValue;
                info.command = null;
                info.expression = new NameExpression(attrValue, "element");
              } else {
                info.attrName = attrName;
                info.attrValue = attrValue;
                info.command = null;
                info.expression = this.parseContent(resources, attrName, attrValue);
              }
              return info;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          createAttributeInstruction: {
            value: function createAttributeInstruction(resources, element, info, existingInstruction) {
              var instruction;
              if (info.expression) {
                if (info.attrName === "ref") {
                  return info.expression;
                }
                instruction = existingInstruction || {
                  attrName: info.attrName,
                  attributes: {}
                };
                instruction.attributes[info.attrName] = info.expression;
              } else if (info.command) {
                instruction = this.syntaxInterpreter.interpret(resources, element, info, existingInstruction);
              }
              return instruction;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          parseText: {
            value: function parseText(resources, value) {
              return this.parseContent(resources, "textContent", value);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          parseContent: {
            value: function parseContent(resources, attrName, attrValue) {
              var parts = attrValue.split(this.interpolationRegex),
                  i,
                  ii;
              if (parts.length <= 1) {
                return null;
              }
              for (i = 0, ii = parts.length; i < ii; ++i) {
                if (i % 2 === 0) {} else {
                  parts[i] = this.parser.parse(parts[i]);
                }
              }
              return new InterpolationBindingExpression(this.observerLocator, this.attributeMap[attrName] || attrName, parts, ONE_WAY, resources.valueConverterLookupFunction, attrName);
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return TemplatingBindingLanguage;
      })(BindingLanguage);
      _export("TemplatingBindingLanguage", TemplatingBindingLanguage);
      InterpolationBindingExpression = (function() {
        function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, valueConverterLookupFunction, attribute) {
          this.observerLocator = observerLocator;
          this.targetProperty = targetProperty;
          this.parts = parts;
          this.mode = mode;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
          this.attribute = attribute;
          this.discrete = false;
        }
        _prototypeProperties(InterpolationBindingExpression, null, {createBinding: {
            value: function createBinding(target) {
              return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
            },
            writable: true,
            enumerable: true,
            configurable: true
          }});
        return InterpolationBindingExpression;
      })();
      _export("InterpolationBindingExpression", InterpolationBindingExpression);
      InterpolationBinding = (function() {
        function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, valueConverterLookupFunction) {
          this.observerLocator = observerLocator;
          this.parts = parts;
          this.targetProperty = observerLocator.getObserver(target, targetProperty);
          this.mode = mode;
          this.valueConverterLookupFunction = valueConverterLookupFunction;
          this.toDispose = [];
        }
        _prototypeProperties(InterpolationBinding, null, {
          getObserver: {
            value: function getObserver(obj, propertyName) {
              return this.observerLocator.getObserver(obj, propertyName);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          bind: {
            value: function bind(source) {
              this.source = source;
              if (this.mode == ONE_WAY) {
                this.unbind();
                this.connect();
                this.setValue();
              } else {
                this.setValue();
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          setValue: {
            value: function setValue() {
              var value = this.interpolate();
              this.targetProperty.setValue(value);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          connect: {
            value: function connect() {
              var _this = this;
              var info,
                  parts = this.parts,
                  source = this.source,
                  toDispose = this.toDispose = [],
                  i,
                  ii;
              for (i = 0, ii = parts.length; i < ii; ++i) {
                if (i % 2 === 0) {} else {
                  info = parts[i].connect(this, source);
                  if (info.observer) {
                    toDispose.push(info.observer.subscribe(function(newValue) {
                      _this.setValue();
                    }));
                  }
                }
              }
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          interpolate: {
            value: function interpolate() {
              var value = "",
                  parts = this.parts,
                  source = this.source,
                  valueConverterLookupFunction = this.valueConverterLookupFunction,
                  i,
                  ii,
                  temp;
              for (i = 0, ii = parts.length; i < ii; ++i) {
                if (i % 2 === 0) {
                  value += parts[i];
                } else {
                  temp = parts[i].evaluate(source, valueConverterLookupFunction);
                  value += typeof temp !== "undefined" && temp !== null ? temp.toString() : "";
                }
              }
              return value;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          unbind: {
            value: function unbind() {
              var i,
                  ii,
                  toDispose = this.toDispose;
              if (toDispose) {
                for (i = 0, ii = toDispose.length; i < ii; ++i) {
                  toDispose[i]();
                }
              }
              this.toDispose = null;
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return InterpolationBinding;
      })();
    }
  };
});

System.register("github:aurelia/route-recognizer@0.2.2/system/index", ["./dsl"], function(_export) {
  "use strict";
  var map,
      specials,
      escapeRegex,
      oCreate,
      RouteRecognizer;
  function isArray(test) {
    return Object.prototype.toString.call(test) === "[object Array]";
  }
  function StaticSegment(string) {
    this.string = string;
  }
  function DynamicSegment(name) {
    this.name = name;
  }
  function StarSegment(name) {
    this.name = name;
  }
  function EpsilonSegment() {}
  function parse(route, names, types) {
    if (route.charAt(0) === "/") {
      route = route.substr(1);
    }
    var segments = route.split("/"),
        results = [];
    for (var i = 0,
        l = segments.length; i < l; i++) {
      var segment = segments[i],
          match;
      if (match = segment.match(/^:([^\/]+)$/)) {
        results.push(new DynamicSegment(match[1]));
        names.push(match[1]);
        types.dynamics++;
      } else if (match = segment.match(/^\*([^\/]+)$/)) {
        results.push(new StarSegment(match[1]));
        names.push(match[1]);
        types.stars++;
      } else if (segment === "") {
        results.push(new EpsilonSegment());
      } else {
        results.push(new StaticSegment(segment));
        types.statics++;
      }
    }
    return results;
  }
  function State(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
  }
  function sortSolutions(states) {
    return states.sort(function(a, b) {
      if (a.types.stars !== b.types.stars) {
        return a.types.stars - b.types.stars;
      }
      if (a.types.stars) {
        if (a.types.statics !== b.types.statics) {
          return b.types.statics - a.types.statics;
        }
        if (a.types.dynamics !== b.types.dynamics) {
          return b.types.dynamics - a.types.dynamics;
        }
      }
      if (a.types.dynamics !== b.types.dynamics) {
        return a.types.dynamics - b.types.dynamics;
      }
      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }
      return 0;
    });
  }
  function recognizeChar(states, ch) {
    var nextStates = [];
    for (var i = 0,
        l = states.length; i < l; i++) {
      var state = states[i];
      nextStates = nextStates.concat(state.match(ch));
    }
    return nextStates;
  }
  function RecognizeResults(queryParams) {
    this.queryParams = queryParams || {};
  }
  function findHandler(state, path, queryParams) {
    var handlers = state.handlers,
        regex = state.regex;
    var captures = path.match(regex),
        currentCapture = 1;
    var result = new RecognizeResults(queryParams);
    for (var i = 0,
        l = handlers.length; i < l; i++) {
      var handler = handlers[i],
          names = handler.names,
          params = {};
      for (var j = 0,
          m = names.length; j < m; j++) {
        params[names[j]] = captures[currentCapture++];
      }
      result.push({
        handler: handler.handler,
        params: params,
        isDynamic: !!names.length
      });
    }
    return result;
  }
  function addSegment(currentState, segment) {
    segment.eachChar(function(ch) {
      var state;
      currentState = currentState.put(ch);
    });
    return currentState;
  }
  return {
    setters: [function(_dsl) {
      map = _dsl.map;
    }],
    execute: function() {
      specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
      escapeRegex = new RegExp("(\\" + specials.join("|\\") + ")", "g");
      StaticSegment.prototype = {
        eachChar: function(callback) {
          var string = this.string,
              ch;
          for (var i = 0,
              l = string.length; i < l; i++) {
            ch = string.charAt(i);
            callback({validChars: ch});
          }
        },
        regex: function() {
          return this.string.replace(escapeRegex, "\\$1");
        },
        generate: function() {
          return this.string;
        }
      };
      DynamicSegment.prototype = {
        eachChar: function(callback) {
          callback({
            invalidChars: "/",
            repeat: true
          });
        },
        regex: function() {
          return "([^/]+)";
        },
        generate: function(params) {
          return params[this.name];
        }
      };
      StarSegment.prototype = {
        eachChar: function(callback) {
          callback({
            invalidChars: "",
            repeat: true
          });
        },
        regex: function() {
          return "(.+)";
        },
        generate: function(params) {
          return params[this.name];
        }
      };
      EpsilonSegment.prototype = {
        eachChar: function() {},
        regex: function() {
          return "";
        },
        generate: function() {
          return "";
        }
      };
      State.prototype = {
        get: function(charSpec) {
          var nextStates = this.nextStates;
          for (var i = 0,
              l = nextStates.length; i < l; i++) {
            var child = nextStates[i];
            var isEqual = child.charSpec.validChars === charSpec.validChars;
            isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;
            if (isEqual) {
              return child;
            }
          }
        },
        put: function(charSpec) {
          var state;
          if (state = this.get(charSpec)) {
            return state;
          }
          state = new State(charSpec);
          this.nextStates.push(state);
          if (charSpec.repeat) {
            state.nextStates.push(state);
          }
          return state;
        },
        match: function(ch) {
          var nextStates = this.nextStates,
              child,
              charSpec,
              chars;
          var returned = [];
          for (var i = 0,
              l = nextStates.length; i < l; i++) {
            child = nextStates[i];
            charSpec = child.charSpec;
            if (typeof(chars = charSpec.validChars) !== "undefined") {
              if (chars.indexOf(ch) !== -1) {
                returned.push(child);
              }
            } else if (typeof(chars = charSpec.invalidChars) !== "undefined") {
              if (chars.indexOf(ch) === -1) {
                returned.push(child);
              }
            }
          }
          return returned;
        }
      };
      oCreate = Object.create || function(proto) {
        var F = function() {};
        F.prototype = proto;
        return new F();
      };
      RecognizeResults.prototype = oCreate({
        splice: Array.prototype.splice,
        slice: Array.prototype.slice,
        push: Array.prototype.push,
        length: 0,
        queryParams: null
      });
      RouteRecognizer = _export("RouteRecognizer", function() {
        this.rootState = new State();
        this.names = {};
      });
      RouteRecognizer.prototype = {
        add: function(routes, options) {
          var currentState = this.rootState,
              regex = "^",
              types = {
                statics: 0,
                dynamics: 0,
                stars: 0
              },
              handlers = [],
              allSegments = [],
              name;
          var isEmpty = true;
          for (var i = 0,
              l = routes.length; i < l; i++) {
            var route = routes[i],
                names = [];
            var segments = parse(route.path, names, types);
            allSegments = allSegments.concat(segments);
            for (var j = 0,
                m = segments.length; j < m; j++) {
              var segment = segments[j];
              if (segment instanceof EpsilonSegment) {
                continue;
              }
              isEmpty = false;
              currentState = currentState.put({validChars: "/"});
              regex += "/";
              currentState = addSegment(currentState, segment);
              regex += segment.regex();
            }
            var handler = {
              handler: route.handler,
              names: names
            };
            handlers.push(handler);
          }
          if (isEmpty) {
            currentState = currentState.put({validChars: "/"});
            regex += "/";
          }
          currentState.handlers = handlers;
          currentState.regex = new RegExp(regex + "$");
          currentState.types = types;
          if (name = options && options.as) {
            this.names[name] = {
              segments: allSegments,
              handlers: handlers
            };
          }
        },
        handlersFor: function(name) {
          var route = this.names[name],
              result = [];
          if (!route) {
            throw new Error("There is no route named " + name);
          }
          for (var i = 0,
              l = route.handlers.length; i < l; i++) {
            result.push(route.handlers[i]);
          }
          return result;
        },
        hasRoute: function(name) {
          return !!this.names[name];
        },
        generate: function(name, params) {
          var route = this.names[name],
              output = "";
          if (!route) {
            throw new Error("There is no route named " + name);
          }
          var segments = route.segments;
          for (var i = 0,
              l = segments.length; i < l; i++) {
            var segment = segments[i];
            if (segment instanceof EpsilonSegment) {
              continue;
            }
            output += "/";
            output += segment.generate(params);
          }
          if (output.charAt(0) !== "/") {
            output = "/" + output;
          }
          if (params && params.queryParams) {
            output += this.generateQueryString(params.queryParams, route.handlers);
          }
          return output;
        },
        generateQueryString: function(params, handlers) {
          var pairs = [];
          var keys = [];
          for (var key in params) {
            if (params.hasOwnProperty(key)) {
              keys.push(key);
            }
          }
          keys.sort();
          for (var i = 0,
              len = keys.length; i < len; i++) {
            key = keys[i];
            var value = params[key];
            if (value === null) {
              continue;
            }
            var pair = encodeURIComponent(key);
            if (isArray(value)) {
              for (var j = 0,
                  l = value.length; j < l; j++) {
                var arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
                pairs.push(arrayPair);
              }
            } else {
              pair += "=" + encodeURIComponent(value);
              pairs.push(pair);
            }
          }
          if (pairs.length === 0) {
            return "";
          }
          return "?" + pairs.join("&");
        },
        parseQueryString: function(queryString) {
          var pairs = queryString.split("&"),
              queryParams = {};
          for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("="),
                key = decodeURIComponent(pair[0]),
                keyLength = key.length,
                isArray = false,
                value;
            if (pair.length === 1) {
              value = "true";
            } else {
              if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
                isArray = true;
                key = key.slice(0, keyLength - 2);
                if (!queryParams[key]) {
                  queryParams[key] = [];
                }
              }
              value = pair[1] ? decodeURIComponent(pair[1]) : "";
            }
            if (isArray) {
              queryParams[key].push(value);
            } else {
              queryParams[key] = value;
            }
          }
          return queryParams;
        },
        recognize: function(path) {
          var states = [this.rootState],
              pathLen,
              i,
              l,
              queryStart,
              queryParams = {},
              isSlashDropped = false;
          queryStart = path.indexOf("?");
          if (queryStart !== -1) {
            var queryString = path.substr(queryStart + 1, path.length);
            path = path.substr(0, queryStart);
            queryParams = this.parseQueryString(queryString);
          }
          path = decodeURI(path);
          if (path.charAt(0) !== "/") {
            path = "/" + path;
          }
          pathLen = path.length;
          if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
            path = path.substr(0, pathLen - 1);
            isSlashDropped = true;
          }
          for (i = 0, l = path.length; i < l; i++) {
            states = recognizeChar(states, path.charAt(i));
            if (!states.length) {
              break;
            }
          }
          var solutions = [];
          for (i = 0, l = states.length; i < l; i++) {
            if (states[i].handlers) {
              solutions.push(states[i]);
            }
          }
          states = sortSolutions(solutions);
          var state = solutions[0];
          if (state && state.handlers) {
            if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
              path = path + "/";
            }
            return findHandler(state, path, queryParams);
          }
        }
      };
      RouteRecognizer.prototype.map = map;
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/navigation-context", ["./navigation-plan"], function(_export) {
  "use strict";
  var REPLACE,
      _prototypeProperties,
      NavigationContext,
      CommitChangesStep;
  return {
    setters: [function(_navigationPlan) {
      REPLACE = _navigationPlan.REPLACE;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      NavigationContext = _export("NavigationContext", (function() {
        function NavigationContext(router, nextInstruction) {
          this.router = router;
          this.nextInstruction = nextInstruction;
          this.currentInstruction = router.currentInstruction;
          this.prevInstruction = router.currentInstruction;
        }
        _prototypeProperties(NavigationContext, null, {
          commitChanges: {
            value: function commitChanges(waitToSwap) {
              var next = this.nextInstruction,
                  prev = this.prevInstruction,
                  viewPortInstructions = next.viewPortInstructions,
                  router = this.router,
                  loads = [],
                  delaySwaps = [];
              router.currentInstruction = next;
              if (prev) {
                prev.config.navModel.isActive = false;
              }
              next.config.navModel.isActive = true;
              router.refreshBaseUrl();
              router.refreshNavigation();
              for (var viewPortName in viewPortInstructions) {
                var viewPortInstruction = viewPortInstructions[viewPortName];
                var viewPort = router.viewPorts[viewPortName];
                if (!viewPort) {
                  throw new Error("There was no router-view found in the view for " + viewPortInstruction.moduleId + ".");
                }
                if (viewPortInstruction.strategy === REPLACE) {
                  if (waitToSwap) {
                    delaySwaps.push({
                      viewPort: viewPort,
                      viewPortInstruction: viewPortInstruction
                    });
                  }
                  loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function(x) {
                    if ("childNavigationContext" in viewPortInstruction) {
                      return viewPortInstruction.childNavigationContext.commitChanges();
                    }
                  }));
                } else {
                  if ("childNavigationContext" in viewPortInstruction) {
                    loads.push(viewPortInstruction.childNavigationContext.commitChanges(waitToSwap));
                  }
                }
              }
              return Promise.all(loads).then(function() {
                delaySwaps.forEach(function(x) {
                  return x.viewPort.swap(x.viewPortInstruction);
                });
              });
            },
            writable: true,
            configurable: true
          },
          buildTitle: {
            value: function buildTitle() {
              var separator = arguments[0] === undefined ? " | " : arguments[0];
              var next = this.nextInstruction,
                  title = next.config.navModel.title || "",
                  viewPortInstructions = next.viewPortInstructions,
                  childTitles = [];
              for (var viewPortName in viewPortInstructions) {
                var viewPortInstruction = viewPortInstructions[viewPortName];
                if ("childNavigationContext" in viewPortInstruction) {
                  var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
                  if (childTitle) {
                    childTitles.push(childTitle);
                  }
                }
              }
              if (childTitles.length) {
                title = childTitles.join(separator) + (title ? separator : "") + title;
              }
              if (this.router.title) {
                title += (title ? separator : "") + this.router.title;
              }
              return title;
            },
            writable: true,
            configurable: true
          }
        });
        return NavigationContext;
      })());
      CommitChangesStep = _export("CommitChangesStep", (function() {
        function CommitChangesStep() {}
        _prototypeProperties(CommitChangesStep, null, {run: {
            value: function run(navigationContext, next) {
              navigationContext.commitChanges(true);
              var title = navigationContext.buildTitle();
              if (title) {
                document.title = title;
              }
              return next();
            },
            writable: true,
            configurable: true
          }});
        return CommitChangesStep;
      })());
    }
  };
});

System.register("github:aurelia/history@0.2.2", ["github:aurelia/history@0.2.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.5.5/system/activation", ["./navigation-plan", "./navigation-commands", "./util"], function(_export) {
  "use strict";
  var INVOKE_LIFECYCLE,
      REPLACE,
      isNavigationCommand,
      processPotential,
      _toArray,
      _prototypeProperties,
      affirmations,
      CanDeactivatePreviousStep,
      CanActivateNextStep,
      DeactivatePreviousStep,
      ActivateNextStep;
  function processDeactivatable(plan, callbackName, next, ignoreResult) {
    var infos = findDeactivatable(plan, callbackName),
        i = infos.length;
    function inspect(val) {
      if (ignoreResult || shouldContinue(val)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }
    function iterate() {
      if (i--) {
        try {
          var controller = infos[i];
          var result = controller[callbackName]();
          return processPotential(result, inspect, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }
    return iterate();
  }
  function findDeactivatable(plan, callbackName, list) {
    list = list || [];
    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      var prevComponent = viewPortPlan.prevComponent;
      if ((viewPortPlan.strategy == INVOKE_LIFECYCLE || viewPortPlan.strategy == REPLACE) && prevComponent) {
        var controller = prevComponent.executionContext;
        if (callbackName in controller) {
          list.push(controller);
        }
      }
      if (viewPortPlan.childNavigationContext) {
        findDeactivatable(viewPortPlan.childNavigationContext.plan, callbackName, list);
      } else if (prevComponent) {
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
    return list;
  }
  function addPreviousDeactivatable(component, callbackName, list) {
    var controller = component.executionContext;
    if (controller.router && controller.router.currentInstruction) {
      var viewPortInstructions = controller.router.currentInstruction.viewPortInstructions;
      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];
        var prevComponent = viewPortInstruction.component;
        var prevController = prevComponent.executionContext;
        if (callbackName in prevController) {
          list.push(prevController);
        }
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
  }
  function processActivatable(navigationContext, callbackName, next, ignoreResult) {
    var infos = findActivatable(navigationContext, callbackName),
        length = infos.length,
        i = -1;
    function inspect(val, router) {
      if (ignoreResult || shouldContinue(val, router)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }
    function iterate() {
      i++;
      if (i < length) {
        try {
          var _current$controller;
          var current = infos[i];
          var result = (_current$controller = current.controller)[callbackName].apply(_current$controller, _toArray(current.lifecycleArgs));
          return processPotential(result, function(val) {
            return inspect(val, current.router);
          }, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }
    return iterate();
  }
  function findActivatable(navigationContext, callbackName, list, router) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;
    list = list || [];
    Object.keys(plan).filter(function(viewPortName) {
      var viewPortPlan = plan[viewPortName];
      var viewPortInstruction = next.viewPortInstructions[viewPortName];
      var controller = viewPortInstruction.component.executionContext;
      if ((viewPortPlan.strategy === INVOKE_LIFECYCLE || viewPortPlan.strategy === REPLACE) && callbackName in controller) {
        list.push({
          controller: controller,
          lifecycleArgs: viewPortInstruction.lifecycleArgs,
          router: router
        });
      }
      if (viewPortPlan.childNavigationContext) {
        findActivatable(viewPortPlan.childNavigationContext, callbackName, list, controller.router || router);
      }
    });
    return list;
  }
  function shouldContinue(output, router) {
    if (output instanceof Error) {
      return false;
    }
    if (isNavigationCommand(output)) {
      output.router = router;
      return !!output.shouldContinueProcessing;
    }
    if (typeof output == "string") {
      return affirmations.indexOf(value.toLowerCase()) !== -1;
    }
    if (typeof output == "undefined") {
      return true;
    }
    return output;
  }
  return {
    setters: [function(_navigationPlan) {
      INVOKE_LIFECYCLE = _navigationPlan.INVOKE_LIFECYCLE;
      REPLACE = _navigationPlan.REPLACE;
    }, function(_navigationCommands) {
      isNavigationCommand = _navigationCommands.isNavigationCommand;
    }, function(_util) {
      processPotential = _util.processPotential;
    }],
    execute: function() {
      _toArray = function(arr) {
        return Array.isArray(arr) ? arr : Array.from(arr);
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      affirmations = _export("affirmations", ["yes", "ok", "true"]);
      CanDeactivatePreviousStep = _export("CanDeactivatePreviousStep", (function() {
        function CanDeactivatePreviousStep() {}
        _prototypeProperties(CanDeactivatePreviousStep, null, {run: {
            value: function run(navigationContext, next) {
              return processDeactivatable(navigationContext.plan, "canDeactivate", next);
            },
            writable: true,
            configurable: true
          }});
        return CanDeactivatePreviousStep;
      })());
      CanActivateNextStep = _export("CanActivateNextStep", (function() {
        function CanActivateNextStep() {}
        _prototypeProperties(CanActivateNextStep, null, {run: {
            value: function run(navigationContext, next) {
              return processActivatable(navigationContext, "canActivate", next);
            },
            writable: true,
            configurable: true
          }});
        return CanActivateNextStep;
      })());
      DeactivatePreviousStep = _export("DeactivatePreviousStep", (function() {
        function DeactivatePreviousStep() {}
        _prototypeProperties(DeactivatePreviousStep, null, {run: {
            value: function run(navigationContext, next) {
              return processDeactivatable(navigationContext.plan, "deactivate", next, true);
            },
            writable: true,
            configurable: true
          }});
        return DeactivatePreviousStep;
      })());
      ActivateNextStep = _export("ActivateNextStep", (function() {
        function ActivateNextStep() {}
        _prototypeProperties(ActivateNextStep, null, {run: {
            value: function run(navigationContext, next) {
              return processActivatable(navigationContext, "activate", next, true);
            },
            writable: true,
            configurable: true
          }});
        return ActivateNextStep;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7/system/index", ["./compose", "./if", "./repeat", "./show", "./selected-item", "./global-behavior"], function(_export) {
  "use strict";
  var Compose,
      If,
      Repeat,
      Show,
      SelectedItem,
      GlobalBehavior;
  function install(aurelia) {
    aurelia.withResources([Show, If, Repeat, Compose, SelectedItem, GlobalBehavior]);
  }
  return {
    setters: [function(_compose) {
      Compose = _compose.Compose;
    }, function(_if) {
      If = _if.If;
    }, function(_repeat) {
      Repeat = _repeat.Repeat;
    }, function(_show) {
      Show = _show.Show;
    }, function(_selectedItem) {
      SelectedItem = _selectedItem.SelectedItem;
    }, function(_globalBehavior) {
      GlobalBehavior = _globalBehavior.GlobalBehavior;
    }],
    execute: function() {
      _export("Compose", Compose);
      _export("If", If);
      _export("Repeat", Repeat);
      _export("Show", Show);
      _export("SelectedItem", SelectedItem);
      _export("GlobalBehavior", GlobalBehavior);
      _export("install", install);
    }
  };
});

System.register("github:aurelia/event-aggregator@0.2.2", ["github:aurelia/event-aggregator@0.2.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/history-browser@0.2.3", ["github:aurelia/history-browser@0.2.3/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("npm:underscore@1.7.0", ["npm:underscore@1.7.0/underscore"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:underscore@1.7.0/underscore");
  global.define = __define;
  return module.exports;
});

System.register("github:jspm/nodelibs-process@0.1.1/index", ["process"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = System._nodeRequire ? process : require('process');
  global.define = __define;
  return module.exports;
});

System.register("github:aurelia/metadata@0.3.1", ["github:aurelia/metadata@0.3.1/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/dependency-injection@0.4.2/system/index", ["aurelia-metadata", "./metadata", "./container"], function(_export) {
  "use strict";
  var Metadata,
      Transient,
      Singleton;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_metadata) {
      Transient = _metadata.Transient;
      Singleton = _metadata.Singleton;
      _export("Registration", _metadata.Registration);
      _export("Transient", _metadata.Transient);
      _export("Singleton", _metadata.Singleton);
      _export("Resolver", _metadata.Resolver);
      _export("Lazy", _metadata.Lazy);
      _export("All", _metadata.All);
      _export("Optional", _metadata.Optional);
      _export("Parent", _metadata.Parent);
    }, function(_container) {
      _export("Container", _container.Container);
    }],
    execute: function() {
      Metadata.configure.classHelper("transient", Transient);
      Metadata.configure.classHelper("singleton", Singleton);
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/observer-locator", ["aurelia-task-queue", "./array-observation", "./event-manager", "./dirty-checking", "./property-observation", "aurelia-dependency-injection"], function(_export) {
  "use strict";
  var TaskQueue,
      getArrayObserver,
      EventManager,
      DirtyChecker,
      DirtyCheckProperty,
      SetterObserver,
      OoObjectObserver,
      OoPropertyObserver,
      ElementObserver,
      All,
      _prototypeProperties,
      hasObjectObserve,
      ObserverLocator,
      ObjectObservationAdapter;
  function createObserversLookup(obj) {
    var value = {};
    try {
      Object.defineProperty(obj, "__observers__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}
    return value;
  }
  function createObserverLookup(obj) {
    var value = new OoObjectObserver(obj);
    try {
      Object.defineProperty(obj, "__observer__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}
    return value;
  }
  return {
    setters: [function(_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function(_arrayObservation) {
      getArrayObserver = _arrayObservation.getArrayObserver;
    }, function(_eventManager) {
      EventManager = _eventManager.EventManager;
    }, function(_dirtyChecking) {
      DirtyChecker = _dirtyChecking.DirtyChecker;
      DirtyCheckProperty = _dirtyChecking.DirtyCheckProperty;
    }, function(_propertyObservation) {
      SetterObserver = _propertyObservation.SetterObserver;
      OoObjectObserver = _propertyObservation.OoObjectObserver;
      OoPropertyObserver = _propertyObservation.OoPropertyObserver;
      ElementObserver = _propertyObservation.ElementObserver;
    }, function(_aureliaDependencyInjection) {
      All = _aureliaDependencyInjection.All;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      if (typeof Object.getPropertyDescriptor !== "function") {
        Object.getPropertyDescriptor = function(subject, name) {
          var pd = Object.getOwnPropertyDescriptor(subject, name);
          var proto = Object.getPrototypeOf(subject);
          while (typeof pd === "undefined" && proto !== null) {
            pd = Object.getOwnPropertyDescriptor(proto, name);
            proto = Object.getPrototypeOf(proto);
          }
          return pd;
        };
      }
      hasObjectObserve = (function detectObjectObserve() {
        if (typeof Object.observe !== "function") {
          return false;
        }
        var records = [];
        function callback(recs) {
          records = recs;
        }
        var test = {};
        Object.observe(test, callback);
        test.id = 1;
        test.id = 2;
        delete test.id;
        Object.deliverChangeRecords(callback);
        if (records.length !== 3)
          return false;
        if (records[0].type != "add" || records[1].type != "update" || records[2].type != "delete") {
          return false;
        }
        Object.unobserve(test, callback);
        return true;
      })();
      ObserverLocator = _export("ObserverLocator", (function() {
        function ObserverLocator(taskQueue, eventManager, dirtyChecker, observationAdapters) {
          this.taskQueue = taskQueue;
          this.eventManager = eventManager;
          this.dirtyChecker = dirtyChecker;
          this.observationAdapters = observationAdapters;
        }
        _prototypeProperties(ObserverLocator, {inject: {
            value: function inject() {
              return [TaskQueue, EventManager, DirtyChecker, All.of(ObjectObservationAdapter)];
            },
            writable: true,
            configurable: true
          }}, {
          getObserversLookup: {
            value: function getObserversLookup(obj) {
              return obj.__observers__ || createObserversLookup(obj);
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(obj, propertyName) {
              var observersLookup = this.getObserversLookup(obj);
              if (propertyName in observersLookup) {
                return observersLookup[propertyName];
              }
              return observersLookup[propertyName] = this.createPropertyObserver(obj, propertyName);
            },
            writable: true,
            configurable: true
          },
          getObservationAdapter: {
            value: function getObservationAdapter(obj, propertyName) {
              var i,
                  ii,
                  observationAdapter;
              for (i = 0, ii = this.observationAdapters.length; i < ii; i++) {
                observationAdapter = this.observationAdapters[i];
                if (observationAdapter.handlesProperty(obj, propertyName))
                  return observationAdapter;
              }
              return null;
            },
            writable: true,
            configurable: true
          },
          createPropertyObserver: {
            value: function createPropertyObserver(obj, propertyName) {
              var observerLookup,
                  descriptor,
                  handler,
                  observationAdapter;
              if (obj instanceof Element) {
                handler = this.eventManager.getElementHandler(obj);
                if (handler) {
                  return new ElementObserver(handler, obj, propertyName);
                }
              }
              descriptor = Object.getPropertyDescriptor(obj, propertyName);
              if (descriptor && (descriptor.get || descriptor.set)) {
                observationAdapter = this.getObservationAdapter(obj, propertyName);
                if (observationAdapter)
                  return observationAdapter.getObserver(obj, propertyName);
                return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
              }
              if (hasObjectObserve) {
                observerLookup = obj.__observer__ || createObserverLookup(obj);
                return observerLookup.getObserver(propertyName);
              }
              if (obj instanceof Array) {
                observerLookup = this.getArrayObserver(obj);
                return observerLookup.getObserver(propertyName);
              }
              return new SetterObserver(this.taskQueue, obj, propertyName);
            },
            writable: true,
            configurable: true
          },
          getArrayObserver: {
            value: (function(_getArrayObserver) {
              var _getArrayObserverWrapper = function getArrayObserver() {
                return _getArrayObserver.apply(this, arguments);
              };
              _getArrayObserverWrapper.toString = function() {
                return _getArrayObserver.toString();
              };
              return _getArrayObserverWrapper;
            })(function(array) {
              if ("__array_observer__" in array) {
                return array.__array_observer__;
              }
              return array.__array_observer__ = getArrayObserver(this.taskQueue, array);
            }),
            writable: true,
            configurable: true
          }
        });
        return ObserverLocator;
      })());
      ObjectObservationAdapter = _export("ObjectObservationAdapter", (function() {
        function ObjectObservationAdapter() {}
        _prototypeProperties(ObjectObservationAdapter, null, {
          handlesProperty: {
            value: function handlesProperty(object, propertyName) {
              throw new Error("BindingAdapters must implement handlesProperty(object, propertyName).");
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(object, propertyName) {
              throw new Error("BindingAdapters must implement createObserver(object, propertyName).");
            },
            writable: true,
            configurable: true
          }
        });
        return ObjectObservationAdapter;
      })());
    }
  };
});

System.register("github:aurelia/binding@0.3.4/system/parser", ["./lexer", "./ast"], function(_export) {
  "use strict";
  var Lexer,
      Token,
      Expression,
      ArrayOfExpression,
      Chain,
      ValueConverter,
      Assign,
      Conditional,
      AccessScope,
      AccessMember,
      AccessKeyed,
      CallScope,
      CallFunction,
      CallMember,
      PrefixNot,
      Binary,
      LiteralPrimitive,
      LiteralArray,
      LiteralObject,
      LiteralString,
      _prototypeProperties,
      EOF,
      Parser,
      ParserImplementation;
  return {
    setters: [function(_lexer) {
      Lexer = _lexer.Lexer;
      Token = _lexer.Token;
    }, function(_ast) {
      Expression = _ast.Expression;
      ArrayOfExpression = _ast.ArrayOfExpression;
      Chain = _ast.Chain;
      ValueConverter = _ast.ValueConverter;
      Assign = _ast.Assign;
      Conditional = _ast.Conditional;
      AccessScope = _ast.AccessScope;
      AccessMember = _ast.AccessMember;
      AccessKeyed = _ast.AccessKeyed;
      CallScope = _ast.CallScope;
      CallFunction = _ast.CallFunction;
      CallMember = _ast.CallMember;
      PrefixNot = _ast.PrefixNot;
      Binary = _ast.Binary;
      LiteralPrimitive = _ast.LiteralPrimitive;
      LiteralArray = _ast.LiteralArray;
      LiteralObject = _ast.LiteralObject;
      LiteralString = _ast.LiteralString;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      EOF = new Token(-1, null);
      Parser = _export("Parser", (function() {
        function Parser() {
          this.cache = {};
          this.lexer = new Lexer();
        }
        _prototypeProperties(Parser, null, {parse: {
            value: function parse(input) {
              input = input || "";
              return this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain());
            },
            writable: true,
            configurable: true
          }});
        return Parser;
      })());
      ParserImplementation = _export("ParserImplementation", (function() {
        function ParserImplementation(lexer, input) {
          this.index = 0;
          this.input = input;
          this.tokens = lexer.lex(input);
        }
        _prototypeProperties(ParserImplementation, null, {
          peek: {
            get: function() {
              return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
            },
            configurable: true
          },
          parseChain: {
            value: function parseChain() {
              var isChain = false,
                  expressions = [];
              while (this.optional(";")) {
                isChain = true;
              }
              while (this.index < this.tokens.length) {
                if (this.peek.text === ")" || this.peek.text === "}" || this.peek.text === "]") {
                  this.error("Unconsumed token " + this.peek.text);
                }
                var expr = this.parseValueConverter();
                expressions.push(expr);
                while (this.optional(";")) {
                  isChain = true;
                }
                if (isChain && expr instanceof ValueConverter) {
                  this.error("cannot have a value converter in a chain");
                }
              }
              return expressions.length === 1 ? expressions[0] : new Chain(expressions);
            },
            writable: true,
            configurable: true
          },
          parseValueConverter: {
            value: function parseValueConverter() {
              var result = this.parseExpression();
              while (this.optional("|")) {
                var name = this.peek.text,
                    args = [];
                this.advance();
                while (this.optional(":")) {
                  args.push(this.parseExpression());
                }
                result = new ValueConverter(result, name, args, [result].concat(args));
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseExpression: {
            value: function parseExpression() {
              var start = this.peek.index,
                  result = this.parseConditional();
              while (this.peek.text === "=") {
                if (!result.isAssignable) {
                  var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
                  var expression = this.input.substring(start, end);
                  this.error("Expression " + expression + " is not assignable");
                }
                this.expect("=");
                result = new Assign(result, this.parseConditional());
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseConditional: {
            value: function parseConditional() {
              var start = this.peek.index,
                  result = this.parseLogicalOr();
              if (this.optional("?")) {
                var yes = this.parseExpression();
                if (!this.optional(":")) {
                  var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
                  var expression = this.input.substring(start, end);
                  this.error("Conditional expression " + expression + " requires all 3 expressions");
                }
                var no = this.parseExpression();
                result = new Conditional(result, yes, no);
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseLogicalOr: {
            value: function parseLogicalOr() {
              var result = this.parseLogicalAnd();
              while (this.optional("||")) {
                result = new Binary("||", result, this.parseLogicalAnd());
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseLogicalAnd: {
            value: function parseLogicalAnd() {
              var result = this.parseEquality();
              while (this.optional("&&")) {
                result = new Binary("&&", result, this.parseEquality());
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          parseEquality: {
            value: function parseEquality() {
              var result = this.parseRelational();
              while (true) {
                if (this.optional("==")) {
                  result = new Binary("==", result, this.parseRelational());
                } else if (this.optional("!=")) {
                  result = new Binary("!=", result, this.parseRelational());
                } else if (this.optional("===")) {
                  result = new Binary("===", result, this.parseRelational());
                } else if (this.optional("!==")) {
                  result = new Binary("!==", result, this.parseRelational());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parseRelational: {
            value: function parseRelational() {
              var result = this.parseAdditive();
              while (true) {
                if (this.optional("<")) {
                  result = new Binary("<", result, this.parseAdditive());
                } else if (this.optional(">")) {
                  result = new Binary(">", result, this.parseAdditive());
                } else if (this.optional("<=")) {
                  result = new Binary("<=", result, this.parseAdditive());
                } else if (this.optional(">=")) {
                  result = new Binary(">=", result, this.parseAdditive());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parseAdditive: {
            value: function parseAdditive() {
              var result = this.parseMultiplicative();
              while (true) {
                if (this.optional("+")) {
                  result = new Binary("+", result, this.parseMultiplicative());
                } else if (this.optional("-")) {
                  result = new Binary("-", result, this.parseMultiplicative());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parseMultiplicative: {
            value: function parseMultiplicative() {
              var result = this.parsePrefix();
              while (true) {
                if (this.optional("*")) {
                  result = new Binary("*", result, this.parsePrefix());
                } else if (this.optional("%")) {
                  result = new Binary("%", result, this.parsePrefix());
                } else if (this.optional("/")) {
                  result = new Binary("/", result, this.parsePrefix());
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parsePrefix: {
            value: function parsePrefix() {
              if (this.optional("+")) {
                return this.parsePrefix();
              } else if (this.optional("-")) {
                return new Binary("-", new LiteralPrimitive(0), this.parsePrefix());
              } else if (this.optional("!")) {
                return new PrefixNot("!", this.parsePrefix());
              } else {
                return this.parseAccessOrCallMember();
              }
            },
            writable: true,
            configurable: true
          },
          parseAccessOrCallMember: {
            value: function parseAccessOrCallMember() {
              var result = this.parsePrimary();
              while (true) {
                if (this.optional(".")) {
                  var name = this.peek.text;
                  this.advance();
                  if (this.optional("(")) {
                    var args = this.parseExpressionList(")");
                    this.expect(")");
                    result = new CallMember(result, name, args);
                  } else {
                    result = new AccessMember(result, name);
                  }
                } else if (this.optional("[")) {
                  var key = this.parseExpression();
                  this.expect("]");
                  result = new AccessKeyed(result, key);
                } else if (this.optional("(")) {
                  var args = this.parseExpressionList(")");
                  this.expect(")");
                  result = new CallFunction(result, args);
                } else {
                  return result;
                }
              }
            },
            writable: true,
            configurable: true
          },
          parsePrimary: {
            value: function parsePrimary() {
              if (this.optional("(")) {
                var result = this.parseExpression();
                this.expect(")");
                return result;
              } else if (this.optional("null") || this.optional("undefined")) {
                return new LiteralPrimitive(null);
              } else if (this.optional("true")) {
                return new LiteralPrimitive(true);
              } else if (this.optional("false")) {
                return new LiteralPrimitive(false);
              } else if (this.optional("[")) {
                var elements = this.parseExpressionList("]");
                this.expect("]");
                return new LiteralArray(elements);
              } else if (this.peek.text == "{") {
                return this.parseObject();
              } else if (this.peek.key != null) {
                return this.parseAccessOrCallScope();
              } else if (this.peek.value != null) {
                var value = this.peek.value;
                this.advance();
                return isNaN(value) ? new LiteralString(value) : new LiteralPrimitive(value);
              } else if (this.index >= this.tokens.length) {
                throw new Error("Unexpected end of expression: " + this.input);
              } else {
                this.error("Unexpected token " + this.peek.text);
              }
            },
            writable: true,
            configurable: true
          },
          parseAccessOrCallScope: {
            value: function parseAccessOrCallScope() {
              var name = this.peek.key;
              this.advance();
              if (!this.optional("(")) {
                return new AccessScope(name);
              }
              var args = this.parseExpressionList(")");
              this.expect(")");
              return new CallScope(name, args);
            },
            writable: true,
            configurable: true
          },
          parseObject: {
            value: function parseObject() {
              var keys = [],
                  values = [];
              this.expect("{");
              if (this.peek.text !== "}") {
                do {
                  var value = this.peek.value;
                  keys.push(typeof value === "string" ? value : this.peek.text);
                  this.advance();
                  this.expect(":");
                  values.push(this.parseExpression());
                } while (this.optional(","));
              }
              this.expect("}");
              return new LiteralObject(keys, values);
            },
            writable: true,
            configurable: true
          },
          parseExpressionList: {
            value: function parseExpressionList(terminator) {
              var result = [];
              if (this.peek.text != terminator) {
                do {
                  result.push(this.parseExpression());
                } while (this.optional(","));
              }
              return result;
            },
            writable: true,
            configurable: true
          },
          optional: {
            value: function optional(text) {
              if (this.peek.text === text) {
                this.advance();
                return true;
              }
              return false;
            },
            writable: true,
            configurable: true
          },
          expect: {
            value: function expect(text) {
              if (this.peek.text === text) {
                this.advance();
              } else {
                this.error("Missing expected " + text);
              }
            },
            writable: true,
            configurable: true
          },
          advance: {
            value: function advance() {
              this.index++;
            },
            writable: true,
            configurable: true
          },
          error: {
            value: function error(message) {
              var location = this.index < this.tokens.length ? "at column " + (this.tokens[this.index].index + 1) + " in" : "at the end of the expression";
              throw new Error("Parser Error: " + message + " " + location + " [" + this.input + "]");
            },
            writable: true,
            configurable: true
          }
        });
        return ParserImplementation;
      })());
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/attached-behavior", ["aurelia-metadata", "./behavior-instance", "./behaviors", "./util"], function(_export) {
  "use strict";
  var ResourceType,
      BehaviorInstance,
      configureBehavior,
      hyphenate,
      _prototypeProperties,
      _inherits,
      AttachedBehavior;
  return {
    setters: [function(_aureliaMetadata) {
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_behaviorInstance) {
      BehaviorInstance = _behaviorInstance.BehaviorInstance;
    }, function(_behaviors) {
      configureBehavior = _behaviors.configureBehavior;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      AttachedBehavior = _export("AttachedBehavior", (function(ResourceType) {
        function AttachedBehavior(attribute) {
          this.name = attribute;
          this.properties = [];
          this.attributes = {};
        }
        _inherits(AttachedBehavior, ResourceType);
        _prototypeProperties(AttachedBehavior, {convention: {
            value: function convention(name) {
              if (name.endsWith("AttachedBehavior")) {
                return new AttachedBehavior(hyphenate(name.substring(0, name.length - 16)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              configureBehavior(container, this, target);
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target) {
              return Promise.resolve(this);
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerAttribute(name || this.name, this, this.name);
            },
            writable: true,
            configurable: true
          },
          compile: {
            value: function compile(compiler, resources, node, instruction) {
              instruction.suppressBind = true;
              return node;
            },
            writable: true,
            configurable: true
          },
          create: {
            value: function create(container, instruction, element, bindings) {
              var executionContext = instruction.executionContext || container.get(this.target),
                  behaviorInstance = new BehaviorInstance(this, executionContext, instruction);
              if (!(this.apiName in element)) {
                element[this.apiName] = behaviorInstance.executionContext;
              }
              if (this.childExpression) {
                bindings.push(this.childExpression.createBinding(element, behaviorInstance.executionContext));
              }
              return behaviorInstance;
            },
            writable: true,
            configurable: true
          }
        });
        return AttachedBehavior;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/view-compiler", ["./resource-registry", "./view-factory", "./binding-language"], function(_export) {
  "use strict";
  var ResourceRegistry,
      ViewFactory,
      BindingLanguage,
      _prototypeProperties,
      nextInjectorId,
      defaultCompileOptions,
      hasShadowDOM,
      ViewCompiler;
  function getNextInjectorId() {
    return ++nextInjectorId;
  }
  function configureProperties(instruction, resources) {
    var type = instruction.type,
        attrName = instruction.attrName,
        attributes = instruction.attributes,
        property,
        key,
        value;
    var knownAttribute = resources.mapAttribute(attrName);
    if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
      attributes[knownAttribute] = attributes[attrName];
      delete attributes[attrName];
    }
    for (key in attributes) {
      value = attributes[key];
      if (typeof value !== "string") {
        property = type.attributes[key];
        if (property !== undefined) {
          value.targetProperty = property.name;
        } else {
          value.targetProperty = key;
        }
      }
    }
  }
  function makeIntoInstructionTarget(element) {
    var value = element.getAttribute("class");
    element.setAttribute("class", value ? value += " au-target" : "au-target");
  }
  return {
    setters: [function(_resourceRegistry) {
      ResourceRegistry = _resourceRegistry.ResourceRegistry;
    }, function(_viewFactory) {
      ViewFactory = _viewFactory.ViewFactory;
    }, function(_bindingLanguage) {
      BindingLanguage = _bindingLanguage.BindingLanguage;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      nextInjectorId = 0;
      defaultCompileOptions = {targetShadowDOM: false};
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
      ViewCompiler = _export("ViewCompiler", (function() {
        function ViewCompiler(bindingLanguage) {
          this.bindingLanguage = bindingLanguage;
        }
        _prototypeProperties(ViewCompiler, {inject: {
            value: function inject() {
              return [BindingLanguage];
            },
            writable: true,
            configurable: true
          }}, {
          compile: {
            value: function compile(templateOrFragment, resources) {
              var options = arguments[2] === undefined ? defaultCompileOptions : arguments[2];
              var instructions = [],
                  targetShadowDOM = options.targetShadowDOM,
                  content;
              targetShadowDOM = targetShadowDOM && hasShadowDOM;
              if (options.beforeCompile) {
                options.beforeCompile(templateOrFragment);
              }
              if (templateOrFragment.content) {
                content = document.adoptNode(templateOrFragment.content, true);
              } else {
                content = templateOrFragment;
              }
              this.compileNode(content, resources, instructions, templateOrFragment, "root", !targetShadowDOM);
              content.insertBefore(document.createComment("<view>"), content.firstChild);
              content.appendChild(document.createComment("</view>"));
              return new ViewFactory(content, instructions, resources);
            },
            writable: true,
            configurable: true
          },
          compileNode: {
            value: function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
              switch (node.nodeType) {
                case 1:
                  return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
                case 3:
                  var expression = this.bindingLanguage.parseText(resources, node.textContent);
                  if (expression) {
                    var marker = document.createElement("au-marker");
                    marker.className = "au-target";
                    node.parentNode.insertBefore(marker, node);
                    node.textContent = " ";
                    instructions.push({contentExpression: expression});
                  }
                  return node.nextSibling;
                case 11:
                  var currentChild = node.firstChild;
                  while (currentChild) {
                    currentChild = this.compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
                  }
                  break;
              }
              return node.nextSibling;
            },
            writable: true,
            configurable: true
          },
          compileElement: {
            value: function compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
              var tagName = node.tagName.toLowerCase(),
                  attributes = node.attributes,
                  expressions = [],
                  behaviorInstructions = [],
                  providers = [],
                  bindingLanguage = this.bindingLanguage,
                  liftingInstruction,
                  viewFactory,
                  type,
                  elementInstruction,
                  elementProperty,
                  i,
                  ii,
                  attr,
                  attrName,
                  attrValue,
                  instruction,
                  info,
                  property,
                  knownAttribute;
              if (tagName === "content") {
                if (targetLightDOM) {
                  instructions.push({
                    parentInjectorId: parentInjectorId,
                    contentSelector: true,
                    selector: node.getAttribute("select"),
                    suppressBind: true
                  });
                  makeIntoInstructionTarget(node);
                }
                return node.nextSibling;
              } else if (tagName === "template") {
                viewFactory = this.compile(node, resources);
              } else {
                type = resources.getElement(tagName);
                if (type) {
                  elementInstruction = {
                    type: type,
                    attributes: {}
                  };
                  behaviorInstructions.push(elementInstruction);
                }
              }
              for (i = 0, ii = attributes.length; i < ii; ++i) {
                attr = attributes[i];
                attrName = attr.name;
                attrValue = attr.value;
                info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
                type = resources.getAttribute(info.attrName);
                elementProperty = null;
                if (type) {
                  knownAttribute = resources.mapAttribute(info.attrName);
                  if (knownAttribute) {
                    property = type.attributes[knownAttribute];
                    if (property) {
                      info.defaultBindingMode = property.defaultBindingMode;
                      if (!info.command && !info.expression) {
                        info.command = property.hasOptions ? "options" : null;
                      }
                    }
                  }
                } else if (elementInstruction) {
                  elementProperty = elementInstruction.type.attributes[info.attrName];
                  if (elementProperty) {
                    info.defaultBindingMode = elementProperty.defaultBindingMode;
                    if (!info.command && !info.expression) {
                      info.command = elementProperty.hasOptions ? "options" : null;
                    }
                  }
                }
                if (elementProperty) {
                  instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
                } else {
                  instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
                }
                if (instruction) {
                  if (instruction.alteredAttr) {
                    type = resources.getAttribute(instruction.attrName);
                  }
                  if (instruction.discrete) {
                    expressions.push(instruction);
                  } else {
                    if (type) {
                      instruction.type = type;
                      configureProperties(instruction, resources);
                      if (type.liftsContent) {
                        instruction.originalAttrName = attrName;
                        liftingInstruction = instruction;
                        break;
                      } else {
                        behaviorInstructions.push(instruction);
                      }
                    } else if (elementProperty) {
                      elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
                    } else {
                      expressions.push(instruction.attributes[instruction.attrName]);
                    }
                  }
                } else {
                  if (type) {
                    instruction = {
                      attrName: attrName,
                      type: type,
                      attributes: {}
                    };
                    instruction.attributes[resources.mapAttribute(attrName)] = attrValue;
                    if (type.liftsContent) {
                      instruction.originalAttrName = attrName;
                      liftingInstruction = instruction;
                      break;
                    } else {
                      behaviorInstructions.push(instruction);
                    }
                  } else if (elementProperty) {
                    elementInstruction.attributes[attrName] = attrValue;
                  }
                }
              }
              if (liftingInstruction) {
                liftingInstruction.viewFactory = viewFactory;
                node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
                makeIntoInstructionTarget(node);
                instructions.push({
                  anchorIsContainer: false,
                  parentInjectorId: parentInjectorId,
                  expressions: [],
                  behaviorInstructions: [liftingInstruction],
                  viewFactory: liftingInstruction.viewFactory,
                  providers: [liftingInstruction.type.target]
                });
              } else {
                for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
                  instruction = behaviorInstructions[i];
                  instruction.type.compile(this, resources, node, instruction, parentNode);
                  providers.push(instruction.type.target);
                }
                var injectorId = behaviorInstructions.length ? getNextInjectorId() : false;
                if (expressions.length || behaviorInstructions.length) {
                  makeIntoInstructionTarget(node);
                  instructions.push({
                    anchorIsContainer: true,
                    injectorId: injectorId,
                    parentInjectorId: parentInjectorId,
                    expressions: expressions,
                    behaviorInstructions: behaviorInstructions,
                    providers: providers
                  });
                }
                var currentChild = node.firstChild;
                while (currentChild) {
                  currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
                }
              }
              return node.nextSibling;
            },
            writable: true,
            configurable: true
          }
        });
        return ViewCompiler;
      })());
    }
  };
});

System.register("github:aurelia/templating-binding@0.8.4/system/index", ["aurelia-templating", "./binding-language", "./syntax-interpreter"], function(_export) {
  "use strict";
  var BindingLanguage,
      TemplatingBindingLanguage,
      SyntaxInterpreter;
  function install(aurelia) {
    var instance,
        getInstance = function(c) {
          return instance || (instance = c.invoke(TemplatingBindingLanguage));
        };
    if (aurelia.container.hasHandler(TemplatingBindingLanguage)) {
      instance = aurelia.container.get(TemplatingBindingLanguage);
    } else {
      aurelia.container.registerHandler(TemplatingBindingLanguage, getInstance);
    }
    aurelia.container.registerHandler(BindingLanguage, getInstance);
  }
  return {
    setters: [function(_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
    }, function(_bindingLanguage) {
      TemplatingBindingLanguage = _bindingLanguage.TemplatingBindingLanguage;
    }, function(_syntaxInterpreter) {
      SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;
    }],
    execute: function() {
      _export("TemplatingBindingLanguage", TemplatingBindingLanguage);
      _export("SyntaxInterpreter", SyntaxInterpreter);
      _export("install", install);
    }
  };
});

System.register("github:aurelia/route-recognizer@0.2.2", ["github:aurelia/route-recognizer@0.2.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.5.5/system/pipeline-provider", ["aurelia-dependency-injection", "./pipeline", "./navigation-plan", "./model-binding", "./route-loading", "./navigation-context", "./activation"], function(_export) {
  "use strict";
  var Container,
      Pipeline,
      BuildNavigationPlanStep,
      ApplyModelBindersStep,
      LoadRouteStep,
      CommitChangesStep,
      CanDeactivatePreviousStep,
      CanActivateNextStep,
      DeactivatePreviousStep,
      ActivateNextStep,
      _prototypeProperties,
      PipelineProvider;
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_pipeline) {
      Pipeline = _pipeline.Pipeline;
    }, function(_navigationPlan) {
      BuildNavigationPlanStep = _navigationPlan.BuildNavigationPlanStep;
    }, function(_modelBinding) {
      ApplyModelBindersStep = _modelBinding.ApplyModelBindersStep;
    }, function(_routeLoading) {
      LoadRouteStep = _routeLoading.LoadRouteStep;
    }, function(_navigationContext) {
      CommitChangesStep = _navigationContext.CommitChangesStep;
    }, function(_activation) {
      CanDeactivatePreviousStep = _activation.CanDeactivatePreviousStep;
      CanActivateNextStep = _activation.CanActivateNextStep;
      DeactivatePreviousStep = _activation.DeactivatePreviousStep;
      ActivateNextStep = _activation.ActivateNextStep;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      PipelineProvider = _export("PipelineProvider", (function() {
        function PipelineProvider(container) {
          this.container = container;
          this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadRouteStep, ApplyModelBindersStep, CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep, CommitChangesStep];
        }
        _prototypeProperties(PipelineProvider, {inject: {
            value: function inject() {
              return [Container];
            },
            writable: true,
            configurable: true
          }}, {createPipeline: {
            value: function createPipeline(navigationContext) {
              var _this = this;
              var pipeline = new Pipeline();
              this.steps.forEach(function(step) {
                return pipeline.withStep(_this.container.get(step));
              });
              return pipeline;
            },
            writable: true,
            configurable: true
          }});
        return PipelineProvider;
      })());
    }
  };
});

System.register("github:aurelia/templating-resources@0.8.7", ["github:aurelia/templating-resources@0.8.7/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("dist/todos", ["./todo-item", "underscore"], function(_export) {
  "use strict";
  var TodoItem,
      _,
      _prototypeProperties,
      _classCallCheck,
      STORAGE_NAME,
      Todos;
  return {
    setters: [function(_todoItem) {
      TodoItem = _todoItem.TodoItem;
    }, function(_underscore) {
      _ = _underscore["default"];
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      STORAGE_NAME = "todomvc-aurelia";
      Todos = _export("Todos", (function() {
        function Todos() {
          _classCallCheck(this, Todos);
          this.items = [];
          this.filteredItems = [];
          this.filter = "";
          this.newTodoTitle = null;
          this.areAllChecked = false;
          this.load();
        }
        _prototypeProperties(Todos, null, {
          activate: {
            value: function activate(params) {
              this.updateFilteredItems(params.filter);
            },
            writable: true,
            configurable: true
          },
          addNewTodo: {
            value: function addNewTodo() {
              var _this = this;
              var title = arguments[0] === undefined ? this.newTodoTitle : arguments[0];
              if (title == undefined)
                return ;
              title = title.trim();
              if (title.length == 0)
                return ;
              var newTodoItem = new TodoItem(title);
              Object.observe(newTodoItem, function(ev) {
                return _this.onItemChanged(ev);
              });
              this.items.push(newTodoItem);
              this.newTodoTitle = null;
              this.updateFilteredItems(this.filter);
              this.save();
            },
            writable: true,
            configurable: true
          },
          onItemChanged: {
            value: function onItemChanged(ev) {
              var todoItem = ev[0].object;
              if (todoItem.title == "") {
                this.deleteTodo(todoItem);
              }
              this.areAllChecked = _(this.items).all(function(i) {
                return i.isCompleted;
              });
              if (ev[0].name == "isCompleted") {
                this.updateFilteredItems(this.filter);
              }
              this.save();
            },
            writable: true,
            configurable: true
          },
          deleteTodo: {
            value: function deleteTodo(todoItem) {
              this.items = _(this.items).without(todoItem);
              this.updateFilteredItems(this.filter);
              this.save();
            },
            writable: true,
            configurable: true
          },
          areAllCheckedChanged: {
            value: function areAllCheckedChanged() {
              var _this = this;
              _.each(this.items, function(i) {
                return i.isCompleted = _this.areAllChecked;
              });
              this.updateFilteredItems(this.filter);
            },
            writable: true,
            configurable: true
          },
          clearCompletedTodos: {
            value: function clearCompletedTodos() {
              this.items = _(this.items).filter(function(i) {
                return !i.isCompleted;
              });
              this.areAllChecked = false;
              this.updateFilteredItems(this.filter);
              this.save();
            },
            writable: true,
            configurable: true
          },
          countTodosLeft: {
            get: function() {
              return _(this.items).filter(function(i) {
                return !i.isCompleted;
              }).length;
            },
            configurable: true
          },
          updateFilteredItems: {
            value: function updateFilteredItems(filter) {
              this.filter = filter || "!";
              switch (filter) {
                case "active":
                  this.filteredItems = _(this.items).filter(function(i) {
                    return !i.isCompleted;
                  });
                  break;
                case "completed":
                  this.filteredItems = _(this.items).filter(function(i) {
                    return i.isCompleted;
                  });
                  break;
                default:
                  this.filteredItems = this.items;
                  break;
              }
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load() {
              var _this = this;
              var storageContent = localStorage.getItem(STORAGE_NAME);
              if (storageContent == undefined)
                return ;
              var simpleItems = JSON.parse(storageContent);
              this.items = _.map(simpleItems, function(item) {
                var todoItem = new TodoItem(item.title);
                todoItem.isCompleted = item.completed;
                Object.observe(todoItem, function(ev) {
                  return _this.onItemChanged(ev);
                });
                return todoItem;
              });
            },
            writable: true,
            configurable: true
          },
          save: {
            value: function save() {
              var simpleItems = _.map(this.items, function(item) {
                return {
                  title: item.title,
                  completed: item.isCompleted
                };
              });
              localStorage.setItem(STORAGE_NAME, JSON.stringify(simpleItems));
            },
            writable: true,
            configurable: true
          }
        });
        return Todos;
      })());
    }
  };
});

System.register("github:jspm/nodelibs-process@0.1.1", ["github:jspm/nodelibs-process@0.1.1/index"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("github:jspm/nodelibs-process@0.1.1/index");
  global.define = __define;
  return module.exports;
});

System.register("github:aurelia/loader-default@0.4.1/system/index", ["aurelia-metadata", "aurelia-loader", "aurelia-path"], function(_export) {
  "use strict";
  var Origin,
      Loader,
      join,
      _prototypeProperties,
      _inherits,
      sys,
      DefaultLoader;
  function ensureOriginOnExports(executed, name) {
    var target = executed,
        key,
        exportedValue;
    if (target.__useDefault) {
      target = target["default"];
    }
    Origin.set(target, new Origin(name, "default"));
    for (key in target) {
      exportedValue = target[key];
      if (typeof exportedValue === "function") {
        Origin.set(exportedValue, new Origin(name, key));
      }
    }
    return executed;
  }
  return {
    setters: [function(_aureliaMetadata) {
      Origin = _aureliaMetadata.Origin;
    }, function(_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function(_aureliaPath) {
      join = _aureliaPath.join;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      if (!window.System || !window.System["import"]) {
        sys = window.System = window.System || {};
        sys.polyfilled = true;
        sys.map = {};
        sys["import"] = function(moduleId) {
          return new Promise(function(resolve, reject) {
            require([moduleId], resolve, reject);
          });
        };
        sys.normalize = function(url) {
          return Promise.resolve(url);
        };
      }
      Loader.createDefaultLoader = function() {
        return new DefaultLoader();
      };
      DefaultLoader = (function(Loader) {
        function DefaultLoader() {
          this.baseUrl = System.baseUrl;
          this.baseViewUrl = System.baseViewUrl || System.baseUrl;
          this.registry = {};
        }
        _inherits(DefaultLoader, Loader);
        _prototypeProperties(DefaultLoader, null, {
          loadModule: {
            value: function loadModule(id, baseUrl) {
              var _this = this;
              baseUrl = baseUrl === undefined ? this.baseUrl : baseUrl;
              if (baseUrl && !id.startsWith(baseUrl)) {
                id = join(baseUrl, id);
              }
              return System.normalize(id).then(function(newId) {
                var existing = _this.registry[newId];
                if (existing) {
                  return existing;
                }
                return System["import"](newId).then(function(m) {
                  _this.registry[newId] = m;
                  return ensureOriginOnExports(m, newId);
                });
              });
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          loadAllModules: {
            value: function loadAllModules(ids) {
              var loads = [],
                  i,
                  ii,
                  loader = this.loader;
              for (i = 0, ii = ids.length; i < ii; ++i) {
                loads.push(this.loadModule(ids[i]));
              }
              return Promise.all(loads);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          loadTemplate: {
            value: function loadTemplate(url) {
              if (this.baseViewUrl && !url.startsWith(this.baseViewUrl)) {
                url = join(this.baseViewUrl, url);
              }
              return this.importTemplate(url);
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });
        return DefaultLoader;
      })(Loader);
      _export("DefaultLoader", DefaultLoader);
    }
  };
});

System.register("github:aurelia/dependency-injection@0.4.2", ["github:aurelia/dependency-injection@0.4.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/binding@0.3.4/system/index", ["aurelia-metadata", "./value-converter", "./event-manager", "./observer-locator", "./array-change-records", "./binding-modes", "./parser", "./binding-expression", "./listener-expression", "./name-expression", "./call-expression", "./dirty-checking"], function(_export) {
  "use strict";
  var Metadata,
      ValueConverter;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_valueConverter) {
      ValueConverter = _valueConverter.ValueConverter;
      _export("ValueConverter", _valueConverter.ValueConverter);
    }, function(_eventManager) {
      _export("EventManager", _eventManager.EventManager);
    }, function(_observerLocator) {
      _export("ObserverLocator", _observerLocator.ObserverLocator);
    }, function(_arrayChangeRecords) {
      _export("calcSplices", _arrayChangeRecords.calcSplices);
    }, function(_bindingModes) {
      for (var _key in _bindingModes) {
        _export(_key, _bindingModes[_key]);
      }
    }, function(_parser) {
      _export("Parser", _parser.Parser);
    }, function(_bindingExpression) {
      _export("BindingExpression", _bindingExpression.BindingExpression);
    }, function(_listenerExpression) {
      _export("ListenerExpression", _listenerExpression.ListenerExpression);
    }, function(_nameExpression) {
      _export("NameExpression", _nameExpression.NameExpression);
    }, function(_callExpression) {
      _export("CallExpression", _callExpression.CallExpression);
    }, function(_dirtyChecking) {
      _export("DirtyChecker", _dirtyChecking.DirtyChecker);
    }],
    execute: function() {
      Metadata.configure.classHelper("valueConverter", ValueConverter);
    }
  };
});

System.register("github:aurelia/templating@0.8.10/system/view-engine", ["aurelia-logging", "aurelia-loader", "aurelia-path", "./view-compiler", "./resource-registry"], function(_export) {
  "use strict";
  var LogManager,
      Loader,
      relativeToFile,
      ViewCompiler,
      ResourceRegistry,
      ViewResources,
      _prototypeProperties,
      importSplitter,
      logger,
      ViewEngine;
  return {
    setters: [function(_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function(_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function(_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }, function(_viewCompiler) {
      ViewCompiler = _viewCompiler.ViewCompiler;
    }, function(_resourceRegistry) {
      ResourceRegistry = _resourceRegistry.ResourceRegistry;
      ViewResources = _resourceRegistry.ViewResources;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      importSplitter = /\s*,\s*/;
      logger = LogManager.getLogger("templating");
      ViewEngine = _export("ViewEngine", (function() {
        function ViewEngine(loader, viewCompiler, appResources) {
          this.loader = loader;
          this.viewCompiler = viewCompiler;
          this.appResources = appResources;
          this.importedViews = {};
        }
        _prototypeProperties(ViewEngine, {inject: {
            value: function inject() {
              return [Loader, ViewCompiler, ResourceRegistry];
            },
            writable: true,
            configurable: true
          }}, {
          loadViewFactory: {
            value: function loadViewFactory(url, compileOptions, associatedModuleId) {
              var _this = this;
              var existing = this.importedViews[url];
              if (existing) {
                return Promise.resolve(existing);
              }
              return this.loader.loadTemplate(url).then(function(template) {
                return _this.loadTemplateResources(url, template, associatedModuleId).then(function(resources) {
                  existing = _this.importedViews[url];
                  if (existing) {
                    return existing;
                  }
                  var viewFactory = _this.viewCompiler.compile(template, resources, compileOptions);
                  _this.importedViews[url] = viewFactory;
                  return viewFactory;
                });
              });
            },
            writable: true,
            configurable: true
          },
          loadTemplateResources: {
            value: function loadTemplateResources(templateUrl, template, associatedModuleId) {
              var _this = this;
              var importIds,
                  names,
                  i,
                  ii,
                  src,
                  current,
                  registry = new ViewResources(this.appResources, templateUrl),
                  dxImportElements = template.content.querySelectorAll("import"),
                  associatedModule;
              if (dxImportElements.length === 0 && !associatedModuleId) {
                return Promise.resolve(registry);
              }
              importIds = new Array(dxImportElements.length);
              names = new Array(dxImportElements.length);
              for (i = 0, ii = dxImportElements.length; i < ii; ++i) {
                current = dxImportElements[i];
                src = current.getAttribute("from");
                if (!src) {
                  throw new Error("Import element in " + templateUrl + " has no \"from\" attribute.");
                }
                importIds[i] = src;
                names[i] = current.getAttribute("as");
                if (current.parentNode) {
                  current.parentNode.removeChild(current);
                }
              }
              importIds = importIds.map(function(x) {
                return relativeToFile(x, templateUrl);
              });
              logger.debug("importing resources for " + templateUrl, importIds);
              return this.resourceCoordinator.importResourcesFromModuleIds(importIds).then(function(toRegister) {
                for (i = 0, ii = toRegister.length; i < ii; ++i) {
                  toRegister[i].register(registry, names[i]);
                }
                if (associatedModuleId) {
                  associatedModule = _this.resourceCoordinator.getExistingModuleAnalysis(associatedModuleId);
                  if (associatedModule) {
                    associatedModule.register(registry);
                  }
                }
                return registry;
              });
            },
            writable: true,
            configurable: true
          }
        });
        return ViewEngine;
      })());
    }
  };
});

System.register("github:aurelia/templating-binding@0.8.4", ["github:aurelia/templating-binding@0.8.4/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/router@0.5.5/system/router", ["aurelia-route-recognizer", "aurelia-path", "./navigation-context", "./navigation-instruction", "./router-configuration", "./util"], function(_export) {
  "use strict";
  var RouteRecognizer,
      join,
      NavigationContext,
      NavigationInstruction,
      RouterConfiguration,
      processPotential,
      _prototypeProperties,
      Router;
  return {
    setters: [function(_aureliaRouteRecognizer) {
      RouteRecognizer = _aureliaRouteRecognizer.RouteRecognizer;
    }, function(_aureliaPath) {
      join = _aureliaPath.join;
    }, function(_navigationContext) {
      NavigationContext = _navigationContext.NavigationContext;
    }, function(_navigationInstruction) {
      NavigationInstruction = _navigationInstruction.NavigationInstruction;
    }, function(_routerConfiguration) {
      RouterConfiguration = _routerConfiguration.RouterConfiguration;
    }, function(_util) {
      processPotential = _util.processPotential;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      Router = _export("Router", (function() {
        function Router(container, history) {
          this.container = container;
          this.history = history;
          this.viewPorts = {};
          this.reset();
          this.baseUrl = "";
        }
        _prototypeProperties(Router, null, {
          registerViewPort: {
            value: function registerViewPort(viewPort, name) {
              name = name || "default";
              this.viewPorts[name] = viewPort;
            },
            writable: true,
            configurable: true
          },
          refreshBaseUrl: {
            value: function refreshBaseUrl() {
              if (this.parent) {
                var baseUrl = this.parent.currentInstruction.getBaseUrl();
                this.baseUrl = this.parent.baseUrl + baseUrl;
              }
            },
            writable: true,
            configurable: true
          },
          refreshNavigation: {
            value: function refreshNavigation() {
              var nav = this.navigation;
              for (var i = 0,
                  length = nav.length; i < length; i++) {
                var current = nav[i];
                if (!this.history._hasPushState) {
                  if (this.baseUrl[0] == "/") {
                    current.href = "#" + this.baseUrl;
                  } else {
                    current.href = "#/" + this.baseUrl;
                  }
                } else {
                  current.href = "/" + this.baseUrl;
                }
                if (current.href[current.href.length - 1] != "/") {
                  current.href += "/";
                }
                current.href += current.relativeHref;
              }
            },
            writable: true,
            configurable: true
          },
          configure: {
            value: function configure(callbackOrConfig) {
              if (typeof callbackOrConfig == "function") {
                var config = new RouterConfiguration();
                callbackOrConfig(config);
                config.exportToRouter(this);
              } else {
                callbackOrConfig.exportToRouter(this);
              }
              return this;
            },
            writable: true,
            configurable: true
          },
          navigate: {
            value: function navigate(fragment, options) {
              fragment = join(this.baseUrl, fragment);
              if (fragment === "")
                fragment = "/";
              return this.history.navigate(fragment, options);
            },
            writable: true,
            configurable: true
          },
          navigateBack: {
            value: function navigateBack() {
              this.history.navigateBack();
            },
            writable: true,
            configurable: true
          },
          createChild: {
            value: function createChild(container) {
              var childRouter = new Router(container || this.container.createChild(), this.history);
              childRouter.parent = this;
              return childRouter;
            },
            writable: true,
            configurable: true
          },
          createNavigationInstruction: {
            value: function createNavigationInstruction() {
              var url = arguments[0] === undefined ? "" : arguments[0];
              var parentInstruction = arguments[1] === undefined ? null : arguments[1];
              var results = this.recognizer.recognize(url);
              var fragment,
                  queryIndex,
                  queryString;
              if (!results || !results.length) {
                results = this.childRecognizer.recognize(url);
              }
              fragment = url;
              queryIndex = fragment.indexOf("?");
              if (queryIndex != -1) {
                fragment = url.substr(0, queryIndex);
                queryString = url.substr(queryIndex + 1);
              }
              if ((!results || !results.length) && this.catchAllHandler) {
                results = [{
                  config: {navModel: {}},
                  handler: this.catchAllHandler,
                  params: {path: fragment}
                }];
              }
              if (results && results.length) {
                var first = results[0],
                    fragment = url,
                    queryIndex = fragment.indexOf("?"),
                    queryString;
                if (queryIndex != -1) {
                  fragment = url.substr(0, queryIndex);
                  queryString = url.substr(queryIndex + 1);
                }
                var instruction = new NavigationInstruction(fragment, queryString, first.params, first.queryParams || results.queryParams, first.config || first.handler, parentInstruction);
                if (typeof first.handler == "function") {
                  return first.handler(instruction).then(function(instruction) {
                    if (!("viewPorts" in instruction.config)) {
                      instruction.config.viewPorts = {"default": {moduleId: instruction.config.moduleId}};
                    }
                    return instruction;
                  });
                }
                return Promise.resolve(instruction);
              } else {
                return Promise.reject(new Error("Route Not Found: " + url));
              }
            },
            writable: true,
            configurable: true
          },
          createNavigationContext: {
            value: function createNavigationContext(instruction) {
              return new NavigationContext(this, instruction);
            },
            writable: true,
            configurable: true
          },
          generate: {
            value: function generate(name, params) {
              return this.recognizer.generate(name, params);
            },
            writable: true,
            configurable: true
          },
          addRoute: {
            value: function addRoute(config) {
              var navModel = arguments[1] === undefined ? {} : arguments[1];
              if (!("viewPorts" in config)) {
                config.viewPorts = {"default": {
                    moduleId: config.moduleId,
                    view: config.view
                  }};
              }
              navModel.title = navModel.title || config.title;
              navModel.settings = config.settings || (config.settings = {});
              this.routes.push(config);
              this.recognizer.add([{
                path: config.route,
                handler: config
              }]);
              if (config.route) {
                var withChild = JSON.parse(JSON.stringify(config));
                withChild.route += "/*childRoute";
                withChild.hasChildRouter = true;
                this.childRecognizer.add([{
                  path: withChild.route,
                  handler: withChild
                }]);
                withChild.navModel = navModel;
                withChild.settings = config.settings;
              }
              config.navModel = navModel;
              if ((config.nav || "order" in navModel) && this.navigation.indexOf(navModel) === -1) {
                navModel.order = navModel.order || config.nav;
                navModel.href = navModel.href || config.href;
                navModel.isActive = false;
                navModel.config = config;
                if (!config.href) {
                  navModel.relativeHref = config.route;
                  navModel.href = "";
                }
                if (typeof navModel.order != "number") {
                  navModel.order = ++this.fallbackOrder;
                }
                this.navigation.push(navModel);
                this.navigation = this.navigation.sort(function(a, b) {
                  return a.order - b.order;
                });
              }
            },
            writable: true,
            configurable: true
          },
          handleUnknownRoutes: {
            value: function handleUnknownRoutes(config) {
              var callback = function(instruction) {
                return new Promise(function(resolve, reject) {
                  function done(inst) {
                    inst = inst || instruction;
                    inst.config.route = inst.params.path;
                    resolve(inst);
                  }
                  if (!config) {
                    instruction.config.moduleId = instruction.fragment;
                    done(instruction);
                  } else if (typeof config == "string") {
                    instruction.config.moduleId = config;
                    done(instruction);
                  } else if (typeof config == "function") {
                    processPotential(config(instruction), done, reject);
                  } else {
                    instruction.config = config;
                    done(instruction);
                  }
                });
              };
              this.catchAllHandler = callback;
            },
            writable: true,
            configurable: true
          },
          reset: {
            value: function reset() {
              this.fallbackOrder = 100;
              this.recognizer = new RouteRecognizer();
              this.childRecognizer = new RouteRecognizer();
              this.routes = [];
              this.isNavigating = false;
              this.navigation = [];
            },
            writable: true,
            configurable: true
          }
        });
        return Router;
      })());
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/app-router", ["aurelia-dependency-injection", "aurelia-history", "./router", "./pipeline-provider", "./navigation-commands"], function(_export) {
  "use strict";
  var Container,
      History,
      Router,
      PipelineProvider,
      isNavigationCommand,
      _prototypeProperties,
      _get,
      _inherits,
      AppRouter;
  function findAnchor(el) {
    while (el) {
      if (el.tagName === "A")
        return el;
      el = el.parentNode;
    }
  }
  function handleLinkClick(evt) {
    if (!this.isActive) {
      return ;
    }
    var target = findAnchor(evt.target);
    if (!target) {
      return ;
    }
    if (this.history._hasPushState) {
      if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
        var href = target.getAttribute("href");
        if (href !== null && !(href.charAt(0) === "#" || /^[a-z]+:/i.test(href))) {
          evt.preventDefault();
          this.history.navigate(href);
        }
      }
    }
  }
  function targetIsThisWindow(target) {
    var targetWindow = target.getAttribute("target");
    return !targetWindow || targetWindow === window.name || targetWindow === "_self" || targetWindow === "top" && window === window.top;
  }
  return {
    setters: [function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaHistory) {
      History = _aureliaHistory.History;
    }, function(_router) {
      Router = _router.Router;
    }, function(_pipelineProvider) {
      PipelineProvider = _pipelineProvider.PipelineProvider;
    }, function(_navigationCommands) {
      isNavigationCommand = _navigationCommands.isNavigationCommand;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _get = function get(object, property, receiver) {
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc && desc.writable) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === undefined) {
            return undefined;
          }
          return getter.call(receiver);
        }
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      AppRouter = _export("AppRouter", (function(Router) {
        function AppRouter(container, history, pipelineProvider) {
          _get(Object.getPrototypeOf(AppRouter.prototype), "constructor", this).call(this, container, history);
          this.pipelineProvider = pipelineProvider;
          document.addEventListener("click", handleLinkClick.bind(this), true);
        }
        _inherits(AppRouter, Router);
        _prototypeProperties(AppRouter, {inject: {
            value: function inject() {
              return [Container, History, PipelineProvider];
            },
            writable: true,
            configurable: true
          }}, {
          loadUrl: {
            value: function loadUrl(url) {
              var _this = this;
              return this.createNavigationInstruction(url).then(function(instruction) {
                return _this.queueInstruction(instruction);
              })["catch"](function(error) {
                console.error(error);
                if (_this.history.previousFragment) {
                  _this.navigate(_this.history.previousFragment, false);
                }
              });
            },
            writable: true,
            configurable: true
          },
          queueInstruction: {
            value: function queueInstruction(instruction) {
              var _this = this;
              return new Promise(function(resolve) {
                instruction.resolve = resolve;
                _this.queue.unshift(instruction);
                _this.dequeueInstruction();
              });
            },
            writable: true,
            configurable: true
          },
          dequeueInstruction: {
            value: function dequeueInstruction() {
              var _this = this;
              if (this.isNavigating) {
                return ;
              }
              var instruction = this.queue.shift();
              this.queue = [];
              if (!instruction) {
                return ;
              }
              this.isNavigating = true;
              var context = this.createNavigationContext(instruction);
              var pipeline = this.pipelineProvider.createPipeline(context);
              pipeline.run(context).then(function(result) {
                _this.isNavigating = false;
                if (result.completed) {
                  _this.history.previousFragment = instruction.fragment;
                }
                if (result.output instanceof Error) {
                  console.error(result.output);
                }
                if (isNavigationCommand(result.output)) {
                  result.output.navigate(_this);
                } else if (!result.completed) {
                  _this.navigate(_this.history.previousFragment || "", false);
                }
                instruction.resolve(result);
                _this.dequeueInstruction();
              })["catch"](function(error) {
                console.error(error);
              });
            },
            writable: true,
            configurable: true
          },
          registerViewPort: {
            value: function registerViewPort(viewPort, name) {
              var _this = this;
              _get(Object.getPrototypeOf(AppRouter.prototype), "registerViewPort", this).call(this, viewPort, name);
              if (!this.isActive) {
                if ("configureRouter" in this.container.viewModel) {
                  var result = this.container.viewModel.configureRouter() || Promise.resolve();
                  return result.then(function() {
                    return _this.activate();
                  });
                } else {
                  this.activate();
                }
              } else {
                this.dequeueInstruction();
              }
            },
            writable: true,
            configurable: true
          },
          activate: {
            value: function activate(options) {
              if (this.isActive) {
                return ;
              }
              this.isActive = true;
              this.options = Object.assign({routeHandler: this.loadUrl.bind(this)}, this.options, options);
              this.history.activate(this.options);
              this.dequeueInstruction();
            },
            writable: true,
            configurable: true
          },
          deactivate: {
            value: function deactivate() {
              this.isActive = false;
              this.history.deactivate();
            },
            writable: true,
            configurable: true
          },
          reset: {
            value: function reset() {
              _get(Object.getPrototypeOf(AppRouter.prototype), "reset", this).call(this);
              this.queue = [];
              this.options = null;
            },
            writable: true,
            configurable: true
          }
        });
        return AppRouter;
      })(Router));
    }
  };
});

System.register("npm:core-js@0.4.10/index", ["process"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  "format cjs";
  (function(process) {
    !function(global, framework, undefined) {
      'use strict';
      var OBJECT = 'Object',
          FUNCTION = 'Function',
          ARRAY = 'Array',
          STRING = 'String',
          NUMBER = 'Number',
          REGEXP = 'RegExp',
          DATE = 'Date',
          MAP = 'Map',
          SET = 'Set',
          WEAKMAP = 'WeakMap',
          WEAKSET = 'WeakSet',
          SYMBOL = 'Symbol',
          PROMISE = 'Promise',
          MATH = 'Math',
          ARGUMENTS = 'Arguments',
          PROTOTYPE = 'prototype',
          CONSTRUCTOR = 'constructor',
          TO_STRING = 'toString',
          TO_STRING_TAG = TO_STRING + 'Tag',
          TO_LOCALE = 'toLocaleString',
          HAS_OWN = 'hasOwnProperty',
          FOR_EACH = 'forEach',
          ITERATOR = 'iterator',
          FF_ITERATOR = '@@' + ITERATOR,
          PROCESS = 'process',
          CREATE_ELEMENT = 'createElement',
          Function = global[FUNCTION],
          Object = global[OBJECT],
          Array = global[ARRAY],
          String = global[STRING],
          Number = global[NUMBER],
          RegExp = global[REGEXP],
          Date = global[DATE],
          Map = global[MAP],
          Set = global[SET],
          WeakMap = global[WEAKMAP],
          WeakSet = global[WEAKSET],
          Symbol = global[SYMBOL],
          Math = global[MATH],
          TypeError = global.TypeError,
          setTimeout = global.setTimeout,
          setImmediate = global.setImmediate,
          clearImmediate = global.clearImmediate,
          process = global[PROCESS],
          nextTick = process && process.nextTick,
          document = global.document,
          html = document && document.documentElement,
          navigator = global.navigator,
          define = global.define,
          ArrayProto = Array[PROTOTYPE],
          ObjectProto = Object[PROTOTYPE],
          FunctionProto = Function[PROTOTYPE],
          Infinity = 1 / 0,
          DOT = '.';
      function isObject(it) {
        return it != null && (typeof it == 'object' || typeof it == 'function');
      }
      function isFunction(it) {
        return typeof it == 'function';
      }
      var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);
      var buildIn = {
        Undefined: 1,
        Null: 1,
        Array: 1,
        String: 1,
        Arguments: 1,
        Function: 1,
        Error: 1,
        Boolean: 1,
        Number: 1,
        Date: 1,
        RegExp: 1
      },
          toString = ObjectProto[TO_STRING];
      function setToStringTag(it, tag, stat) {
        if (it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG))
          hidden(it, SYMBOL_TAG, tag);
      }
      function cof(it) {
        return it == undefined ? it === undefined ? 'Undefined' : 'Null' : toString.call(it).slice(8, -1);
      }
      function classof(it) {
        var klass = cof(it),
            tag;
        return klass == OBJECT && (tag = it[SYMBOL_TAG]) ? has(buildIn, tag) ? '~' + tag : tag : klass;
      }
      var call = FunctionProto.call,
          apply = FunctionProto.apply,
          REFERENCE_GET;
      function part() {
        var fn = assertFunction(this),
            length = arguments.length,
            args = Array(length),
            i = 0,
            _ = path._,
            holder = false;
        while (length > i)
          if ((args[i] = arguments[i++]) === _)
            holder = true;
        return function() {
          var that = this,
              _length = arguments.length,
              i = 0,
              j = 0,
              _args;
          if (!holder && !_length)
            return invoke(fn, args, that);
          _args = args.slice();
          if (holder)
            for (; length > i; i++)
              if (_args[i] === _)
                _args[i] = arguments[j++];
          while (_length > j)
            _args.push(arguments[j++]);
          return invoke(fn, _args, that);
        };
      }
      function ctx(fn, that, length) {
        assertFunction(fn);
        if (~length && that === undefined)
          return fn;
        switch (length) {
          case 1:
            return function(a) {
              return fn.call(that, a);
            };
          case 2:
            return function(a, b) {
              return fn.call(that, a, b);
            };
          case 3:
            return function(a, b, c) {
              return fn.call(that, a, b, c);
            };
        }
        return function() {
          return fn.apply(that, arguments);
        };
      }
      function invoke(fn, args, that) {
        var un = that === undefined;
        switch (args.length | 0) {
          case 0:
            return un ? fn() : fn.call(that);
          case 1:
            return un ? fn(args[0]) : fn.call(that, args[0]);
          case 2:
            return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
          case 3:
            return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
          case 4:
            return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
          case 5:
            return un ? fn(args[0], args[1], args[2], args[3], args[4]) : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
        }
        return fn.apply(that, args);
      }
      function construct(target, argumentsList) {
        var proto = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE],
            instance = create(isObject(proto) ? proto : ObjectProto),
            result = apply.call(target, instance, argumentsList);
        return isObject(result) ? result : instance;
      }
      var create = Object.create,
          getPrototypeOf = Object.getPrototypeOf,
          setPrototypeOf = Object.setPrototypeOf,
          defineProperty = Object.defineProperty,
          defineProperties = Object.defineProperties,
          getOwnDescriptor = Object.getOwnPropertyDescriptor,
          getKeys = Object.keys,
          getNames = Object.getOwnPropertyNames,
          getSymbols = Object.getOwnPropertySymbols,
          isFrozen = Object.isFrozen,
          has = ctx(call, ObjectProto[HAS_OWN], 2),
          ES5Object = Object,
          Dict;
      function toObject(it) {
        return ES5Object(assertDefined(it));
      }
      function returnIt(it) {
        return it;
      }
      function returnThis() {
        return this;
      }
      function get(object, key) {
        if (has(object, key))
          return object[key];
      }
      function ownKeys(it) {
        assertObject(it);
        return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
      }
      var assign = Object.assign || function(target, source) {
        var T = Object(assertDefined(target)),
            l = arguments.length,
            i = 1;
        while (l > i) {
          var S = ES5Object(arguments[i++]),
              keys = getKeys(S),
              length = keys.length,
              j = 0,
              key;
          while (length > j)
            T[key = keys[j++]] = S[key];
        }
        return T;
      };
      function keyOf(object, el) {
        var O = toObject(object),
            keys = getKeys(O),
            length = keys.length,
            index = 0,
            key;
        while (length > index)
          if (O[key = keys[index++]] === el)
            return key;
      }
      function array(it) {
        return String(it).split(',');
      }
      var push = ArrayProto.push,
          unshift = ArrayProto.unshift,
          slice = ArrayProto.slice,
          splice = ArrayProto.splice,
          indexOf = ArrayProto.indexOf,
          forEach = ArrayProto[FOR_EACH];
      function createArrayMethod(type) {
        var isMap = type == 1,
            isFilter = type == 2,
            isSome = type == 3,
            isEvery = type == 4,
            isFindIndex = type == 6,
            noholes = type == 5 || isFindIndex;
        return function(callbackfn) {
          var O = Object(assertDefined(this)),
              that = arguments[1],
              self = ES5Object(O),
              f = ctx(callbackfn, that, 3),
              length = toLength(self.length),
              index = 0,
              result = isMap ? Array(length) : isFilter ? [] : undefined,
              val,
              res;
          for (; length > index; index++)
            if (noholes || index in self) {
              val = self[index];
              res = f(val, index, O);
              if (type) {
                if (isMap)
                  result[index] = res;
                else if (res)
                  switch (type) {
                    case 3:
                      return true;
                    case 5:
                      return val;
                    case 6:
                      return index;
                    case 2:
                      result.push(val);
                  }
                else if (isEvery)
                  return false;
              }
            }
          return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
        };
      }
      function createArrayContains(isContains) {
        return function(el) {
          var O = toObject(this),
              length = toLength(O.length),
              index = toIndex(arguments[1], length);
          if (isContains && el != el) {
            for (; length > index; index++)
              if (sameNaN(O[index]))
                return isContains || index;
          } else
            for (; length > index; index++)
              if (isContains || index in O) {
                if (O[index] === el)
                  return isContains || index;
              }
          return !isContains && -1;
        };
      }
      function generic(A, B) {
        return typeof A == 'function' ? A : B;
      }
      var MAX_SAFE_INTEGER = 0x1fffffffffffff,
          ceil = Math.ceil,
          floor = Math.floor,
          max = Math.max,
          min = Math.min,
          random = Math.random,
          trunc = Math.trunc || function(it) {
            return (it > 0 ? floor : ceil)(it);
          };
      function sameNaN(number) {
        return number != number;
      }
      function toInteger(it) {
        return isNaN(it) ? 0 : trunc(it);
      }
      function toLength(it) {
        return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
      }
      function toIndex(index, length) {
        var index = toInteger(index);
        return index < 0 ? max(index + length, 0) : min(index, length);
      }
      function createReplacer(regExp, replace, isStatic) {
        var replacer = isObject(replace) ? function(part) {
          return replace[part];
        } : replace;
        return function(it) {
          return String(isStatic ? it : this).replace(regExp, replacer);
        };
      }
      function createPointAt(toString) {
        return function(pos) {
          var s = String(assertDefined(this)),
              i = toInteger(pos),
              l = s.length,
              a,
              b;
          if (i < 0 || i >= l)
            return toString ? '' : undefined;
          a = s.charCodeAt(i);
          return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? toString ? s.charAt(i) : a : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
        };
      }
      var REDUCE_ERROR = 'Reduce of empty object with no initial value';
      function assert(condition, msg1, msg2) {
        if (!condition)
          throw TypeError(msg2 ? msg1 + msg2 : msg1);
      }
      function assertDefined(it) {
        if (it == undefined)
          throw TypeError('Function called on null or undefined');
        return it;
      }
      function assertFunction(it) {
        assert(isFunction(it), it, ' is not a function!');
        return it;
      }
      function assertObject(it) {
        assert(isObject(it), it, ' is not an object!');
        return it;
      }
      function assertInstance(it, Constructor, name) {
        assert(it instanceof Constructor, name, ": use the 'new' operator!");
      }
      function descriptor(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      }
      function simpleSet(object, key, value) {
        object[key] = value;
        return object;
      }
      function createDefiner(bitmap) {
        return DESC ? function(object, key, value) {
          return defineProperty(object, key, descriptor(bitmap, value));
        } : simpleSet;
      }
      function uid(key) {
        return SYMBOL + '(' + key + ')_' + (++sid + random())[TO_STRING](36);
      }
      function getWellKnownSymbol(name, setter) {
        return (Symbol && Symbol[name]) || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
      }
      var DESC = !!function() {
        try {
          return defineProperty({}, DOT, ObjectProto);
        } catch (e) {}
      }(),
          sid = 0,
          hidden = createDefiner(1),
          set = Symbol ? simpleSet : hidden,
          safeSymbol = Symbol || uid;
      function assignHidden(target, src) {
        for (var key in src)
          hidden(target, key, src[key]);
        return target;
      }
      var SYMBOL_UNSCOPABLES = getWellKnownSymbol('unscopables'),
          ArrayUnscopables = ArrayProto[SYMBOL_UNSCOPABLES] || {},
          SYMBOL_SPECIES = getWellKnownSymbol('species');
      function setSpecies(C) {
        if (framework || !isNative(C))
          defineProperty(C, SYMBOL_SPECIES, {
            configurable: true,
            get: returnThis
          });
      }
      var SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR),
          SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG),
          SUPPORT_FF_ITER = FF_ITERATOR in ArrayProto,
          ITER = safeSymbol('iter'),
          KEY = 1,
          VALUE = 2,
          Iterators = {},
          IteratorPrototype = {},
          NATIVE_ITERATORS = SYMBOL_ITERATOR in ArrayProto,
          BUGGY_ITERATORS = 'keys' in ArrayProto && !('next' in [].keys());
      setIterator(IteratorPrototype, returnThis);
      function setIterator(O, value) {
        hidden(O, SYMBOL_ITERATOR, value);
        SUPPORT_FF_ITER && hidden(O, FF_ITERATOR, value);
      }
      function createIterator(Constructor, NAME, next, proto) {
        Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {next: descriptor(1, next)});
        setToStringTag(Constructor, NAME + ' Iterator');
      }
      function defineIterator(Constructor, NAME, value, DEFAULT) {
        var proto = Constructor[PROTOTYPE],
            iter = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || (DEFAULT && get(proto, DEFAULT)) || value;
        if (framework) {
          setIterator(proto, iter);
          if (iter !== value) {
            var iterProto = getPrototypeOf(iter.call(new Constructor));
            setToStringTag(iterProto, NAME + ' Iterator', true);
            has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
          }
        }
        Iterators[NAME] = iter;
        Iterators[NAME + ' Iterator'] = returnThis;
        return iter;
      }
      function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET) {
        function createIter(kind) {
          return function() {
            return new Constructor(this, kind);
          };
        }
        createIterator(Constructor, NAME, next);
        var entries = createIter(KEY + VALUE),
            values = createIter(VALUE);
        if (DEFAULT == VALUE)
          values = defineIterator(Base, NAME, values, 'values');
        else
          entries = defineIterator(Base, NAME, entries, 'entries');
        if (DEFAULT) {
          $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
            entries: entries,
            keys: IS_SET ? values : createIter(KEY),
            values: values
          });
        }
      }
      function iterResult(done, value) {
        return {
          value: value,
          done: !!done
        };
      }
      function isIterable(it) {
        var O = Object(it),
            Symbol = global[SYMBOL],
            hasExt = (Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O;
        return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
      }
      function getIterator(it) {
        var Symbol = global[SYMBOL],
            ext = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR],
            getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
        return assertObject(getIter.call(it));
      }
      function stepCall(fn, value, entries) {
        return entries ? invoke(fn, value) : fn(value);
      }
      function forOf(iterable, entries, fn, that) {
        var iterator = getIterator(iterable),
            f = ctx(fn, that, entries ? 2 : 1),
            step;
        while (!(step = iterator.next()).done)
          if (stepCall(f, step.value, entries) === false)
            return ;
      }
      var NODE = cof(process) == PROCESS,
          core = {},
          path = framework ? global : core,
          old = global.core,
          exportGlobal,
          FORCED = 1,
          GLOBAL = 2,
          STATIC = 4,
          PROTO = 8,
          BIND = 16,
          WRAP = 32;
      function $define(type, name, source) {
        var key,
            own,
            out,
            exp,
            isGlobal = type & GLOBAL,
            target = isGlobal ? global : (type & STATIC) ? global[name] : (global[name] || ObjectProto)[PROTOTYPE],
            exports = isGlobal ? core : core[name] || (core[name] = {});
        if (isGlobal)
          source = name;
        for (key in source) {
          own = !(type & FORCED) && target && key in target && (!isFunction(target[key]) || isNative(target[key]));
          out = (own ? target : source)[key];
          if (type & BIND && own)
            exp = ctx(out, global);
          else if (type & WRAP && !framework && target[key] == out) {
            exp = function(param) {
              return this instanceof out ? new out(param) : out(param);
            };
            exp[PROTOTYPE] = out[PROTOTYPE];
          } else
            exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
          if (exports[key] != out)
            hidden(exports, key, exp);
          if (framework && target && !own) {
            if (isGlobal)
              target[key] = out;
            else
              delete target[key] && hidden(target, key, out);
          }
        }
      }
      if (typeof module != 'undefined' && module.exports)
        module.exports = core;
      else if (isFunction(define) && define.amd)
        define(function() {
          return core;
        });
      else
        exportGlobal = true;
      if (exportGlobal || framework) {
        core.noConflict = function() {
          global.core = old;
          return core;
        };
        global.core = core;
      }
      $define(GLOBAL + FORCED, {global: global});
      !function(TAG, SymbolRegistry, AllSymbols, setter) {
        if (!isNative(Symbol)) {
          Symbol = function(description) {
            assert(!(this instanceof Symbol), SYMBOL + ' is not a ' + CONSTRUCTOR);
            var tag = uid(description),
                sym = set(create(Symbol[PROTOTYPE]), TAG, tag);
            AllSymbols[tag] = sym;
            DESC && setter && defineProperty(ObjectProto, tag, {
              configurable: true,
              set: function(value) {
                hidden(this, tag, value);
              }
            });
            return sym;
          };
          hidden(Symbol[PROTOTYPE], TO_STRING, function() {
            return this[TAG];
          });
        }
        $define(GLOBAL + WRAP, {Symbol: Symbol});
        var symbolStatics = {
          'for': function(key) {
            return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = Symbol(key);
          },
          iterator: SYMBOL_ITERATOR,
          keyFor: part.call(keyOf, SymbolRegistry),
          species: SYMBOL_SPECIES,
          toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true),
          unscopables: SYMBOL_UNSCOPABLES,
          pure: safeSymbol,
          set: set,
          useSetter: function() {
            setter = true;
          },
          useSimple: function() {
            setter = false;
          }
        };
        forEach.call(array('hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive'), function(it) {
          symbolStatics[it] = getWellKnownSymbol(it);
        });
        $define(STATIC, SYMBOL, symbolStatics);
        setToStringTag(Symbol, SYMBOL);
        $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
          getOwnPropertyNames: function(it) {
            var names = getNames(toObject(it)),
                result = [],
                key,
                i = 0;
            while (names.length > i)
              has(AllSymbols, key = names[i++]) || result.push(key);
            return result;
          },
          getOwnPropertySymbols: function(it) {
            var names = getNames(toObject(it)),
                result = [],
                key,
                i = 0;
            while (names.length > i)
              has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
            return result;
          }
        });
      }(safeSymbol('tag'), {}, {}, true);
      !function(RegExpProto, isFinite, tmp, NAME) {
        var RangeError = global.RangeError,
            isInteger = Number.isInteger || function(it) {
              return !isObject(it) && isFinite(it) && floor(it) === it;
            },
            sign = Math.sign || function sign(x) {
              return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
            },
            E = Math.E,
            pow = Math.pow,
            abs = Math.abs,
            exp = Math.exp,
            log = Math.log,
            sqrt = Math.sqrt,
            fcc = String.fromCharCode,
            at = createPointAt(true);
        var objectStatic = {
          assign: assign,
          is: function(x, y) {
            return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
          }
        };
        '__proto__' in ObjectProto && function(buggy, set) {
          try {
            set = ctx(call, getOwnDescriptor(ObjectProto, '__proto__').set, 2);
            set({}, ArrayProto);
          } catch (e) {
            buggy = true;
          }
          objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function(O, proto) {
            assertObject(O);
            assert(proto === null || isObject(proto), proto, ": can't set as prototype!");
            if (buggy)
              O.__proto__ = proto;
            else
              set(O, proto);
            return O;
          };
        }();
        $define(STATIC, OBJECT, objectStatic);
        function asinh(x) {
          return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
        }
        function expm1(x) {
          return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
        }
        $define(STATIC, NUMBER, {
          EPSILON: pow(2, -52),
          isFinite: function(it) {
            return typeof it == 'number' && isFinite(it);
          },
          isInteger: isInteger,
          isNaN: sameNaN,
          isSafeInteger: function(number) {
            return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
          },
          MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
          MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
          parseFloat: parseFloat,
          parseInt: parseInt
        });
        $define(STATIC, MATH, {
          acosh: function(x) {
            return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
          },
          asinh: asinh,
          atanh: function(x) {
            return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
          },
          cbrt: function(x) {
            return sign(x = +x) * pow(abs(x), 1 / 3);
          },
          clz32: function(x) {
            return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
          },
          cosh: function(x) {
            return (exp(x = +x) + exp(-x)) / 2;
          },
          expm1: expm1,
          fround: function(x) {
            return new Float32Array([x])[0];
          },
          hypot: function(value1, value2) {
            var sum = 0,
                len1 = arguments.length,
                len2 = len1,
                args = Array(len1),
                larg = -Infinity,
                arg;
            while (len1--) {
              arg = args[len1] = +arguments[len1];
              if (arg == Infinity || arg == -Infinity)
                return Infinity;
              if (arg > larg)
                larg = arg;
            }
            larg = arg || 1;
            while (len2--)
              sum += pow(args[len2] / larg, 2);
            return larg * sqrt(sum);
          },
          imul: function(x, y) {
            var UInt16 = 0xffff,
                xn = +x,
                yn = +y,
                xl = UInt16 & xn,
                yl = UInt16 & yn;
            return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
          },
          log1p: function(x) {
            return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
          },
          log10: function(x) {
            return log(x) / Math.LN10;
          },
          log2: function(x) {
            return log(x) / Math.LN2;
          },
          sign: sign,
          sinh: function(x) {
            return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
          },
          tanh: function(x) {
            var a = expm1(x = +x),
                b = expm1(-x);
            return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
          },
          trunc: trunc
        });
        setToStringTag(Math, MATH, true);
        function assertNotRegExp(it) {
          if (cof(it) == REGEXP)
            throw TypeError();
        }
        $define(STATIC, STRING, {
          fromCodePoint: function(x) {
            var res = [],
                len = arguments.length,
                i = 0,
                code;
            while (len > i) {
              code = +arguments[i++];
              if (toIndex(code, 0x10ffff) !== code)
                throw RangeError(code + ' is not a valid code point');
              res.push(code < 0x10000 ? fcc(code) : fcc(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
            }
            return res.join('');
          },
          raw: function(callSite) {
            var raw = toObject(callSite.raw),
                len = toLength(raw.length),
                sln = arguments.length,
                res = [],
                i = 0;
            while (len > i) {
              res.push(String(raw[i++]));
              if (i < sln)
                res.push(String(arguments[i]));
            }
            return res.join('');
          }
        });
        $define(PROTO, STRING, {
          codePointAt: createPointAt(false),
          endsWith: function(searchString) {
            assertNotRegExp(searchString);
            var that = String(assertDefined(this)),
                endPosition = arguments[1],
                len = toLength(that.length),
                end = endPosition === undefined ? len : min(toLength(endPosition), len);
            searchString += '';
            return that.slice(end - searchString.length, end) === searchString;
          },
          includes: function(searchString) {
            assertNotRegExp(searchString);
            return !!~String(assertDefined(this)).indexOf(searchString, arguments[1]);
          },
          repeat: function(count) {
            var str = String(assertDefined(this)),
                res = '',
                n = toInteger(count);
            if (0 > n || n == Infinity)
              throw RangeError("Count can't be negative");
            for (; n > 0; (n >>>= 1) && (str += str))
              if (n & 1)
                res += str;
            return res;
          },
          startsWith: function(searchString) {
            assertNotRegExp(searchString);
            var that = String(assertDefined(this)),
                index = toLength(min(arguments[1], that.length));
            searchString += '';
            return that.slice(index, index + searchString.length) === searchString;
          }
        });
        defineStdIterators(String, STRING, function(iterated) {
          set(this, ITER, {
            o: String(iterated),
            i: 0
          });
        }, function() {
          var iter = this[ITER],
              O = iter.o,
              index = iter.i,
              point;
          if (index >= O.length)
            return iterResult(1);
          point = at.call(O, index);
          iter.i += point.length;
          return iterResult(0, point);
        });
        $define(STATIC, ARRAY, {
          from: function(arrayLike) {
            var O = Object(assertDefined(arrayLike)),
                result = new (generic(this, Array)),
                mapfn = arguments[1],
                that = arguments[2],
                mapping = mapfn !== undefined,
                f = mapping ? ctx(mapfn, that, 2) : undefined,
                index = 0,
                length;
            if (isIterable(O))
              for (var iter = getIterator(O),
                  step; !(step = iter.next()).done; index++) {
                result[index] = mapping ? f(step.value, index) : step.value;
              }
            else
              for (length = toLength(O.length); length > index; index++) {
                result[index] = mapping ? f(O[index], index) : O[index];
              }
            result.length = index;
            return result;
          },
          of: function() {
            var index = 0,
                length = arguments.length,
                result = new (generic(this, Array))(length);
            while (length > index)
              result[index] = arguments[index++];
            result.length = length;
            return result;
          }
        });
        $define(PROTO, ARRAY, {
          copyWithin: function(target, start) {
            var O = Object(assertDefined(this)),
                len = toLength(O.length),
                to = toIndex(target, len),
                from = toIndex(start, len),
                end = arguments[2],
                fin = end === undefined ? len : toIndex(end, len),
                count = min(fin - from, len - to),
                inc = 1;
            if (from < to && to < from + count) {
              inc = -1;
              from = from + count - 1;
              to = to + count - 1;
            }
            while (count-- > 0) {
              if (from in O)
                O[to] = O[from];
              else
                delete O[to];
              to += inc;
              from += inc;
            }
            return O;
          },
          fill: function(value) {
            var O = Object(assertDefined(this)),
                length = toLength(O.length),
                index = toIndex(arguments[1], length),
                end = arguments[2],
                endPos = end === undefined ? length : toIndex(end, length);
            while (endPos > index)
              O[index++] = value;
            return O;
          },
          find: createArrayMethod(5),
          findIndex: createArrayMethod(6)
        });
        defineStdIterators(Array, ARRAY, function(iterated, kind) {
          set(this, ITER, {
            o: toObject(iterated),
            i: 0,
            k: kind
          });
        }, function() {
          var iter = this[ITER],
              O = iter.o,
              kind = iter.k,
              index = iter.i++;
          if (!O || index >= O.length)
            return iter.o = undefined, iterResult(1);
          if (kind == KEY)
            return iterResult(0, index);
          if (kind == VALUE)
            return iterResult(0, O[index]);
          return iterResult(0, [index, O[index]]);
        }, VALUE);
        Iterators[ARGUMENTS] = Iterators[ARRAY];
        setToStringTag(global.JSON, 'JSON', true);
        function wrapObjectMethod(key, MODE) {
          var fn = Object[key],
              exp = core[OBJECT][key],
              f = 0,
              o = {};
          if (!exp || isNative(exp)) {
            o[key] = MODE == 1 ? function(it) {
              return isObject(it) ? fn(it) : it;
            } : MODE == 2 ? function(it) {
              return isObject(it) ? fn(it) : true;
            } : MODE == 3 ? function(it) {
              return isObject(it) ? fn(it) : false;
            } : MODE == 4 ? function(it, key) {
              return fn(toObject(it), key);
            } : function(it) {
              return fn(toObject(it));
            };
            try {
              fn(DOT);
            } catch (e) {
              f = 1;
            }
            $define(STATIC + FORCED * f, OBJECT, o);
          }
        }
        wrapObjectMethod('freeze', 1);
        wrapObjectMethod('seal', 1);
        wrapObjectMethod('preventExtensions', 1);
        wrapObjectMethod('isFrozen', 2);
        wrapObjectMethod('isSealed', 2);
        wrapObjectMethod('isExtensible', 3);
        wrapObjectMethod('getOwnPropertyDescriptor', 4);
        wrapObjectMethod('getPrototypeOf');
        wrapObjectMethod('keys');
        wrapObjectMethod('getOwnPropertyNames');
        if (framework) {
          tmp[SYMBOL_TAG] = DOT;
          if (cof(tmp) != DOT)
            hidden(ObjectProto, TO_STRING, function() {
              return '[object ' + classof(this) + ']';
            });
          NAME in FunctionProto || defineProperty(FunctionProto, NAME, {
            configurable: true,
            get: function() {
              var match = String(this).match(/^\s*function ([^ (]*)/),
                  name = match ? match[1] : '';
              has(this, NAME) || defineProperty(this, NAME, descriptor(5, name));
              return name;
            },
            set: function(value) {
              has(this, NAME) || defineProperty(this, NAME, descriptor(0, value));
            }
          });
          if (DESC && !function() {
            try {
              return RegExp(/a/g, 'i') == '/a/i';
            } catch (e) {}
          }()) {
            var _RegExp = RegExp;
            RegExp = function RegExp(pattern, flags) {
              return new _RegExp(cof(pattern) == REGEXP && flags !== undefined ? pattern.source : pattern, flags);
            };
            forEach.call(getNames(_RegExp), function(key) {
              key in RegExp || defineProperty(RegExp, key, {
                configurable: true,
                get: function() {
                  return _RegExp[key];
                },
                set: function(it) {
                  _RegExp[key] = it;
                }
              });
            });
            RegExpProto[CONSTRUCTOR] = RegExp;
            RegExp[PROTOTYPE] = RegExpProto;
            hidden(global, REGEXP, RegExp);
          }
          if (/./g.flags != 'g')
            defineProperty(RegExpProto, 'flags', {
              configurable: true,
              get: createReplacer(/^.*\/(\w*)$/, '$1')
            });
          forEach.call(array('find,findIndex,fill,copyWithin,entries,keys,values'), function(it) {
            ArrayUnscopables[it] = true;
          });
          SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
        }
        setSpecies(RegExp);
        setSpecies(Array);
      }(RegExp[PROTOTYPE], isFinite, {}, 'name');
      isFunction(setImmediate) && isFunction(clearImmediate) || function(ONREADYSTATECHANGE) {
        var postMessage = global.postMessage,
            addEventListener = global.addEventListener,
            MessageChannel = global.MessageChannel,
            counter = 0,
            queue = {},
            defer,
            channel,
            port;
        setImmediate = function(fn) {
          var args = [],
              i = 1;
          while (arguments.length > i)
            args.push(arguments[i++]);
          queue[++counter] = function() {
            invoke(isFunction(fn) ? fn : Function(fn), args);
          };
          defer(counter);
          return counter;
        };
        clearImmediate = function(id) {
          delete queue[id];
        };
        function run(id) {
          if (has(queue, id)) {
            var fn = queue[id];
            delete queue[id];
            fn();
          }
        }
        function listner(event) {
          run(event.data);
        }
        if (NODE) {
          defer = function(id) {
            nextTick(part.call(run, id));
          };
        } else if (addEventListener && isFunction(postMessage) && !global.importScripts) {
          defer = function(id) {
            postMessage(id, '*');
          };
          addEventListener('message', listner, false);
        } else if (isFunction(MessageChannel)) {
          channel = new MessageChannel;
          port = channel.port2;
          channel.port1.onmessage = listner;
          defer = ctx(port.postMessage, port, 1);
        } else if (document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]('script')) {
          defer = function(id) {
            html.appendChild(document[CREATE_ELEMENT]('script'))[ONREADYSTATECHANGE] = function() {
              html.removeChild(this);
              run(id);
            };
          };
        } else {
          defer = function(id) {
            setTimeout(part.call(run, id), 0);
          };
        }
      }('onreadystatechange');
      $define(GLOBAL + BIND, {
        setImmediate: setImmediate,
        clearImmediate: clearImmediate
      });
      !function(Promise, test) {
        isFunction(Promise) && isFunction(Promise.resolve) && Promise.resolve(test = new Promise(function() {})) == test || function(asap, DEF) {
          function isThenable(o) {
            var then;
            if (isObject(o))
              then = o.then;
            return isFunction(then) ? then : false;
          }
          function notify(def) {
            var chain = def.chain;
            chain.length && asap(function() {
              var msg = def.msg,
                  ok = def.state == 1,
                  i = 0;
              while (chain.length > i)
                !function(react) {
                  var cb = ok ? react.ok : react.fail,
                      ret,
                      then;
                  try {
                    if (cb) {
                      ret = cb === true ? msg : cb(msg);
                      if (ret === react.P) {
                        react.rej(TypeError(PROMISE + '-chain cycle'));
                      } else if (then = isThenable(ret)) {
                        then.call(ret, react.res, react.rej);
                      } else
                        react.res(ret);
                    } else
                      react.rej(msg);
                  } catch (err) {
                    react.rej(err);
                  }
                }(chain[i++]);
              chain.length = 0;
            });
          }
          function resolve(msg) {
            var def = this,
                then,
                wrapper;
            if (def.done)
              return ;
            def.done = true;
            def = def.def || def;
            try {
              if (then = isThenable(msg)) {
                wrapper = {
                  def: def,
                  done: false
                };
                then.call(msg, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
              } else {
                def.msg = msg;
                def.state = 1;
                notify(def);
              }
            } catch (err) {
              reject.call(wrapper || {
                def: def,
                done: false
              }, err);
            }
          }
          function reject(msg) {
            var def = this;
            if (def.done)
              return ;
            def.done = true;
            def = def.def || def;
            def.msg = msg;
            def.state = 2;
            notify(def);
          }
          function getConstructor(C) {
            var S = assertObject(C)[SYMBOL_SPECIES];
            return S != undefined ? S : C;
          }
          Promise = function(executor) {
            assertFunction(executor);
            assertInstance(this, Promise, PROMISE);
            var def = {
              chain: [],
              state: 0,
              done: false,
              msg: undefined
            };
            hidden(this, DEF, def);
            try {
              executor(ctx(resolve, def, 1), ctx(reject, def, 1));
            } catch (err) {
              reject.call(def, err);
            }
          };
          assignHidden(Promise[PROTOTYPE], {
            then: function(onFulfilled, onRejected) {
              var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];
              var react = {
                ok: isFunction(onFulfilled) ? onFulfilled : true,
                fail: isFunction(onRejected) ? onRejected : false
              },
                  P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject) {
                    react.res = assertFunction(resolve);
                    react.rej = assertFunction(reject);
                  }),
                  def = this[DEF];
              def.chain.push(react);
              def.state && notify(def);
              return P;
            },
            'catch': function(onRejected) {
              return this.then(undefined, onRejected);
            }
          });
          assignHidden(Promise, {
            all: function(iterable) {
              var Promise = getConstructor(this),
                  values = [];
              return new Promise(function(resolve, reject) {
                forOf(iterable, false, push, values);
                var remaining = values.length,
                    results = Array(remaining);
                if (remaining)
                  forEach.call(values, function(promise, index) {
                    Promise.resolve(promise).then(function(value) {
                      results[index] = value;
                      --remaining || resolve(results);
                    }, reject);
                  });
                else
                  resolve(results);
              });
            },
            race: function(iterable) {
              var Promise = getConstructor(this);
              return new Promise(function(resolve, reject) {
                forOf(iterable, false, function(promise) {
                  Promise.resolve(promise).then(resolve, reject);
                });
              });
            },
            reject: function(r) {
              return new (getConstructor(this))(function(resolve, reject) {
                reject(r);
              });
            },
            resolve: function(x) {
              return isObject(x) && DEF in x && getPrototypeOf(x) === this[PROTOTYPE] ? x : new (getConstructor(this))(function(resolve, reject) {
                resolve(x);
              });
            }
          });
        }(nextTick || setImmediate, safeSymbol('def'));
        setToStringTag(Promise, PROMISE);
        setSpecies(Promise);
        $define(GLOBAL + FORCED * !isNative(Promise), {Promise: Promise});
      }(global[PROMISE]);
      !function() {
        var UID = safeSymbol('uid'),
            O1 = safeSymbol('O1'),
            WEAK = safeSymbol('weak'),
            LEAK = safeSymbol('leak'),
            LAST = safeSymbol('last'),
            FIRST = safeSymbol('first'),
            SIZE = DESC ? safeSymbol('size') : 'size',
            uid = 0,
            tmp = {};
        function getCollection(C, NAME, methods, commonMethods, isMap, isWeak) {
          var ADDER = isMap ? 'set' : 'add',
              proto = C && C[PROTOTYPE],
              O = {};
          function initFromIterable(that, iterable) {
            if (iterable != undefined)
              forOf(iterable, isMap, that[ADDER], that);
            return that;
          }
          function fixSVZ(key, chain) {
            var method = proto[key];
            if (framework)
              proto[key] = function(a, b) {
                var result = method.call(this, a === 0 ? 0 : a, b);
                return chain ? this : result;
              };
          }
          if (!isNative(C) || !(isWeak || (!BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, 'entries')))) {
            C = isWeak ? function(iterable) {
              assertInstance(this, C, NAME);
              set(this, UID, uid++);
              initFromIterable(this, iterable);
            } : function(iterable) {
              var that = this;
              assertInstance(that, C, NAME);
              set(that, O1, create(null));
              set(that, SIZE, 0);
              set(that, LAST, undefined);
              set(that, FIRST, undefined);
              initFromIterable(that, iterable);
            };
            assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);
            isWeak || defineProperty(C[PROTOTYPE], 'size', {get: function() {
                return assertDefined(this[SIZE]);
              }});
          } else {
            var Native = C,
                inst = new C,
                chain = inst[ADDER](isWeak ? {} : -0, 1),
                buggyZero;
            if (!NATIVE_ITERATORS || !C.length) {
              C = function(iterable) {
                assertInstance(this, C, NAME);
                return initFromIterable(new Native, iterable);
              };
              C[PROTOTYPE] = proto;
              if (framework)
                proto[CONSTRUCTOR] = C;
            }
            isWeak || inst[FOR_EACH](function(val, key) {
              buggyZero = 1 / key === -Infinity;
            });
            if (buggyZero) {
              fixSVZ('delete');
              fixSVZ('has');
              isMap && fixSVZ('get');
            }
            if (buggyZero || chain !== inst)
              fixSVZ(ADDER, true);
          }
          setToStringTag(C, NAME);
          setSpecies(C);
          O[NAME] = C;
          $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
          isWeak || defineStdIterators(C, NAME, function(iterated, kind) {
            set(this, ITER, {
              o: iterated,
              k: kind
            });
          }, function() {
            var iter = this[ITER],
                kind = iter.k,
                entry = iter.l;
            while (entry && entry.r)
              entry = entry.p;
            if (!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])) {
              return iter.o = undefined, iterResult(1);
            }
            if (kind == KEY)
              return iterResult(0, entry.k);
            if (kind == VALUE)
              return iterResult(0, entry.v);
            return iterResult(0, [entry.k, entry.v]);
          }, isMap ? KEY + VALUE : VALUE, !isMap);
          return C;
        }
        function fastKey(it, create) {
          if (!isObject(it))
            return (typeof it == 'string' ? 'S' : 'P') + it;
          if (isFrozen(it))
            return 'F';
          if (!has(it, UID)) {
            if (!create)
              return 'E';
            hidden(it, UID, ++uid);
          }
          return 'O' + it[UID];
        }
        function getEntry(that, key) {
          var index = fastKey(key),
              entry;
          if (index != 'F')
            return that[O1][index];
          for (entry = that[FIRST]; entry; entry = entry.n) {
            if (entry.k == key)
              return entry;
          }
        }
        function def(that, key, value) {
          var entry = getEntry(that, key),
              prev,
              index;
          if (entry)
            entry.v = value;
          else {
            that[LAST] = entry = {
              i: index = fastKey(key, true),
              k: key,
              v: value,
              p: prev = that[LAST],
              n: undefined,
              r: false
            };
            if (!that[FIRST])
              that[FIRST] = entry;
            if (prev)
              prev.n = entry;
            that[SIZE]++;
            if (index != 'F')
              that[O1][index] = entry;
          }
          return that;
        }
        var collectionMethods = {
          clear: function() {
            for (var that = this,
                data = that[O1],
                entry = that[FIRST]; entry; entry = entry.n) {
              entry.r = true;
              entry.p = entry.n = undefined;
              delete data[entry.i];
            }
            that[FIRST] = that[LAST] = undefined;
            that[SIZE] = 0;
          },
          'delete': function(key) {
            var that = this,
                entry = getEntry(that, key);
            if (entry) {
              var next = entry.n,
                  prev = entry.p;
              delete that[O1][entry.i];
              entry.r = true;
              if (prev)
                prev.n = next;
              if (next)
                next.p = prev;
              if (that[FIRST] == entry)
                that[FIRST] = next;
              if (that[LAST] == entry)
                that[LAST] = prev;
              that[SIZE]--;
            }
            return !!entry;
          },
          forEach: function(callbackfn) {
            var f = ctx(callbackfn, arguments[1], 3),
                entry;
            while (entry = entry ? entry.n : this[FIRST]) {
              f(entry.v, entry.k, this);
              while (entry && entry.r)
                entry = entry.p;
            }
          },
          has: function(key) {
            return !!getEntry(this, key);
          }
        };
        Map = getCollection(Map, MAP, {
          get: function(key) {
            var entry = getEntry(this, key);
            return entry && entry.v;
          },
          set: function(key, value) {
            return def(this, key === 0 ? 0 : key, value);
          }
        }, collectionMethods, true);
        Set = getCollection(Set, SET, {add: function(value) {
            return def(this, value = value === 0 ? 0 : value, value);
          }}, collectionMethods);
        function defWeak(that, key, value) {
          if (isFrozen(assertObject(key)))
            leakStore(that).set(key, value);
          else {
            has(key, WEAK) || hidden(key, WEAK, {});
            key[WEAK][that[UID]] = value;
          }
          return that;
        }
        function leakStore(that) {
          return that[LEAK] || hidden(that, LEAK, new Map)[LEAK];
        }
        var weakMethods = {
          'delete': function(key) {
            if (!isObject(key))
              return false;
            if (isFrozen(key))
              return leakStore(this)['delete'](key);
            return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
          },
          has: function(key) {
            if (!isObject(key))
              return false;
            if (isFrozen(key))
              return leakStore(this).has(key);
            return has(key, WEAK) && has(key[WEAK], this[UID]);
          }
        };
        WeakMap = getCollection(WeakMap, WEAKMAP, {
          get: function(key) {
            if (isObject(key)) {
              if (isFrozen(key))
                return leakStore(this).get(key);
              if (has(key, WEAK))
                return key[WEAK][this[UID]];
            }
          },
          set: function(key, value) {
            return defWeak(this, key, value);
          }
        }, weakMethods, true, true);
        if (framework && DESC && new WeakMap([[Object.freeze(tmp), 7]]).get(tmp) != 7) {
          forEach.call(array('delete,has,get,set'), function(key) {
            var method = WeakMap[PROTOTYPE][key];
            WeakMap[PROTOTYPE][key] = function(a, b) {
              if (isObject(a) && isFrozen(a)) {
                var result = leakStore(this)[key](a, b);
                return key == 'set' ? this : result;
              }
              return method.call(this, a, b);
            };
          });
        }
        WeakSet = getCollection(WeakSet, WEAKSET, {add: function(value) {
            return defWeak(this, value, true);
          }}, weakMethods, false, true);
      }();
      !function() {
        function Enumerate(iterated) {
          var keys = [],
              key;
          for (key in iterated)
            keys.push(key);
          set(this, ITER, {
            o: iterated,
            a: keys,
            i: 0
          });
        }
        createIterator(Enumerate, OBJECT, function() {
          var iter = this[ITER],
              keys = iter.a,
              key;
          do {
            if (iter.i >= keys.length)
              return iterResult(1);
          } while (!((key = keys[iter.i++]) in iter.o));
          return iterResult(0, key);
        });
        function wrap(fn) {
          return function(it) {
            assertObject(it);
            try {
              return fn.apply(undefined, arguments), true;
            } catch (e) {
              return false;
            }
          };
        }
        function reflectGet(target, propertyKey) {
          var receiver = arguments.length < 3 ? target : arguments[2],
              desc = getOwnDescriptor(assertObject(target), propertyKey),
              proto;
          if (desc)
            return desc.get ? desc.get.call(receiver) : desc.value;
          return isObject(proto = getPrototypeOf(target)) ? reflectGet(proto, propertyKey, receiver) : undefined;
        }
        function reflectSet(target, propertyKey, V) {
          var receiver = arguments.length < 4 ? target : arguments[3],
              desc = getOwnDescriptor(assertObject(target), propertyKey),
              proto;
          if (desc) {
            if (desc.writable === false)
              return false;
            if (desc.set)
              return desc.set.call(receiver, V), true;
          }
          if (isObject(proto = getPrototypeOf(target)))
            return reflectSet(proto, propertyKey, V, receiver);
          desc = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
          desc.value = V;
          return defineProperty(receiver, propertyKey, desc), true;
        }
        var isExtensible = Object.isExtensible || returnIt;
        var reflect = {
          apply: ctx(call, apply, 3),
          construct: construct,
          defineProperty: wrap(defineProperty),
          deleteProperty: function(target, propertyKey) {
            var desc = getOwnDescriptor(assertObject(target), propertyKey);
            return desc && !desc.configurable ? false : delete target[propertyKey];
          },
          enumerate: function(target) {
            return new Enumerate(assertObject(target));
          },
          get: reflectGet,
          getOwnPropertyDescriptor: function(target, propertyKey) {
            return getOwnDescriptor(assertObject(target), propertyKey);
          },
          getPrototypeOf: function(target) {
            return getPrototypeOf(assertObject(target));
          },
          has: function(target, propertyKey) {
            return propertyKey in target;
          },
          isExtensible: function(target) {
            return !!isExtensible(assertObject(target));
          },
          ownKeys: ownKeys,
          preventExtensions: wrap(Object.preventExtensions || returnIt),
          set: reflectSet
        };
        if (setPrototypeOf)
          reflect.setPrototypeOf = function(target, proto) {
            return setPrototypeOf(assertObject(target), proto), true;
          };
        $define(GLOBAL, {Reflect: {}});
        $define(STATIC, 'Reflect', reflect);
      }();
      !function() {
        $define(PROTO, ARRAY, {includes: createArrayContains(true)});
        $define(PROTO, STRING, {at: createPointAt(true)});
        function createObjectToArray(isEntries) {
          return function(object) {
            var O = toObject(object),
                keys = getKeys(object),
                length = keys.length,
                i = 0,
                result = Array(length),
                key;
            if (isEntries)
              while (length > i)
                result[i] = [key = keys[i++], O[key]];
            else
              while (length > i)
                result[i] = O[keys[i++]];
            return result;
          };
        }
        $define(STATIC, OBJECT, {
          values: createObjectToArray(false),
          entries: createObjectToArray(true)
        });
        $define(STATIC, REGEXP, {escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)});
      }();
      !function(REFERENCE) {
        REFERENCE_GET = getWellKnownSymbol(REFERENCE + 'Get', true);
        var REFERENCE_SET = getWellKnownSymbol(REFERENCE + SET, true),
            REFERENCE_DELETE = getWellKnownSymbol(REFERENCE + 'Delete', true);
        $define(STATIC, SYMBOL, {
          referenceGet: REFERENCE_GET,
          referenceSet: REFERENCE_SET,
          referenceDelete: REFERENCE_DELETE
        });
        hidden(FunctionProto, REFERENCE_GET, returnThis);
        function setMapMethods(Constructor) {
          if (Constructor) {
            var MapProto = Constructor[PROTOTYPE];
            hidden(MapProto, REFERENCE_GET, MapProto.get);
            hidden(MapProto, REFERENCE_SET, MapProto.set);
            hidden(MapProto, REFERENCE_DELETE, MapProto['delete']);
          }
        }
        setMapMethods(Map);
        setMapMethods(WeakMap);
      }('reference');
      !function(NodeList) {
        if (framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])) {
          hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
        }
        Iterators.NodeList = Iterators[ARRAY];
      }(global.NodeList);
      !function(DICT) {
        Dict = function(iterable) {
          var dict = create(null);
          if (iterable != undefined) {
            if (isIterable(iterable)) {
              for (var iter = getIterator(iterable),
                  step,
                  value; !(step = iter.next()).done; ) {
                value = step.value;
                dict[value[0]] = value[1];
              }
            } else
              assign(dict, iterable);
          }
          return dict;
        };
        Dict[PROTOTYPE] = null;
        function DictIterator(iterated, kind) {
          set(this, ITER, {
            o: toObject(iterated),
            a: getKeys(iterated),
            i: 0,
            k: kind
          });
        }
        createIterator(DictIterator, DICT, function() {
          var iter = this[ITER],
              O = iter.o,
              keys = iter.a,
              kind = iter.k,
              key;
          do {
            if (iter.i >= keys.length)
              return iterResult(1);
          } while (!has(O, key = keys[iter.i++]));
          if (kind == KEY)
            return iterResult(0, key);
          if (kind == VALUE)
            return iterResult(0, O[key]);
          return iterResult(0, [key, O[key]]);
        });
        function createDictIter(kind) {
          return function(it) {
            return new DictIterator(it, kind);
          };
        }
        function createDictMethod(type) {
          var isMap = type == 1,
              isEvery = type == 4;
          return function(object, callbackfn, that) {
            var f = ctx(callbackfn, that, 3),
                O = toObject(object),
                result = isMap || type == 7 || type == 2 ? new (generic(this, Dict)) : undefined,
                key,
                val,
                res;
            for (key in O)
              if (has(O, key)) {
                val = O[key];
                res = f(val, key, object);
                if (type) {
                  if (isMap)
                    result[key] = res;
                  else if (res)
                    switch (type) {
                      case 2:
                        result[key] = val;
                        break;
                      case 3:
                        return true;
                      case 5:
                        return val;
                      case 6:
                        return key;
                      case 7:
                        result[res[0]] = res[1];
                    }
                  else if (isEvery)
                    return false;
                }
              }
            return type == 3 || isEvery ? isEvery : result;
          };
        }
        function createDictReduce(isTurn) {
          return function(object, mapfn, init) {
            assertFunction(mapfn);
            var O = toObject(object),
                keys = getKeys(O),
                length = keys.length,
                i = 0,
                memo,
                key,
                result;
            if (isTurn)
              memo = init == undefined ? new (generic(this, Dict)) : Object(init);
            else if (arguments.length < 3) {
              assert(length, REDUCE_ERROR);
              memo = O[keys[i++]];
            } else
              memo = Object(init);
            while (length > i)
              if (has(O, key = keys[i++])) {
                result = mapfn(memo, O[key], key, object);
                if (isTurn) {
                  if (result === false)
                    break;
                } else
                  memo = result;
              }
            return memo;
          };
        }
        var findKey = createDictMethod(6);
        function includes(object, el) {
          return (el == el ? keyOf(object, el) : findKey(object, sameNaN)) !== undefined;
        }
        var dictMethods = {
          keys: createDictIter(KEY),
          values: createDictIter(VALUE),
          entries: createDictIter(KEY + VALUE),
          forEach: createDictMethod(0),
          map: createDictMethod(1),
          filter: createDictMethod(2),
          some: createDictMethod(3),
          every: createDictMethod(4),
          find: createDictMethod(5),
          findKey: findKey,
          mapPairs: createDictMethod(7),
          reduce: createDictReduce(false),
          turn: createDictReduce(true),
          keyOf: keyOf,
          includes: includes,
          has: has,
          get: get,
          set: createDefiner(0),
          isDict: function(it) {
            return isObject(it) && getPrototypeOf(it) === Dict[PROTOTYPE];
          }
        };
        if (REFERENCE_GET)
          for (var key in dictMethods)
            !function(fn) {
              function method() {
                for (var args = [this],
                    i = 0; i < arguments.length; )
                  args.push(arguments[i++]);
                return invoke(fn, args);
              }
              fn[REFERENCE_GET] = function() {
                return method;
              };
            }(dictMethods[key]);
        $define(GLOBAL + FORCED, {Dict: assignHidden(Dict, dictMethods)});
      }('Dict');
      !function(ENTRIES, FN) {
        function $for(iterable, entries) {
          if (!(this instanceof $for))
            return new $for(iterable, entries);
          this[ITER] = getIterator(iterable);
          this[ENTRIES] = !!entries;
        }
        createIterator($for, 'Wrapper', function() {
          return this[ITER].next();
        });
        var $forProto = $for[PROTOTYPE];
        setIterator($forProto, function() {
          return this[ITER];
        });
        function createChainIterator(next) {
          function Iter(I, fn, that) {
            this[ITER] = getIterator(I);
            this[ENTRIES] = I[ENTRIES];
            this[FN] = ctx(fn, that, I[ENTRIES] ? 2 : 1);
          }
          createIterator(Iter, 'Chain', next, $forProto);
          setIterator(Iter[PROTOTYPE], returnThis);
          return Iter;
        }
        var MapIter = createChainIterator(function() {
          var step = this[ITER].next();
          return step.done ? step : iterResult(0, stepCall(this[FN], step.value, this[ENTRIES]));
        });
        var FilterIter = createChainIterator(function() {
          for (; ; ) {
            var step = this[ITER].next();
            if (step.done || stepCall(this[FN], step.value, this[ENTRIES]))
              return step;
          }
        });
        assignHidden($forProto, {
          of: function(fn, that) {
            forOf(this, this[ENTRIES], fn, that);
          },
          array: function(fn, that) {
            var result = [];
            forOf(fn != undefined ? this.map(fn, that) : this, false, push, result);
            return result;
          },
          filter: function(fn, that) {
            return new FilterIter(this, fn, that);
          },
          map: function(fn, that) {
            return new MapIter(this, fn, that);
          }
        });
        $for.isIterable = isIterable;
        $for.getIterator = getIterator;
        $define(GLOBAL + FORCED, {$for: $for});
      }('entries', safeSymbol('fn'));
      !function(_, toLocaleString) {
        core._ = path._ = path._ || {};
        $define(PROTO + FORCED, FUNCTION, {
          part: part,
          only: function(numberArguments, that) {
            var fn = assertFunction(this),
                n = toLength(numberArguments),
                isThat = arguments.length > 1;
            return function() {
              var length = min(n, arguments.length),
                  args = Array(length),
                  i = 0;
              while (length > i)
                args[i] = arguments[i++];
              return invoke(fn, args, isThat ? that : this);
            };
          }
        });
        function tie(key) {
          var that = this,
              bound = {};
          return hidden(that, _, function(key) {
            if (key === undefined || !(key in that))
              return toLocaleString.call(that);
            return has(bound, key) ? bound[key] : (bound[key] = ctx(that[key], that, -1));
          })[_](key);
        }
        hidden(path._, TO_STRING, function() {
          return _;
        });
        hidden(ObjectProto, _, tie);
        DESC || hidden(ArrayProto, _, tie);
      }(DESC ? uid('tie') : TO_LOCALE, ObjectProto[TO_LOCALE]);
      !function() {
        function define(target, mixin) {
          var keys = ownKeys(toObject(mixin)),
              length = keys.length,
              i = 0,
              key;
          while (length > i)
            defineProperty(target, key = keys[i++], getOwnDescriptor(mixin, key));
          return target;
        }
        ;
        $define(STATIC + FORCED, OBJECT, {
          isObject: isObject,
          classof: classof,
          define: define,
          make: function(proto, mixin) {
            return define(create(proto), mixin);
          }
        });
      }();
      $define(PROTO + FORCED, ARRAY, {turn: function(fn, target) {
          assertFunction(fn);
          var memo = target == undefined ? [] : Object(target),
              O = ES5Object(this),
              length = toLength(O.length),
              index = 0;
          while (length > index)
            if (fn(memo, O[index], index++, this) === false)
              break;
          return memo;
        }});
      if (framework)
        ArrayUnscopables.turn = true;
      !function(arrayStatics) {
        function setArrayStatics(keys, length) {
          forEach.call(array(keys), function(key) {
            if (key in ArrayProto)
              arrayStatics[key] = ctx(call, ArrayProto[key], length);
          });
        }
        setArrayStatics('pop,reverse,shift,keys,values,entries', 1);
        setArrayStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
        setArrayStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' + 'reduce,reduceRight,copyWithin,fill,turn');
        $define(STATIC, ARRAY, arrayStatics);
      }({});
      !function(numberMethods) {
        function NumberIterator(iterated) {
          set(this, ITER, {
            l: toLength(iterated),
            i: 0
          });
        }
        createIterator(NumberIterator, NUMBER, function() {
          var iter = this[ITER],
              i = iter.i++;
          return i < iter.l ? iterResult(0, i) : iterResult(1);
        });
        defineIterator(Number, NUMBER, function() {
          return new NumberIterator(this);
        });
        numberMethods.random = function(lim) {
          var a = +this,
              b = lim == undefined ? 0 : +lim,
              m = min(a, b);
          return random() * (max(a, b) - m) + m;
        };
        forEach.call(array('round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' + 'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'), function(key) {
          var fn = Math[key];
          if (fn)
            numberMethods[key] = function() {
              var args = [+this],
                  i = 0;
              while (arguments.length > i)
                args.push(arguments[i++]);
              return invoke(fn, args);
            };
        });
        $define(PROTO + FORCED, NUMBER, numberMethods);
      }({});
      !function() {
        var escapeHTMLDict = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&apos;'
        },
            unescapeHTMLDict = {},
            key;
        for (key in escapeHTMLDict)
          unescapeHTMLDict[escapeHTMLDict[key]] = key;
        $define(PROTO + FORCED, STRING, {
          escapeHTML: createReplacer(/[&<>"']/g, escapeHTMLDict),
          unescapeHTML: createReplacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
        });
      }();
      !function(formatRegExp, flexioRegExp, locales, current, SECONDS, MINUTES, HOURS, MONTH, YEAR) {
        function createFormat(prefix) {
          return function(template, locale) {
            var that = this,
                dict = locales[has(locales, locale) ? locale : current];
            function get(unit) {
              return that[prefix + unit]();
            }
            return String(template).replace(formatRegExp, function(part) {
              switch (part) {
                case 's':
                  return get(SECONDS);
                case 'ss':
                  return lz(get(SECONDS));
                case 'm':
                  return get(MINUTES);
                case 'mm':
                  return lz(get(MINUTES));
                case 'h':
                  return get(HOURS);
                case 'hh':
                  return lz(get(HOURS));
                case 'D':
                  return get(DATE);
                case 'DD':
                  return lz(get(DATE));
                case 'W':
                  return dict[0][get('Day')];
                case 'N':
                  return get(MONTH) + 1;
                case 'NN':
                  return lz(get(MONTH) + 1);
                case 'M':
                  return dict[2][get(MONTH)];
                case 'MM':
                  return dict[1][get(MONTH)];
                case 'Y':
                  return get(YEAR);
                case 'YY':
                  return lz(get(YEAR) % 100);
              }
              return part;
            });
          };
        }
        function lz(num) {
          return num > 9 ? num : '0' + num;
        }
        function addLocale(lang, locale) {
          function split(index) {
            var result = [];
            forEach.call(array(locale.months), function(it) {
              result.push(it.replace(flexioRegExp, '$' + index));
            });
            return result;
          }
          locales[lang] = [array(locale.weekdays), split(1), split(2)];
          return core;
        }
        $define(PROTO + FORCED, DATE, {
          format: createFormat('get'),
          formatUTC: createFormat('getUTC')
        });
        addLocale(current, {
          weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
          months: 'January,February,March,April,May,June,July,August,September,October,November,December'
        });
        addLocale('ru', {
          weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
          months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' + 'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
        });
        core.locale = function(locale) {
          return has(locales, locale) ? current = locale : current;
        };
        core.addLocale = addLocale;
      }(/\b\w\w?\b/g, /:(.*)\|(.*)$/, {}, 'en', 'Seconds', 'Minutes', 'Hours', 'Month', 'FullYear');
    }(typeof self != 'undefined' && self.Math === Math ? self : Function('return this')(), true);
  })(require("process"));
  global.define = __define;
  return module.exports;
});

System.register("github:aurelia/loader-default@0.4.1", ["github:aurelia/loader-default@0.4.1/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/binding@0.3.4", ["github:aurelia/binding@0.3.4/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/templating@0.8.10/system/custom-element", ["aurelia-metadata", "./behavior-instance", "./behaviors", "./content-selector", "./view-engine", "./view-strategy", "./util"], function(_export) {
  "use strict";
  var Metadata,
      Origin,
      ResourceType,
      BehaviorInstance,
      configureBehavior,
      ContentSelector,
      ViewEngine,
      ViewStrategy,
      hyphenate,
      _prototypeProperties,
      _inherits,
      defaultInstruction,
      contentSelectorFactoryOptions,
      hasShadowDOM,
      valuePropertyName,
      UseShadowDOM,
      SkipContentProcessing,
      CustomElement;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
      Origin = _aureliaMetadata.Origin;
      ResourceType = _aureliaMetadata.ResourceType;
    }, function(_behaviorInstance) {
      BehaviorInstance = _behaviorInstance.BehaviorInstance;
    }, function(_behaviors) {
      configureBehavior = _behaviors.configureBehavior;
    }, function(_contentSelector) {
      ContentSelector = _contentSelector.ContentSelector;
    }, function(_viewEngine) {
      ViewEngine = _viewEngine.ViewEngine;
    }, function(_viewStrategy) {
      ViewStrategy = _viewStrategy.ViewStrategy;
    }, function(_util) {
      hyphenate = _util.hyphenate;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      defaultInstruction = {suppressBind: false};
      contentSelectorFactoryOptions = {suppressBind: true};
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;
      valuePropertyName = "value";
      UseShadowDOM = _export("UseShadowDOM", function UseShadowDOM() {});
      SkipContentProcessing = _export("SkipContentProcessing", function SkipContentProcessing() {});
      CustomElement = _export("CustomElement", (function(ResourceType) {
        function CustomElement(tagName) {
          this.name = tagName;
          this.properties = [];
          this.attributes = {};
        }
        _inherits(CustomElement, ResourceType);
        _prototypeProperties(CustomElement, {convention: {
            value: function convention(name) {
              if (name.endsWith("CustomElement")) {
                return new CustomElement(hyphenate(name.substring(0, name.length - 13)));
              }
            },
            writable: true,
            configurable: true
          }}, {
          analyze: {
            value: function analyze(container, target) {
              var meta = Metadata.on(target);
              configureBehavior(container, this, target, valuePropertyName);
              this.configured = true;
              this.targetShadowDOM = meta.has(UseShadowDOM);
              this.skipContentProcessing = meta.has(SkipContentProcessing);
              this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
            },
            writable: true,
            configurable: true
          },
          load: {
            value: function load(container, target, viewStrategy) {
              var _this = this;
              var options;
              viewStrategy = viewStrategy || ViewStrategy.getDefault(target);
              options = {
                targetShadowDOM: this.targetShadowDOM,
                beforeCompile: target.beforeCompile
              };
              if (!viewStrategy.moduleId) {
                viewStrategy.moduleId = Origin.get(target).moduleId;
              }
              return viewStrategy.loadViewFactory(container.get(ViewEngine), options).then(function(viewFactory) {
                _this.viewFactory = viewFactory;
                return _this;
              });
            },
            writable: true,
            configurable: true
          },
          register: {
            value: function register(registry, name) {
              registry.registerElement(name || this.name, this);
            },
            writable: true,
            configurable: true
          },
          compile: {
            value: function compile(compiler, resources, node, instruction) {
              if (!this.usesShadowDOM && !this.skipContentProcessing && node.hasChildNodes()) {
                var fragment = document.createDocumentFragment(),
                    currentChild = node.firstChild,
                    nextSibling;
                while (currentChild) {
                  nextSibling = currentChild.nextSibling;
                  fragment.appendChild(currentChild);
                  currentChild = nextSibling;
                }
                instruction.contentFactory = compiler.compile(fragment, resources);
              }
              instruction.suppressBind = true;
              return node;
            },
            writable: true,
            configurable: true
          },
          create: {
            value: function create(container) {
              var instruction = arguments[1] === undefined ? defaultInstruction : arguments[1];
              var element = arguments[2] === undefined ? null : arguments[2];
              var executionContext = instruction.executionContext || container.get(this.target),
                  behaviorInstance = new BehaviorInstance(this, executionContext, instruction),
                  host;
              if (this.viewFactory) {
                behaviorInstance.view = this.viewFactory.create(container, behaviorInstance.executionContext, instruction);
              }
              if (element) {
                element.primaryBehavior = behaviorInstance;
                if (!(this.apiName in element)) {
                  element[this.apiName] = behaviorInstance.executionContext;
                }
                if (behaviorInstance.view) {
                  if (this.usesShadowDOM) {
                    host = element.createShadowRoot();
                  } else {
                    host = element;
                    if (instruction.contentFactory) {
                      var contentView = instruction.contentFactory.create(container, null, contentSelectorFactoryOptions);
                      ContentSelector.applySelectors(contentView, behaviorInstance.view.contentSelectors, function(contentSelector, group) {
                        return contentSelector.add(group);
                      });
                      behaviorInstance.contentView = contentView;
                    }
                  }
                  if (this.childExpression) {
                    behaviorInstance.view.addBinding(this.childExpression.createBinding(host, behaviorInstance.executionContext));
                  }
                  behaviorInstance.view.appendNodesTo(host);
                }
              } else if (behaviorInstance.view) {
                behaviorInstance.view.owner = behaviorInstance;
              }
              return behaviorInstance;
            },
            writable: true,
            configurable: true
          }
        });
        return CustomElement;
      })(ResourceType));
    }
  };
});

System.register("github:aurelia/router@0.5.5/system/index", ["./router", "./app-router", "./pipeline-provider", "./navigation-commands", "./route-loading", "./router-configuration", "./navigation-plan"], function(_export) {
  "use strict";
  return {
    setters: [function(_router) {
      _export("Router", _router.Router);
    }, function(_appRouter) {
      _export("AppRouter", _appRouter.AppRouter);
    }, function(_pipelineProvider) {
      _export("PipelineProvider", _pipelineProvider.PipelineProvider);
    }, function(_navigationCommands) {
      _export("Redirect", _navigationCommands.Redirect);
    }, function(_routeLoading) {
      _export("RouteLoader", _routeLoading.RouteLoader);
    }, function(_routerConfiguration) {
      _export("RouterConfiguration", _routerConfiguration.RouterConfiguration);
    }, function(_navigationPlan) {
      _export("NO_CHANGE", _navigationPlan.NO_CHANGE);
      _export("INVOKE_LIFECYCLE", _navigationPlan.INVOKE_LIFECYCLE);
      _export("REPLACE", _navigationPlan.REPLACE);
    }],
    execute: function() {}
  };
});

System.register("npm:core-js@0.4.10", ["npm:core-js@0.4.10/index"], true, function(require, exports, module) {
  var global = System.global,
      __define = global.define;
  global.define = undefined;
  module.exports = require("npm:core-js@0.4.10/index");
  global.define = __define;
  return module.exports;
});

System.register("github:aurelia/templating@0.8.10/system/property", ["./util", "aurelia-binding"], function(_export) {
  "use strict";
  var hyphenate,
      ONE_WAY,
      TWO_WAY,
      ONE_TIME,
      _inherits,
      _prototypeProperties,
      BehaviorProperty,
      OptionsProperty,
      BehaviorPropertyObserver;
  return {
    setters: [function(_util) {
      hyphenate = _util.hyphenate;
    }, function(_aureliaBinding) {
      ONE_WAY = _aureliaBinding.ONE_WAY;
      TWO_WAY = _aureliaBinding.TWO_WAY;
      ONE_TIME = _aureliaBinding.ONE_TIME;
    }],
    execute: function() {
      _inherits = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          subClass.__proto__ = superClass;
      };
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      BehaviorProperty = _export("BehaviorProperty", (function() {
        function BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
          this.name = name;
          this.changeHandler = changeHandler;
          this.attribute = attribute || hyphenate(name);
          this.defaultValue = defaultValue;
          this.defaultBindingMode = defaultBindingMode || ONE_WAY;
        }
        _prototypeProperties(BehaviorProperty, null, {
          bindingIsTwoWay: {
            value: function bindingIsTwoWay() {
              this.defaultBindingMode = TWO_WAY;
              return this;
            },
            writable: true,
            configurable: true
          },
          bindingIsOneWay: {
            value: function bindingIsOneWay() {
              this.defaultBindingMode = ONE_WAY;
              return this;
            },
            writable: true,
            configurable: true
          },
          bindingIsOneTime: {
            value: function bindingIsOneTime() {
              this.defaultBindingMode = ONE_TIME;
              return this;
            },
            writable: true,
            configurable: true
          },
          define: {
            value: function define(taskQueue, behavior) {
              var that = this,
                  handlerName;
              this.taskQueue = taskQueue;
              if (!this.changeHandler) {
                handlerName = this.name + "Changed";
                if (handlerName in behavior.target.prototype) {
                  this.changeHandler = handlerName;
                }
              }
              behavior.properties.push(this);
              behavior.attributes[this.attribute] = this;
              Object.defineProperty(behavior.target.prototype, this.name, {
                configurable: true,
                enumerable: true,
                get: function() {
                  return this.__observers__[that.name].getValue();
                },
                set: function(value) {
                  this.__observers__[that.name].setValue(value);
                }
              });
            },
            writable: true,
            configurable: true
          },
          createObserver: {
            value: function createObserver(executionContext) {
              var _this = this;
              var selfSubscriber = null;
              if (this.changeHandler) {
                selfSubscriber = function(newValue, oldValue) {
                  return executionContext[_this.changeHandler](newValue, oldValue);
                };
              }
              return new BehaviorPropertyObserver(this.taskQueue, executionContext, this.name, selfSubscriber);
            },
            writable: true,
            configurable: true
          },
          initialize: {
            value: function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
              var selfSubscriber,
                  observer,
                  attribute;
              observer = observerLookup[this.name];
              if (attributes !== undefined) {
                selfSubscriber = observer.selfSubscriber;
                attribute = attributes[this.attribute];
                if (behaviorHandlesBind) {
                  observer.selfSubscriber = null;
                }
                if (typeof attribute === "string") {
                  executionContext[this.name] = attribute;
                  observer.call();
                } else if (attribute) {
                  boundProperties.push({
                    observer: observer,
                    binding: attribute.createBinding(executionContext)
                  });
                } else if (this.defaultValue) {
                  executionContext[this.name] = this.defaultValue;
                  observer.call();
                }
                observer.selfSubscriber = selfSubscriber;
              }
              observer.publishing = true;
            },
            writable: true,
            configurable: true
          }
        });
        return BehaviorProperty;
      })());
      OptionsProperty = _export("OptionsProperty", (function(BehaviorProperty) {
        function OptionsProperty(attribute) {
          for (var _len = arguments.length,
              rest = Array(_len > 1 ? _len - 1 : 0),
              _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
          }
          if (typeof attribute === "string") {
            this.attribute = attribute;
          } else if (attribute) {
            rest.unshift(attribute);
          }
          this.properties = rest;
          this.hasOptions = true;
        }
        _inherits(OptionsProperty, BehaviorProperty);
        _prototypeProperties(OptionsProperty, null, {
          dynamic: {
            value: function dynamic() {
              this.isDynamic = true;
              return this;
            },
            writable: true,
            configurable: true
          },
          withProperty: {
            value: function withProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
              this.properties.push(new BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode));
              return this;
            },
            writable: true,
            configurable: true
          },
          define: {
            value: function define(taskQueue, behavior) {
              var i,
                  ii,
                  properties = this.properties;
              this.attribute = this.attribute || behavior.name;
              behavior.properties.push(this);
              behavior.attributes[this.attribute] = this;
              for (i = 0, ii = properties.length; i < ii; ++i) {
                properties[i].define(taskQueue, behavior);
              }
            },
            writable: true,
            configurable: true
          },
          createObserver: {
            value: function createObserver(executionContext) {},
            writable: true,
            configurable: true
          },
          initialize: {
            value: function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
              var value,
                  key,
                  info;
              if (!this.isDynamic) {
                return ;
              }
              for (key in attributes) {
                this.createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
              }
            },
            writable: true,
            configurable: true
          },
          createDynamicProperty: {
            value: function createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
              var changeHandlerName = name + "Changed",
                  selfSubscriber = null,
                  observer,
                  info;
              if (changeHandlerName in executionContext) {
                selfSubscriber = function(newValue, oldValue) {
                  return executionContext[changeHandlerName](newValue, oldValue);
                };
              }
              observer = observerLookup[name] = new BehaviorPropertyObserver(this.taskQueue, executionContext, name, selfSubscriber);
              Object.defineProperty(executionContext, name, {
                configurable: true,
                enumerable: true,
                get: observer.getValue.bind(observer),
                set: observer.setValue.bind(observer)
              });
              if (behaviorHandlesBind) {
                observer.selfSubscriber = null;
              }
              if (typeof attribute === "string") {
                executionContext[name] = attribute;
                observer.call();
              } else if (attribute) {
                info = {
                  observer: observer,
                  binding: attribute.createBinding(executionContext)
                };
                boundProperties.push(info);
              }
              observer.publishing = true;
              observer.selfSubscriber = selfSubscriber;
            },
            writable: true,
            configurable: true
          }
        });
        return OptionsProperty;
      })(BehaviorProperty));
      BehaviorPropertyObserver = (function() {
        function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber) {
          this.taskQueue = taskQueue;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.notqueued = true;
          this.publishing = false;
          this.selfSubscriber = selfSubscriber;
        }
        _prototypeProperties(BehaviorPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.currentValue;
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              var oldValue = this.currentValue;
              if (oldValue != newValue) {
                if (this.publishing && this.notqueued) {
                  this.notqueued = false;
                  this.taskQueue.queueMicroTask(this);
                }
                this.oldValue = oldValue;
                this.currentValue = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          call: {
            value: function call() {
              var callbacks = this.callbacks,
                  i = callbacks.length,
                  oldValue = this.oldValue,
                  newValue = this.currentValue;
              this.notqueued = true;
              if (newValue != oldValue) {
                if (this.selfSubscriber !== null) {
                  this.selfSubscriber(newValue, oldValue);
                }
                while (i--) {
                  callbacks[i](newValue, oldValue);
                }
                this.oldValue = newValue;
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var callbacks = this.callbacks;
              callbacks.push(callback);
              return function() {
                callbacks.splice(callbacks.indexOf(callback), 1);
              };
            },
            writable: true,
            configurable: true
          }
        });
        return BehaviorPropertyObserver;
      })();
    }
  };
});

System.register("github:aurelia/router@0.5.5", ["github:aurelia/router@0.5.5/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/templating@0.8.10/system/index", ["aurelia-metadata", "./property", "./attached-behavior", "./children", "./custom-element", "./element-config", "./template-controller", "./view-strategy", "./resource-coordinator", "./resource-registry", "./view-compiler", "./view-engine", "./view-factory", "./view-slot", "./binding-language", "./composition-engine"], function(_export) {
  "use strict";
  var Metadata,
      BehaviorProperty,
      OptionsProperty,
      AttachedBehavior,
      ChildObserver,
      CustomElement,
      UseShadowDOM,
      SkipContentProcessing,
      ElementConfig,
      TemplateController,
      UseView,
      NoView,
      Behavior;
  return {
    setters: [function(_aureliaMetadata) {
      Metadata = _aureliaMetadata.Metadata;
    }, function(_property) {
      BehaviorProperty = _property.BehaviorProperty;
      OptionsProperty = _property.OptionsProperty;
      _export("BehaviorProperty", _property.BehaviorProperty);
      _export("OptionsProperty", _property.OptionsProperty);
    }, function(_attachedBehavior) {
      AttachedBehavior = _attachedBehavior.AttachedBehavior;
      _export("AttachedBehavior", _attachedBehavior.AttachedBehavior);
    }, function(_children) {
      ChildObserver = _children.ChildObserver;
      _export("ChildObserver", _children.ChildObserver);
    }, function(_customElement) {
      CustomElement = _customElement.CustomElement;
      UseShadowDOM = _customElement.UseShadowDOM;
      SkipContentProcessing = _customElement.SkipContentProcessing;
      _export("CustomElement", _customElement.CustomElement);
      _export("UseShadowDOM", _customElement.UseShadowDOM);
      _export("SkipContentProcessing", _customElement.SkipContentProcessing);
    }, function(_elementConfig) {
      ElementConfig = _elementConfig.ElementConfig;
      _export("ElementConfig", _elementConfig.ElementConfig);
    }, function(_templateController) {
      TemplateController = _templateController.TemplateController;
      _export("TemplateController", _templateController.TemplateController);
    }, function(_viewStrategy) {
      UseView = _viewStrategy.UseView;
      NoView = _viewStrategy.NoView;
      _export("ViewStrategy", _viewStrategy.ViewStrategy);
      _export("UseView", _viewStrategy.UseView);
      _export("ConventionalView", _viewStrategy.ConventionalView);
      _export("NoView", _viewStrategy.NoView);
    }, function(_resourceCoordinator) {
      _export("ResourceCoordinator", _resourceCoordinator.ResourceCoordinator);
    }, function(_resourceRegistry) {
      _export("ResourceRegistry", _resourceRegistry.ResourceRegistry);
      _export("ViewResources", _resourceRegistry.ViewResources);
    }, function(_viewCompiler) {
      _export("ViewCompiler", _viewCompiler.ViewCompiler);
    }, function(_viewEngine) {
      _export("ViewEngine", _viewEngine.ViewEngine);
    }, function(_viewFactory) {
      _export("ViewFactory", _viewFactory.ViewFactory);
      _export("BoundViewFactory", _viewFactory.BoundViewFactory);
    }, function(_viewSlot) {
      _export("ViewSlot", _viewSlot.ViewSlot);
    }, function(_bindingLanguage) {
      _export("BindingLanguage", _bindingLanguage.BindingLanguage);
    }, function(_compositionEngine) {
      _export("CompositionEngine", _compositionEngine.CompositionEngine);
    }],
    execute: function() {
      Behavior = _export("Behavior", Metadata);
      Metadata.configure.classHelper("withProperty", BehaviorProperty);
      Metadata.configure.classHelper("withOptions", OptionsProperty);
      Metadata.configure.classHelper("attachedBehavior", AttachedBehavior);
      Metadata.configure.classHelper("syncChildren", ChildObserver);
      Metadata.configure.classHelper("customElement", CustomElement);
      Metadata.configure.classHelper("useShadowDOM", UseShadowDOM);
      Metadata.configure.classHelper("elementConfig", ElementConfig);
      Metadata.configure.classHelper("templateController", TemplateController);
      Metadata.configure.classHelper("useView", UseView);
      Metadata.configure.classHelper("noView", NoView);
      Metadata.configure.classHelper("skipContentProcessing", SkipContentProcessing);
    }
  };
});

System.register("github:aurelia/templating-router@0.9.2/system/index", ["aurelia-router", "./route-loader", "./router-view"], function(_export) {
  "use strict";
  var Router,
      AppRouter,
      RouteLoader,
      TemplatingRouteLoader,
      RouterView;
  function install(aurelia) {
    aurelia.withSingleton(RouteLoader, TemplatingRouteLoader).withSingleton(Router, AppRouter).withResources(RouterView);
  }
  return {
    setters: [function(_aureliaRouter) {
      Router = _aureliaRouter.Router;
      AppRouter = _aureliaRouter.AppRouter;
      RouteLoader = _aureliaRouter.RouteLoader;
    }, function(_routeLoader) {
      TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
    }, function(_routerView) {
      RouterView = _routerView.RouterView;
    }],
    execute: function() {
      _export("TemplatingRouteLoader", TemplatingRouteLoader);
      _export("RouterView", RouterView);
      _export("install", install);
    }
  };
});

System.register("github:aurelia/templating@0.8.10", ["github:aurelia/templating@0.8.10/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/templating-router@0.9.2", ["github:aurelia/templating-router@0.9.2/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/framework@0.8.6/system/aurelia", ["aurelia-logging", "aurelia-dependency-injection", "aurelia-loader", "aurelia-templating", "./plugins"], function(_export) {
  "use strict";
  var LogManager,
      Container,
      Loader,
      BindingLanguage,
      ResourceCoordinator,
      ViewSlot,
      ResourceRegistry,
      CompositionEngine,
      Plugins,
      _prototypeProperties,
      logger,
      slice,
      CustomEvent,
      Aurelia;
  function loadResources(container, resourcesToLoad, appResources) {
    var resourceCoordinator = container.get(ResourceCoordinator),
        current;
    function next() {
      if (current = resourcesToLoad.shift()) {
        return resourceCoordinator.importResources(current, current.resourceManifestUrl).then(function(resources) {
          resources.forEach(function(x) {
            return x.register(appResources);
          });
          return next();
        });
      }
      return Promise.resolve();
    }
    return next();
  }
  return {
    setters: [function(_aureliaLogging) {
      LogManager = _aureliaLogging;
    }, function(_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function(_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function(_aureliaTemplating) {
      BindingLanguage = _aureliaTemplating.BindingLanguage;
      ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
      ViewSlot = _aureliaTemplating.ViewSlot;
      ResourceRegistry = _aureliaTemplating.ResourceRegistry;
      CompositionEngine = _aureliaTemplating.CompositionEngine;
    }, function(_plugins) {
      Plugins = _plugins.Plugins;
    }],
    execute: function() {
      _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps)
          Object.defineProperties(child, staticProps);
        if (instanceProps)
          Object.defineProperties(child.prototype, instanceProps);
      };
      logger = LogManager.getLogger("aurelia");
      slice = Array.prototype.slice;
      if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
        CustomEvent = function(event, params) {
          var params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          var evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
      }
      Aurelia = _export("Aurelia", (function() {
        function Aurelia(loader, container, resources) {
          this.loader = loader || Loader.createDefaultLoader();
          this.container = container || new Container();
          this.resources = resources || new ResourceRegistry();
          this.resourcesToLoad = [];
          this.use = new Plugins(this);
          if (!this.resources.baseResourcePath) {
            this.resources.baseResourcePath = System.baseUrl || "";
          }
          this.withInstance(Aurelia, this);
          this.withInstance(Loader, this.loader);
          this.withInstance(ResourceRegistry, this.resources);
        }
        _prototypeProperties(Aurelia, null, {
          withInstance: {
            value: function withInstance(type, instance) {
              this.container.registerInstance(type, instance);
              return this;
            },
            writable: true,
            configurable: true
          },
          withSingleton: {
            value: function withSingleton(type, implementation) {
              this.container.registerSingleton(type, implementation);
              return this;
            },
            writable: true,
            configurable: true
          },
          withResources: {
            value: function withResources(resources) {
              var toAdd = Array.isArray(resources) ? resources : slice.call(arguments);
              toAdd.resourceManifestUrl = this.currentPluginId;
              this.resourcesToLoad.push(toAdd);
              return this;
            },
            writable: true,
            configurable: true
          },
          start: {
            value: function start() {
              var _this = this;
              if (this.started) {
                return Promise.resolve(this);
              }
              this.started = true;
              logger.info("Aurelia Starting");
              var resourcesToLoad = this.resourcesToLoad;
              this.resourcesToLoad = [];
              return this.use._process().then(function() {
                if (!_this.container.hasHandler(BindingLanguage)) {
                  logger.error("You must configure Aurelia with a BindingLanguage implementation.");
                }
                _this.resourcesToLoad = _this.resourcesToLoad.concat(resourcesToLoad);
                return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function() {
                  logger.info("Aurelia Started");
                  var evt = new window.CustomEvent("aurelia-started", {
                    bubbles: true,
                    cancelable: true
                  });
                  document.dispatchEvent(evt);
                  return _this;
                });
              });
            },
            writable: true,
            configurable: true
          },
          setRoot: {
            value: function setRoot(root, applicationHost) {
              var _this = this;
              var compositionEngine,
                  instruction = {};
              if (!applicationHost || typeof applicationHost == "string") {
                this.host = document.getElementById(applicationHost || "applicationHost") || document.body;
              } else {
                this.host = applicationHost;
              }
              this.host.aurelia = this;
              this.container.registerInstance(Element, this.host);
              compositionEngine = this.container.get(CompositionEngine);
              instruction.viewModel = root;
              instruction.container = instruction.childContainer = this.container;
              instruction.viewSlot = new ViewSlot(this.host, true);
              instruction.viewSlot.transformChildNodesIntoView();
              return compositionEngine.compose(instruction).then(function(root) {
                _this.root = root;
                instruction.viewSlot.attached();
                var evt = new window.CustomEvent("aurelia-composed", {
                  bubbles: true,
                  cancelable: true
                });
                setTimeout(function() {
                  return document.dispatchEvent(evt);
                }, 1);
                return _this;
              });
            },
            writable: true,
            configurable: true
          }
        });
        return Aurelia;
      })());
    }
  };
});

System.register("github:aurelia/framework@0.8.6/system/index", ["./aurelia", "aurelia-dependency-injection", "aurelia-binding", "aurelia-metadata", "aurelia-templating", "aurelia-loader", "aurelia-task-queue", "aurelia-logging"], function(_export) {
  "use strict";
  var TheLogManager,
      LogManager;
  return {
    setters: [function(_aurelia) {
      _export("Aurelia", _aurelia.Aurelia);
    }, function(_aureliaDependencyInjection) {
      for (var _key in _aureliaDependencyInjection) {
        _export(_key, _aureliaDependencyInjection[_key]);
      }
    }, function(_aureliaBinding) {
      for (var _key2 in _aureliaBinding) {
        _export(_key2, _aureliaBinding[_key2]);
      }
    }, function(_aureliaMetadata) {
      for (var _key3 in _aureliaMetadata) {
        _export(_key3, _aureliaMetadata[_key3]);
      }
    }, function(_aureliaTemplating) {
      for (var _key4 in _aureliaTemplating) {
        _export(_key4, _aureliaTemplating[_key4]);
      }
    }, function(_aureliaLoader) {
      for (var _key5 in _aureliaLoader) {
        _export(_key5, _aureliaLoader[_key5]);
      }
    }, function(_aureliaTaskQueue) {
      for (var _key6 in _aureliaTaskQueue) {
        _export(_key6, _aureliaTaskQueue[_key6]);
      }
    }, function(_aureliaLogging) {
      TheLogManager = _aureliaLogging;
    }],
    execute: function() {
      LogManager = _export("LogManager", TheLogManager);
    }
  };
});

System.register("github:aurelia/framework@0.8.6", ["github:aurelia/framework@0.8.6/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("github:aurelia/bootstrapper@0.9.3/system/index", ["aurelia-loader-default", "aurelia-framework", "aurelia-logging-console"], function(_export) {
  "use strict";
  var DefaultLoader,
      Aurelia,
      LogManager,
      ConsoleAppender,
      logger,
      readyQueue,
      isReady;
  _export("bootstrap", bootstrap);
  function onReady(callback) {
    return new Promise(function(resolve, reject) {
      if (!isReady) {
        readyQueue.push(function() {
          try {
            resolve(callback());
          } catch (e) {
            reject(e);
          }
        });
      } else {
        resolve(callback());
      }
    });
  }
  function bootstrap(configure) {
    return onReady(function() {
      var loader = new DefaultLoader(),
          aurelia = new Aurelia(loader);
      return configureAurelia(aurelia).then(function() {
        return configure(aurelia);
      });
    });
  }
  function ready(global) {
    return new Promise(function(resolve, reject) {
      var completed = function() {
        global.document.removeEventListener("DOMContentLoaded", completed, false);
        global.removeEventListener("load", completed, false);
        resolve(global.document);
      };
      if (global.document.readyState === "complete") {
        resolve(global.document);
      } else {
        global.document.addEventListener("DOMContentLoaded", completed, false);
        global.addEventListener("load", completed, false);
      }
    });
  }
  function loadPolyfills() {
    return System.normalize("aurelia-bootstrapper").then(function(bootstrapperName) {
      return System.normalize("aurelia-framework", bootstrapperName).then(function(frameworkName) {
        System.map["aurelia-framework"] = frameworkName;
        return System.normalize("aurelia-loader", frameworkName).then(function(loaderName) {
          var toLoad = [];
          if (!System.polyfilled) {
            logger.debug("loading core-js");
            toLoad.push(System.normalize("core-js", loaderName).then(function(name) {
              return System["import"](name);
            }));
          }
          toLoad.push(System.normalize("aurelia-depedency-injection", frameworkName).then(function(name) {
            System.map["aurelia-depedency-injection"] = name;
          }));
          toLoad.push(System.normalize("aurelia-router", bootstrapperName).then(function(name) {
            System.map["aurelia-router"] = name;
          }));
          toLoad.push(System.normalize("aurelia-logging-console", bootstrapperName).then(function(name) {
            System.map["aurelia-logging-console"] = name;
          }));
          if (!("import" in document.createElement("link"))) {
            logger.debug("loading the HTMLImports polyfill");
            toLoad.push(System.normalize("webcomponentsjs/HTMLImports.min", loaderName).then(function(name) {
              return System["import"](name);
            }));
          }
          if (!("content" in document.createElement("template"))) {
            logger.debug("loading the HTMLTemplateElement polyfill");
            toLoad.push(System.normalize("aurelia-html-template-element", loaderName).then(function(name) {
              return System["import"](name);
            }));
          }
          return Promise.all(toLoad);
        });
      });
    });
  }
  function configureAurelia(aurelia) {
    return System.normalize("aurelia-bootstrapper").then(function(bName) {
      var toLoad = [];
      toLoad.push(System.normalize("aurelia-templating-binding", bName).then(function(templatingBinding) {
        aurelia.use.defaultBindingLanguage = function() {
          aurelia.use.plugin(templatingBinding);
          return this;
        };
      }));
      toLoad.push(System.normalize("aurelia-history-browser", bName).then(function(historyBrowser) {
        return System.normalize("aurelia-templating-router", bName).then(function(templatingRouter) {
          aurelia.use.router = function() {
            aurelia.use.plugin(historyBrowser);
            aurelia.use.plugin(templatingRouter);
            return this;
          };
        });
      }));
      toLoad.push(System.normalize("aurelia-templating-resources", bName).then(function(name) {
        System.map["aurelia-templating-resources"] = name;
        aurelia.use.defaultResources = function() {
          aurelia.use.plugin(name);
          return this;
        };
      }));
      toLoad.push(System.normalize("aurelia-event-aggregator", bName).then(function(eventAggregator) {
        System.map["aurelia-event-aggregator"] = eventAggregator;
        aurelia.use.eventAggregator = function() {
          aurelia.use.plugin(eventAggregator);
          return this;
        };
      }));
      return Promise.all(toLoad);
    });
  }
  function handleMain(mainHost) {
    var mainModuleId = mainHost.getAttribute("aurelia-main") || "main",
        loader = new DefaultLoader();
    return loader.loadModule(mainModuleId).then(function(m) {
      var aurelia = new Aurelia(loader);
      return configureAurelia(aurelia).then(function() {
        return m.configure(aurelia);
      });
    })["catch"](function(e) {
      setTimeout(function() {
        throw e;
      }, 0);
    });
  }
  function handleApp(appHost) {
    var appModuleId = appHost.getAttribute("aurelia-app") || "app",
        aurelia = new Aurelia();
    return configureAurelia(aurelia).then(function() {
      aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();
      if (appHost.hasAttribute("es5")) {
        aurelia.use.es5();
      } else if (appHost.hasAttribute("atscript")) {
        aurelia.use.atscript();
      }
      return aurelia.start().then(function(a) {
        return a.setRoot(appModuleId, appHost);
      });
    })["catch"](function(e) {
      setTimeout(function() {
        throw e;
      }, 0);
    });
  }
  function runningLocally() {
    return window.location.protocol !== "http" && window.location.protocol !== "https";
  }
  function run() {
    return ready(window).then(function(doc) {
      var mainHost = doc.querySelectorAll("[aurelia-main]"),
          appHost = doc.querySelectorAll("[aurelia-app]"),
          i,
          ii;
      if (appHost.length && !mainHost.length && runningLocally()) {
        LogManager.addAppender(new ConsoleAppender());
        LogManager.setLevel(LogManager.levels.debug);
      }
      return loadPolyfills().then(function() {
        for (i = 0, ii = mainHost.length; i < ii; ++i) {
          handleMain(mainHost[i]);
        }
        for (i = 0, ii = appHost.length; i < ii; ++i) {
          handleApp(appHost[i]);
        }
        isReady = true;
        for (i = 0, ii = readyQueue.length; i < ii; ++i) {
          readyQueue[i]();
        }
        readyQueue = [];
      });
    });
  }
  return {
    setters: [function(_aureliaLoaderDefault) {
      DefaultLoader = _aureliaLoaderDefault.DefaultLoader;
    }, function(_aureliaFramework) {
      Aurelia = _aureliaFramework.Aurelia;
      LogManager = _aureliaFramework.LogManager;
    }, function(_aureliaLoggingConsole) {
      ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;
    }],
    execute: function() {
      logger = LogManager.getLogger("bootstrapper");
      readyQueue = [];
      isReady = false;
      run();
    }
  };
});

System.register("github:aurelia/bootstrapper@0.9.3", ["github:aurelia/bootstrapper@0.9.3/system/index"], function($__export) {
  return {
    setters: [function(m) {
      for (var p in m)
        $__export(p, m[p]);
    }],
    execute: function() {}
  };
});

System.register("dist/bundle", ["core-js", "aurelia-bootstrapper", "aurelia-templating-binding", "aurelia-templating-router", "aurelia-templating-resources", "aurelia-event-aggregator", "aurelia-router", "aurelia-history-browser", "./behaviors/focus", "./todo-item", "./todos", "./app"], function(_export) {
  "use strict";
  return {
    setters: [function(_coreJs) {}, function(_aureliaBootstrapper) {}, function(_aureliaTemplatingBinding) {}, function(_aureliaTemplatingRouter) {}, function(_aureliaTemplatingResources) {}, function(_aureliaEventAggregator) {}, function(_aureliaRouter) {}, function(_aureliaHistoryBrowser) {}, function(_behaviorsFocus) {}, function(_todoItem) {}, function(_todos) {}, function(_app) {}],
    execute: function() {}
  };
});

System.register("dist/main", ["./bundle", "aurelia-framework", "aurelia-logging-console", "aurelia-bootstrapper"], function(_export) {
  "use strict";
  var LogManager,
      ConsoleAppender,
      bootstrap;
  return {
    setters: [function(_bundle) {}, function(_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
    }, function(_aureliaLoggingConsole) {
      ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;
    }, function(_aureliaBootstrapper) {
      bootstrap = _aureliaBootstrapper.bootstrap;
    }],
    execute: function() {
      LogManager.addAppender(new ConsoleAppender());
      LogManager.setLevel(LogManager.levels.debug);
      bootstrap(function(aurelia) {
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();
        aurelia.start().then(function(a) {
          return a.setRoot("dist/app", document.body);
        });
      });
    }
  };
});
