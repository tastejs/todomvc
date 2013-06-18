/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // imports

  var log = window.logFlags || {};

  // use the ExperssionSyntax
  var expressionSyntax = new ExpressionSyntax;

  // bind tracking
  var bindings = new SideTable();

  function registerBinding(element, name, path) {
    var b$ = bindings.get(element);
    if (!b$) {
      bindings.set(element, b$ = {});
    }
    b$[name.toLowerCase()] = path;
  }

  function unregisterBinding(element, name) {
    var b$ = bindings.get(element);
    if (b$) {
      delete b$[name.toLowerCase()];
    }
  }

  function overrideBinding(ctor) {
    var proto = ctor.prototype;
    var originalBind = proto.bind;
    var originalUnbind = proto.unbind;

    proto.bind = function(name, model, path) {
      originalBind.apply(this, arguments);
      // note: must do this last because mdv may unbind before binding
      registerBinding(this, name, path);
    }

    proto.unbind = function(name) {
      originalUnbind.apply(this, arguments);
      unregisterBinding(this, name);
    }
  };

  [Node, Element, Text, HTMLInputElement].forEach(overrideBinding);

  var emptyBindings = {};

  function getBindings(element) {
    return element && bindings.get(element) || emptyBindings;
  }

  function getBinding(element, name) {
    return getBindings(element)[name.toLowerCase()];
  }

  // model bindings
  function bind(name, model, path) {
    var property = Polymer.propertyForAttribute.call(this, name);
    if (property) {
      registerBinding(this, property, path);
      Polymer.registerObserver(this, 'binding', property,
        Polymer.bindProperties(this, property, model, path)
      );
    } else {
      HTMLElement.prototype.bind.apply(this, arguments);
    }
  }

  function unbind(name) {
    if (!Polymer.unregisterObserver(this, 'binding', name)) {
      HTMLElement.prototype.unbind.apply(this, arguments);
    }
  }

  function unbindAll() {
    if (!isElementUnbound(this)) {
      Polymer.unregisterObserversOfType(this, 'property');
      HTMLElement.prototype.unbindAll.apply(this, arguments);
      // unbind shadowRoot, whee
      unbindNodeTree(this.webkitShadowRoot, true);
      markElementUnbound(this);
    }
  }

  function unbindNodeTree(node, olderShadows) {
    forNodeTree(node, olderShadows, function(n) {
      if (n.unbindAll) {
        n.unbindAll();
      }
    });
  }

  function forNodeTree(node, olderShadows, callback) {
    if (!node) {
      return;
    }
    callback(node);
    if (olderShadows && node.olderShadowRoot) {
      forNodeTree(node.olderShadowRoot, olderShadows, callback);
    }
    for (var child = node.firstChild; child; child = child.nextSibling) {
      forNodeTree(child, olderShadows, callback);
    }
  }

  // binding state tracking
  var unboundTable = new SideTable();

  function markElementUnbound(element) {
    unboundTable.set(element, true);
  }

  function isElementUnbound(element) {
    return unboundTable.get(element);
  }

  // asynchronous binding management
  var unbindAllJobTable = new SideTable();

  function asyncUnbindAll() {
    if (!isElementUnbound(this)) {
      log.bind && console.log('asyncUnbindAll', this.localName);
      unbindAllJobTable.set(this, this.job(unbindAllJobTable.get(this),
        this.unbindAll));
    }
  }

  function cancelUnbindAll(preventCascade) {
    if (isElementUnbound(this)) {
      log.bind && console.warn(this.localName,
        'is unbound, cannot cancel unbindAll');
      return;
    }
    log.bind && console.log('cancelUnbindAll', this.localName);
    var unbindJob = unbindAllJobTable.get(this);
    if (unbindJob) {
      unbindJob.stop();
      unbindAllJobTable.set(this, null);
    }
    // cancel unbinding our shadow tree iff we're not in the process of
    // cascading our tree (as we do, for example, when the element is inserted).
    if (!preventCascade) {
      forNodeTree(this.webkitShadowRoot, true, function(n) {
        if (n.cancelUnbindAll) {
          n.cancelUnbindAll();
        }
      });
    }
  }

  // bind arbitrary html to a model
  function parseAndBindHTML(html, model) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.createInstance(model, expressionSyntax);
  }

  var mustachePattern = /\{\{([^{}]*)}}/;

  // exports

  Polymer.bind = bind;
  Polymer.unbind = unbind;
  Polymer.unbindAll = unbindAll;
  Polymer.getBinding = getBinding;
  Polymer.asyncUnbindAll = asyncUnbindAll;
  Polymer.cancelUnbindAll = cancelUnbindAll;
  Polymer.isElementUnbound = isElementUnbound;
  Polymer.unbindNodeTree = unbindNodeTree;
  Polymer.parseAndBindHTML = parseAndBindHTML;
  Polymer.bindPattern = mustachePattern;
  Polymer.expressionSyntax = expressionSyntax;

})();

