// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define(

  [
    './utils',
    './debug'
  ],

  function(utils, debug) {
    'use strict';

    //enumerables are shims - getOwnPropertyDescriptor shim doesn't work
    var canWriteProtect = debug.enabled && !utils.isEnumerable(Object, 'getOwnPropertyDescriptor');
    //whitelist of unlockable property names
    var dontLock = ['mixedIn'];

    if (canWriteProtect) {
      //IE8 getOwnPropertyDescriptor is built-in but throws exeption on non DOM objects
      try {
        Object.getOwnPropertyDescriptor(Object, 'keys');
      } catch(e) {
        canWriteProtect = false;
      }
    }

    function setPropertyWritability(obj, isWritable) {
      if (!canWriteProtect) {
        return;
      }

      var props = Object.create(null);

      Object.keys(obj).forEach(
        function (key) {
          if (dontLock.indexOf(key) < 0) {
            var desc = Object.getOwnPropertyDescriptor(obj, key);
            desc.writable = isWritable;
            props[key] = desc;
          }
        }
      );

      Object.defineProperties(obj, props);
    }

    function unlockProperty(obj, prop, op) {
      var writable;

      if (!canWriteProtect || !obj.hasOwnProperty(prop)) {
        op.call(obj);
        return;
      }

      writable = Object.getOwnPropertyDescriptor(obj, prop).writable;
      Object.defineProperty(obj, prop, { writable: true });
      op.call(obj);
      Object.defineProperty(obj, prop, { writable: writable });
    }

    function mixin(base, mixins) {
      base.mixedIn = base.hasOwnProperty('mixedIn') ? base.mixedIn : [];

      mixins.forEach(function(mixin) {
        if (base.mixedIn.indexOf(mixin) == -1) {
          setPropertyWritability(base, false);
          mixin.call(base);
          base.mixedIn.push(mixin);
        }
      });

      setPropertyWritability(base, true);
    }

    return {
      mixin: mixin,
      unlockProperty: unlockProperty
    };

  }
);
