!function() {
  'use strict';
  function moduleFactory(extend, eventEmitter, eventListener, patch, List) {
    function View() {
      Object.defineProperty(this, '__private', {
        writable: true,
        value: {}
      });
      this.__private.isRenderRequested = false;
      var delegates = this.__private.eventDelegates = {};
      this.__private.onDelegatedEvent = function(ev) {
        var delegatesForEvent = delegates[ev.type];
        var el = ev.target;
        for (var selectorStr in delegatesForEvent) {
          if (!elMatchesSelector(el, selectorStr)) {
            continue;
          }
          var delegatesForEventAndSelector = delegatesForEvent[selectorStr];
          for (var i = 0, n = delegatesForEventAndSelector.length; n > i; ++i) {
            delegatesForEventAndSelector[i](ev);
          }
        }
      };
      Object.defineProperty(this, 'el', {
        enumerable: true,
        get: function() {
          return this.__private.el;
        },
        set: function(el) {
          this.stopListening('*');
          this.__private.el = el;
        }
      });
      this.__private.childViews = new List();
      this.listenTo(this.__private.childViews, 'item:destroyed', function(childView) {
        this.__private.childViews.remove(childView);
      });
      Object.defineProperty(this, 'children', {
        enumerable: true,
        get: function() {
          return this.__private.childViews;
        }
      });
    }
    var HTML_PARSER_EL = document.createElement('div');
    var elMatchesSelector = document.body.matches ? function(el, selectorStr) {
      return el.matches(selectorStr);
    } : function(el, selectorStr) {
      return el.msMatchesSelector(selectorStr);
    };
    var myRequestAnimationFrame = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(callback) {
      setTimeout(callback, 1e3 / 60);
    };
    extend(View.prototype, eventEmitter);
    extend(View.prototype, eventListener);
    extend(View.prototype, {
      destroy: function() {
        this.destroyChildren();
        this.stopListening();
        this.el && this.el.parentNode && this.el.parentNode.removeChild(this.el);
        this.emit('destroyed', this);
      },
      render: function(patchOptions) {
        if (true) {
          if (!this.getHtml) {
            throw 'You must implement getHtml() in order to use render()';
          }
          if (arguments.length > 1 && 'object' != typeof patchOptions) {
            throw '"patchOptions" argument must be an object';
          }
        }
        var newEl = this.parseHtml(this.getHtml());
        this.doPatch || newEl.setAttribute('patch-ignore', '');
        if (this.el) {
          patch(this.el, newEl, patchOptions);
        } else {
          this.el = newEl;
        }
      },
      requestRender: function() {
        if (this.__private.isRenderRequested) {
          return;
        }
        this.__private.isRenderRequested = true;
        var self = this;
        myRequestAnimationFrame(function() {
          self.__private.isRenderRequested = false;
          self.render();
        });
      },
      parseHtml: function(htmlString, returnAll) {
        if (true) {
          if ('string' != typeof htmlString) {
            throw '"htmlString" argument must be a string';
          }
          if (arguments.length > 1 && 'boolean' != typeof returnAll) {
            throw '"returnAll" argument must be a boolean value';
          }
        }
        HTML_PARSER_EL.innerHTML = htmlString;
        if (true && !returnAll && HTML_PARSER_EL.children.length > 1) {
          throw 'The parsed HTML contains more than one root element.Specify returnAll = true to return all of them';
        }
        var ret = returnAll ? HTML_PARSER_EL.children : HTML_PARSER_EL.firstChild;
        while (HTML_PARSER_EL.firstChild) {
          HTML_PARSER_EL.removeChild(HTML_PARSER_EL.firstChild);
        }
        return ret;
      },
      $: function(queryString) {
        if (true && 'string' != typeof queryString) {
          throw '"queryString" argument must be a string';
        }
        return this.el.querySelector(queryString);
      },
      forceRepaint: function(el) {
        if (true && arguments.length > 0 && !(el instanceof HTMLElement)) {
          throw '"el" argument must be an HTMLElement';
        }
        return (el || this.el).offsetHeight;
      },
      addChild: function(childView, el) {
        if (true) {
          if (!(childView instanceof View)) {
            throw '"childView" argument must be a BFF View';
          }
          if (arguments.length > 1 && !(false === el || el instanceof HTMLElement)) {
            throw '"el" argument must be an HTMLElement or the boolean value false';
          }
        }
        this.__private.childViews.push(childView);
        false !== el && (el || this.el).appendChild(childView.el);
        return childView;
      },
      destroyChildren: function() {
        for (var i = this.__private.childViews.length - 1; i >= 0; --i) {
          this.__private.childViews[i].destroy();
        }
      },
      listenTo: function(selectorStr, eventName, callback, context, useCapture) {
        if ('string' != typeof selectorStr) {
          eventListener.listenTo.apply(this, arguments);
          return;
        }
        if (eventName instanceof Array && eventName.length > 0) {
          this.listenTo(selectorStr, eventName.pop(), callback, context, useCapture);
          this.listenTo(selectorStr, eventName, callback, context, useCapture);
          return;
        }
        if (true) {
          if ('string' != typeof eventName) {
            throw '"eventName" argument must be a string';
          }
          if ('function' != typeof callback) {
            throw '"callback" argument must be a function';
          }
          if (arguments.length > 4 && 'boolean' != typeof useCapture) {
            throw '"useCapture" argument must be a boolean value';
          }
        }
        var delegates = this.__private.eventDelegates;
        var delegatesForEvent = delegates[eventName];
        if (!delegatesForEvent) {
          delegatesForEvent = delegates[eventName] = {};
          useCapture = useCapture || 'blur' === eventName || 'focus' === eventName;
          eventListener.listenTo.call(this, this.el, eventName, this.__private.onDelegatedEvent, void 0, useCapture);
        }
        delegatesForEvent[selectorStr] = delegatesForEvent[selectorStr] || [];
        delegatesForEvent[selectorStr].push(callback.bind(context || this));
      },
      stopListening: function(selectorStr, eventName) {
        if ('string' != typeof selectorStr) {
          eventListener.stopListening.apply(this, arguments);
          if (void 0 !== selectorStr) {
            return;
          }
        }
        if (true && arguments.length > 1 && 'string' != typeof eventName) {
          throw '"eventName" argument must be a string';
        }
        var eventDelegates = this.__private.eventDelegates;
        var eventNames = void 0 !== eventName ? [ eventName ] : Object.keys(eventDelegates);
        for (var i = 0, n = eventNames.length; n > i; ++i) {
          eventName = eventNames[i];
          var delegatesForEvent = eventDelegates[eventName];
          if (!delegatesForEvent) {
            continue;
          }
          if (selectorStr && '*' !== selectorStr) {
            delete delegatesForEvent[selectorStr];
          } else {
            eventDelegates[eventName] = {};
          }
          if (0 === Object.keys(eventDelegates[eventName]).length) {
            delete this.__private.eventDelegates[eventName];
            eventListener.stopListening.call(this, this.el, eventName);
          }
        }
      },
      toString: function() {
        return JSON.stringify({
          element: this.el && {
            type: '<' + this.el.nodeName + '>',
            children: this.el.childNodes.length
          },
          'child views': this.__private.childViews.length,
          'event listeners': Object.keys(this.__private.listeningTo),
          'delegated events': Object.keys(this.__private.eventDelegates)
        }, void 0, 2);
      }
    }, 'useSource');
    View.makeSubclass = function(properties) {
      if (true && 'object' != typeof properties) {
        throw '"properties" argument must be an object';
      }
      var customConstructor = properties.constructor;
      var Constructor = function() {
        View.apply(this, arguments);
        customConstructor && customConstructor.apply(this, arguments);
      };
      delete properties.constructor;
      Constructor.prototype = Object.create(View.prototype);
      properties && extend(Constructor.prototype, properties);
      Constructor.prototype.constructor = Constructor;
      return Constructor;
    };
    return View;
  }
  if ('function' == typeof define && define.amd) {
    define([ './extend', './event-emitter', './event-listener', './patch-dom', './list' ], moduleFactory);
  } else {
    if ('object' == typeof exports) {
      module.exports = moduleFactory(require('./extend'), require('./event-emitter'), require('./event-listener'), require('./patch-dom'), require('./list'));
    } else {
      var bff = window.bff = window.bff || {};
      bff.View = moduleFactory(bff.extend, bff.eventEmitter, bff.eventListener, bff.patchDom, bff.List);
    }
  }
}();