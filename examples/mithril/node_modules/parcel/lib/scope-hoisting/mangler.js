"use strict";

const rename = require('./renamer');

const t = require('@babel/types');

const CHARSET = ('abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ$_').split('');
/**
 * This is a very specialized mangler designer to mangle only names in the top-level scope.
 * Mangling of names in other scopes happens at a file level inside workers, but we can't
 * mangle the top-level scope until scope hoisting is complete in the packager.
 *
 * Based on code from babel-minify!
 * https://github.com/babel/minify/blob/master/packages/babel-plugin-minify-mangle-names/src/charset.js
 */

function mangleScope(scope) {
  let newNames = new Set(); // Sort bindings so that more frequently referenced bindings get shorter names.

  let sortedBindings = Object.keys(scope.bindings).sort((a, b) => scope.bindings[b].referencePaths.length - scope.bindings[a].referencePaths.length);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sortedBindings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let oldName = _step.value;
      let i = 0;
      let newName = '';

      do {
        newName = getIdentifier(i++);
      } while (newNames.has(newName) || !canRename(scope, scope.bindings[oldName], newName));

      rename(scope, oldName, newName);
      newNames.add(newName);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function getIdentifier(num) {
  let ret = '';
  num++;

  do {
    num--;
    ret += CHARSET[num % CHARSET.length];
    num = Math.floor(num / CHARSET.length);
  } while (num > 0);

  return ret;
}

function canRename(scope, binding, newName) {
  if (!t.isValidIdentifier(newName)) {
    return false;
  } // If there are any references where the parent scope has a binding
  // for the new name, we cannot rename to this name.


  for (let i = 0; i < binding.referencePaths.length; i++) {
    const ref = binding.referencePaths[i];

    if (ref.scope.hasBinding(newName) || ref.scope.hasReference(newName)) {
      return false;
    }
  }

  return true;
}

module.exports = mangleScope;