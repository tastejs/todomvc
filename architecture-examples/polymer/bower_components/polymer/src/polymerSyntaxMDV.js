(function(global) {
  'use strict';

  function Scope() {}

  var bindPattern = /([\w\.\$]*)[\s]+as[\s]+([\w]*)/;
  var repeatPattern = /([\w]*)[\s]+in[\s]+([\w\.\$]*)/;

  function createBindRepeatBinding(model, path, name, node) {
    var scopeName, scopePath;
    var match = path.match(repeatPattern);
    if (match) {
      scopeName = match[1];
      scopePath = match[2];
    } else {
      match = path.match(bindPattern);
      if (match) {
        scopeName = match[2];
        scopePath = match[1];
      } else {
        return;
      }
    }
    var binding = new CompoundBinding(function(values) {
      return values['value'];
    });
    binding.bind('value', model, scopePath);
    templateScopeTable.set(node, { model: model, scope: scopeName });
    return binding;
  }

  function createStringIfTruthyBinding(model, className, path) {
    var binding = new CompoundBinding(function(values) {
      return values['value'] ? className : '';
    });

    binding.bind('value', model, path);
    return binding;
  }

  var templateScopeTable = new SideTable;

  HTMLTemplateElement.syntax['Polymer'] = {
    getBinding: function(model, path, name, node) {
      if (node.nodeType === Node.ELEMENT_NODE &&
          (name === 'bind' || name === 'repeat') &&
          node.tagName === 'TEMPLATE') {
        return createBindRepeatBinding(model, path, name, node);
      }

      // {{ string: path }}
      var match = path.match(/([\w]+):[\W]*([\w\.\$]*)/);
      if (match)
        return createStringIfTruthyBinding(model, match[1], match[2]);
    },

    getInstanceModel: function(template, model) {
      var scopeInfo = templateScopeTable.get(template);
      if (!scopeInfo)
        return model;

      var scope;
      if (scopeInfo.model) { // instanceof Scope) {
        scope = Object.create(scopeInfo.model);
      } else {
        scope = new Scope();
      }

      scope[scopeInfo.scope] = model;
      return scope;
    }
  };
})(this);