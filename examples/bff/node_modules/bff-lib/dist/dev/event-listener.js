!function() {
  'use strict';
  function moduleFactory() {
    function filterList(listeningToList, eventName, eventEmitter) {
      var length = listeningToList.length;
      for (var i = length - 1; i >= 0; --i) {
        var listeningTo = listeningToList[i];
        if (!eventEmitter || listeningTo.emitter === eventEmitter) {
          listeningTo.emitter.removeEventListener(eventName, listeningTo.callback);
          listeningToList.splice(i, 1);
        }
      }
    }
    function setupListeners(self, eventEmitter, eventName, callback, context, useCapture) {
      if (true) {
        if (!eventEmitter.addEventListener) {
          throw '"eventEmitter" argument must be an event emitter';
        }
        if ('string' != typeof eventName) {
          throw '"eventName" argument must be a string';
        }
      }
      self.__private || Object.defineProperty(self, '__private', {
        writable: true,
        value: {}
      });
      var listeningTo = self.__private.listeningTo || (self.__private.listeningTo = {});
      var listeningToEvent = listeningTo[eventName] || (listeningTo[eventName] = []);
      callback = callback.bind(context || self);
      listeningToEvent.push({
        callback: callback,
        emitter: eventEmitter
      });
      eventEmitter.addEventListener(eventName, callback, useCapture);
    }
    var eventListener = {
      listenTo: function(eventEmitters, eventNames, callback, context, useCapture) {
        if (true) {
          if (!eventEmitters || !(eventEmitters.addEventListener || eventEmitters instanceof Array)) {
            throw '"eventEmitters" argument must be an event emitter or an array of event emitters';
          }
          if ('string' != typeof eventNames && !(eventNames instanceof Array)) {
            throw '"eventNames" argument must be a string or an array of strings';
          }
          if ('function' != typeof callback) {
            throw '"callback" argument must be a function';
          }
          if (arguments.length > 4 && 'boolean' != typeof useCapture) {
            throw '"useCapture" argument must be a boolean value';
          }
        }
        eventEmitters = eventEmitters instanceof Array || 'undefined' != typeof NodeList && eventEmitters instanceof NodeList ? eventEmitters : [ eventEmitters ];
        eventNames = eventNames instanceof Array ? eventNames : [ eventNames ];
        for (var i = 0; i < eventEmitters.length; ++i) {
          for (var j = 0; j < eventNames.length; ++j) {
            setupListeners(this, eventEmitters[i], eventNames[j], callback, context, !!useCapture);
          }
        }
      },
      stopListening: function(eventEmitter, eventName) {
        if (true) {
          if (!!eventEmitter && !eventEmitter.addEventListener) {
            throw '"eventEmitter" argument must be an event emitter';
          }
          if (arguments.length > 1 && 'string' != typeof eventName) {
            throw '"eventName" argument must be a string';
          }
        }
        if (!this.__private || !this.__private.listeningTo) {
          return;
        }
        var eventNames = eventName ? {} : this.__private.listeningTo;
        eventName && (eventNames[eventName] = true);
        for (eventName in eventNames) {
          var listeningToList = this.__private.listeningTo[eventName];
          if (!listeningToList) {
            continue;
          }
          filterList(listeningToList, eventName, eventEmitter);
          listeningToList.length || delete this.__private.listeningTo[eventName];
        }
      }
    };
    return eventListener;
  }
  if ('function' == typeof define && define.amd) {
    define(moduleFactory);
  } else {
    if ('object' == typeof exports) {
      module.exports = moduleFactory();
    } else {
      var bff = window.bff = window.bff || {};
      bff.eventListener = moduleFactory();
    }
  }
}();