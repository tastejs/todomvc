/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var log = window.logFlags || {};

  //
  // automagic event mapping
  //

  var prefix = "on-";

  var parseHostEvents = function(inAttributes, inPrototype) {
//    inDefinition.eventDelegates = Platform.mixin(inDefinition.eventDelegates,
//      parseEvents(inAttributes));
    inPrototype.eventDelegates = parseEvents(inAttributes);
  };

  var parseEvents = function(inAttributes) {
    var events = {};
    if (inAttributes) {
      for (var i=0, a; a=inAttributes[i]; i++) {
        if (a.name.slice(0, prefix.length) == prefix) {
          events[a.name.slice(prefix.length)] = a.value;
        }
      }
    }
    return events;
  };

  var accumulateEvents = function(inNode, inEvents) {
    var events = inEvents || {};
    accumulateNodeEvents(inNode, events);
    accumulateChildEvents(inNode, events);
    accumulateTemplatedEvents(inNode, events);
    return events;
  };

  var accumulateNodeEvents = function(inNode, inEvents) {
    var a$ = inNode.attributes;
    if (a$) {
      for (var i=0, a; (a=a$[i]); i++) {
        if (a.name.slice(0, prefix.length) === prefix) {
          accumulateEvent(a.name.slice(prefix.length), inEvents);
        }
      }
    }
  };

  var event_translations = {
    webkitanimationstart: 'webkitAnimationStart',
    webkitanimationend: 'webkitAnimationEnd',
    webkittransitionend: 'webkitTransitionEnd',
    domfocusout: 'DOMFocusOut',
    domfocusin: 'DOMFocusIn'
  };

  var accumulateEvent = function(inName, inEvents) {
    var n = event_translations[inName] || inName;
    inEvents[n] = 1;
  };

  var accumulateChildEvents = function(inNode, inEvents) {
    var cn$ = inNode.childNodes;
    for (var i=0, n; (n=cn$[i]); i++) {
      // TODO(sjmiles): unify calling convention (.call or not .call)
      accumulateEvents(n, inEvents);
      //if (n.$protected) {
       // accumulateHostEvents.call(n.$protected, inEvents);
      //}
    }
  };

  var accumulateTemplatedEvents = function(inNode, inEvents) {
    if (inNode.localName == 'template') {
      var content = getTemplateContent(inNode);
      if (content) {
        accumulateChildEvents(content, inEvents);
      }
    }
  }

  // TODO(sorvell): Currently in MDV, there is no way to get a template's
  // effective content. A template can have a ref property
  // that points to the template from which this one has been cloned.
  // Remove this when the MDV api is improved
  // (https://github.com/polymer-project/mdv/issues/15).
  var getTemplateContent = function(inTemplate) {
    return inTemplate.ref ? inTemplate.ref.content : inTemplate.content;
  }

  var accumulateHostEvents = function(inEvents) {
    var events = inEvents || {};
    // specifically search the __proto__ (as opposed to getPrototypeOf) 
    // __proto__ is simulated on platforms which don't support it naturally 
    // TODO(sjmiles): we walk the prototype tree to operate on the union of
    // eventDelegates maps; it might be better to merge maps when extending
    var p = this.__proto__;
    while (p && p !== HTMLElement.prototype) {
      if (p.hasOwnProperty('eventDelegates')) {
        for (var n in p.eventDelegates) {
          accumulateEvent(n, events);
        }
      }
      p = p.__proto__;
    }
    return events;
  };


  function bindAccumulatedEvents(inNode, inEvents, inListener) {
    var fn = inListener.bind(this);
    for (var n in inEvents) {
      log.events && console.log('[%s] bindAccumulatedEvents: addEventListener("%s", listen)', inNode.localName || 'root', n);
      inNode.addEventListener(n, fn);
    }
  };
  
  // host events should be listened for on a host element
  function bindAccumulatedHostEvents(inEvents) {
    bindAccumulatedEvents.call(this, this, inEvents, listenHost);
  }
  
  // local events should be listened for on a shadowRoot
  function bindAccumulatedLocalEvents(inNode, inEvents) {
    bindAccumulatedEvents.call(this, inNode, inEvents, listenLocal);
  }

  // experimental delegating declarative event handler

  // TODO(sjmiles):
  // we wanted to simply look for nearest ancestor
  // with a 'controller' property to be WLOG
  // but we need to honor ShadowDOM, so we had to
  // customize this search
  var findController = function(inNode) {
    // find the shadow root that contains inNode
    var n = inNode;
    while (n.parentNode && n.localName !== 'shadow-root') {
      n = n.parentNode;
    }
    return n.host;
  };

  var dispatch = function(inNode, inHandlerName, inArguments) {
    if (inNode) {
      log.events && console.group('[%s] dispatch [%s]', inNode.localName, inHandlerName);
      inNode.dispatch(inHandlerName, inArguments);
      log.events && console.groupEnd();
    }
  };

  function listenLocal(inEvent) {
    if (inEvent.cancelBubble) {
      return;
    }
    inEvent.on = prefix + inEvent.type;
    log.events && console.group("[%s]: listenLocal [%s]", this.localName, 
      inEvent.on);
    if (!inEvent.path || window.ShadowDOMPolyfill) {
      listenLocalNoEventPath(inEvent);
    } else {
      var c = null;
      Array.prototype.some.call(inEvent.path, function(t) {
        if (t === this) {
          return true;
        }
        c = c === this ? c : findController(t);
        if (c) {
          if (handleEvent.call(c, t, inEvent)) {
            return true;
          }
        }
      }, this);
    }
    log.events && console.groupEnd();
  }
  
  
  // TODO(sorvell): remove when ShadowDOM polyfill supports event path.
  // Note that findController will not return the expected 
  // controller when when the event target is a distributed node.
  // This because we cannot traverse from a composed node to a node 
  // in shadowRoot.
  // This will be addressed via an event path api 
  // https://www.w3.org/Bugs/Public/show_bug.cgi?id=21066
  function listenLocalNoEventPath(inEvent) {
    log.events && console.log('event.path() not supported for', inEvent.type);
    var t = inEvent.target, c = null;
    while (t && t != this) {
      c = c === this ? c : findController(t);
      if (c) {
        if (handleEvent.call(c, t, inEvent)) {
          return;
        }
      }
      t = t.parentNode;
    }
  }
  
  function listenHost(inEvent) {
    if (inEvent.cancelBubble) {
      return;
    }
    log.events && console.group("[%s]: listenHost [%s]", this.localName, inEvent.type);
    handleHostEvent.call(this, this, inEvent);
    log.events && console.groupEnd();
  }

  var eventHandledTable = new SideTable('handledList');
  
  function getHandledListForEvent(inEvent) {
    var handledList = eventHandledTable.get(inEvent);
    if (!handledList) {
      handledList = [];
      eventHandledTable.set(inEvent, handledList);
    }
    return handledList;
  }

  function handleEvent(inNode, inEvent) {
    if (inNode.attributes) {
      var handledList = getHandledListForEvent(inEvent);
      if (handledList.indexOf(inNode) < 0) {
        handledList.push(inNode);
        var h = inNode.getAttribute(inEvent.on);
        if (h) {
          log.events && console.log('[%s] found handler name [%s]', this.localName, h);
          dispatch(this, h, [inEvent, inEvent.detail, inNode]);
        }
      }
    }
    return inEvent.cancelBubble;
  };
 
  function handleHostEvent(inNode, inEvent) {
    var h = findHostHandler.call(inNode, inEvent.type);
    if (h) {
      log.events && console.log('[%s] found host handler name [%s]', inNode.localName, h);
      dispatch(inNode, h, [inEvent, inEvent.detail, inNode]);
    }
    return inEvent.cancelBubble;
  };

  // find the method name (handler) in eventDelegates mapped to inEventName
  var findHostHandler = function(inEventName) {
    // TODO(sjmiles): walking the tree again is inefficient; combine with code
    // in accumulateHostEvents into something more sane
    var p = this;
    while (p) {
      if (p.hasOwnProperty('eventDelegates')) {
        var h = p.eventDelegates[inEventName]
            || p.eventDelegates[inEventName.toLowerCase()];
        if (h) {
          return h;
        }
      }
      p = p.__proto__;
    }
  };

// exports

Polymer.parseHostEvents = parseHostEvents;
Polymer.accumulateEvents = accumulateEvents;
Polymer.accumulateHostEvents = accumulateHostEvents;
Polymer.bindAccumulatedHostEvents = bindAccumulatedHostEvents;
Polymer.bindAccumulatedLocalEvents = bindAccumulatedLocalEvents;

})();