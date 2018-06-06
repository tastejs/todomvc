/*
 * JSFace Object Oriented Programming Library
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 */
(function(context, OBJECT, NUMBER, LENGTH, toString, readyFns, readyCount, undefined, oldClass, jsface) {
  /**
   * Return a map itself or null. A map is a set of { key: value }
   * @param obj object to be checked
   * @return obj itself as a map or false
   */
  function mapOrNil(obj) { return (obj && typeof obj === OBJECT && !(typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH))) && obj) || null; }

  /**
   * Return an array itself or null
   * @param obj object to be checked
   * @return obj itself as an array or null
   */
  function arrayOrNil(obj) { return (obj && typeof obj === OBJECT && typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH)) && obj) || null; }

  /**
   * Return a function itself or null
   * @param obj object to be checked
   * @return obj itself as a function or null
   */
  function functionOrNil(obj) { return (obj && typeof obj === "function" && obj) || null; }

  /**
   * Return a class itself or null
   * @param obj object to be checked
   * @return obj itself as a class or false
   */
  function classOrNil(obj) { return (functionOrNil(obj) && (obj.prototype && obj === obj.prototype.constructor) && obj) || null; }

  /**
   * Util for extend() to copy a map of { key:value } to an object
   * @param key key
   * @param value value
   * @param ignoredKeys ignored keys
   * @param object object
   * @param iClass true if object is a class
   * @param oPrototype object prototype
   */
  function copier(key, value, ignoredKeys, object, iClass, oPrototype) {
    if ( !ignoredKeys || !ignoredKeys.hasOwnProperty(key)) {
      object[key] = value;
    }
  }

  /**
   * Extend object from subject, ignore properties in ignoredKeys
   * @param object the child
   * @param subject the parent
   * @param ignoredKeys (optional) keys should not be copied to child
   */
  function extend(object, subject, ignoredKeys) {
    if (arrayOrNil(subject)) {
      for (var len = subject.length; --len >= 0;) { extend(object, subject[len], ignoredKeys); }
    } else {
      ignoredKeys = ignoredKeys || { constructor: 1, $super: 1, prototype: 1, $superp: 1 };

      var iClass     = classOrNil(object),
          isSubClass = classOrNil(subject),
          oPrototype = object.prototype, supez, key, proto;

      // copy static properties and prototype.* to object
      if (mapOrNil(subject) || iClass) {
        for (key in subject) {
          copier(key, subject[key], ignoredKeys, object, iClass, oPrototype);
        }
      }

      if (isSubClass) {
        proto = subject.prototype;
        for (key in proto) {
          copier(key, proto[key], ignoredKeys, object, iClass, oPrototype);
        }
      }

      // prototype properties
      if (iClass && isSubClass) { extend(oPrototype, subject.prototype, ignoredKeys); }
    }
  }

  /**
   * To make object fully immutable, freeze each object inside it.
   * @param object to deep freeze
   */
  function deepFreeze(object) {
    var prop, propKey;
    Object.freeze(object); // first freeze the object
    for (propKey in object) {
      prop = object[propKey];
      if (!object.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
        // If the object is on the prototype, not an object, or is already frozen,
        // skip it. Note that this might leave an unfrozen reference somewhere in the
        // object if there is an already frozen object containing an unfrozen object.
        continue;
      }

      deepFreeze(prop); // recursively call deepFreeze
    }
  }

  /**
   * Create a class.
   * @param parent parent class(es)
   * @param api class api
   * @return class
   */
  function Class(parent, api) {
    if ( !api) {
      parent = (api = parent, 0); // !api means there's no parent
    }

    // TODO remove $statics, use $static instead
    var clazz, constructor, singleton, statics, key, bindTo, len, i = 0, p,
        ignoredKeys = { constructor: 1, $singleton: 1, $static:1, $statics: 1, prototype: 1, $super: 1, $superp: 1, main: 1, toString: 0 },
        plugins     = Class.plugins,
        rootParent, parentClass, Stub;

    api         = (typeof api === "function" ? api() : api) || {};             // execute api if it's a function
    constructor = api.hasOwnProperty("constructor") ? api.constructor : 0;     // hasOwnProperty is a must, constructor is special
    singleton   = api.$singleton;
    statics     = api.$statics || api.$static;

    // add plugins' keys into ignoredKeys
    for (key in plugins) { ignoredKeys[key] = 1; }

    // construct constructor
    clazz  = singleton ? function(){} : (constructor ? constructor : function(){});

    // make sure parent is always an array
    parent = !parent || parent instanceof Array ? parent : [ parent ];
    len = parent && parent.length;
    rootParent = parent[0];

    if ( !singleton && len) {
      parentClass = rootParent.prototype && rootParent === rootParent.prototype.constructor && rootParent;

      if ( !parentClass) {
        clazz.prototype = rootParent;
      } else {
        // Constributed by Freddy Snijder (https://github.com/tnhu/jsface/issues/26)
        Stub = function(){};

        Stub.prototype                    = parentClass.prototype;
        Stub.prototype.constructor        = Stub;
        clazz.prototype                   = new Stub();
        clazz.prototype.constructor       = clazz;       // restoring proper constructor for child class
        parentClass.prototype.constructor = parentClass; // restoring proper constructor for parent class
      }
    }

    // determine bindTo: where api should be bound
    bindTo = singleton ? clazz : clazz.prototype;

    // do inherit static properties and extentions (parents other than the first one)
    while (i < len) {
      p = parent[i++];

      // copy static properties
      for (key in p) {
        if ( !ignoredKeys[key]) {
          clazz[key] = p[key];
        }
      }
      if ( !singleton && i !== 0) {
        for (key in p.prototype) {
          if ( !ignoredKeys[key]) {
            bindTo[key] = p.prototype[key];
          }
        }
      }
    }

    // copy properties from api to bindTo
    for (key in api) {
      if ( !ignoredKeys[key]) {
        var prop = api[key];

        if (prop && (prop.get || prop.set)) {                 // check if it is a property descriptor
          prop.enumerable = true;
          Object.defineProperty(bindTo, key, prop);
        } else {
          bindTo[key] = prop;
        }
      }
    }

    // copy static properties from statics to clazz
    for (key in statics) {
      clazz[key] = statics[key];
    }

    // add $super and $superp to refer to parent class and parent.prototype (if applied)
    p = parent && rootParent || parent;
    clazz.$super  = p;
    clazz.$superp = p && p.prototype || p;

    for (key in plugins) { plugins[key](clazz, parent, api); }            // pass control to plugins
    if (typeof api.main === "function") { api.main.call(clazz, clazz); }  // execute main()

    return clazz;
  }

  /* Class plugins repository */
  Class.plugins = {
    $ready: function invoke(clazz, parent, api, loop) {
      var r       = api.$ready,
          len     = parent ? parent.length : 0,
          count   = len,
          _super  = len && parent[0].$super,
          pa, i, entry;

      // find and invoke $ready from parent(s)
      while (len--) {
        for (i = 0; i < readyCount; i++) {
          entry = readyFns[i];
          pa    = parent[len];

          if (pa === entry[0]) {
            entry[1].call(pa, clazz, parent, api);
            count--;
          }

          if ( !count) { break; }
        }
      }

      // call $ready from grandparent(s), if any
      if (_super) {
        invoke(clazz, [ _super ], api, true);
      }

      // in an environment where there are a lot of class creating/removing (rarely)
      // this implementation might cause a leak (saving pointers to clazz and $ready)
      if ( !loop && functionOrNil(r)) {
        r.call(clazz, clazz, parent, api);  // invoke ready from current class
        readyFns.push([ clazz,  r ]);
        readyCount++;
      }
    },

    $const: function (clazz, parent, api) {
      var key,
          consts = api.$const;

      // copy immutable properties from consts to clazz and freeze them recursively
      for (key in consts) {
        Object.defineProperty(clazz, key, { enumerable: true, value: consts[key] }); // enumerable for proper inheritance

        if ((typeof clazz[key] === 'object') && !Object.isFrozen(clazz[key])) {
          deepFreeze(clazz[key]); // if property is an unfrozen object, freeze it recursively
        }
      }
    }
  };

  /* Initialization */
  jsface = {
    Class        : Class,
    extend       : extend,
    mapOrNil     : mapOrNil,
    arrayOrNil   : arrayOrNil,
    functionOrNil: functionOrNil,
    classOrNil   : classOrNil
  };

  if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
    module.exports = jsface;
  } else {
    oldClass          = context.Class;                                         // save current Class namespace
    context.Class     = Class;                                                 // bind Class and jsface to global scope
    context.jsface    = jsface;
    jsface.noConflict = function() { context.Class = oldClass; };              // no conflict
  }
})(this, "object", "number", "length", Object.prototype.toString, [], 0);
