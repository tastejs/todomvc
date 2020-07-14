"use strict";

const t = require('@babel/types');

function rename(scope, oldName, newName) {
  if (oldName === newName) {
    return;
  }

  let binding = scope.getBinding(oldName);

  if (!binding) {
    throw new Error("'" + oldName + "' is not defined");
  } // Rename all constant violations


  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = binding.constantViolations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let violation = _step.value;
      let bindingIds = violation.getBindingIdentifierPaths(true, false);

      for (let name in bindingIds) {
        if (name === oldName) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = bindingIds[name][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              let idPath = _step3.value;
              idPath.node.name = newName;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }
    } // Rename all references

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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = binding.referencePaths[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      let path = _step2.value;

      if (t.isExportSpecifier(path.parent) && path.parentPath.parent.source) {
        continue;
      }

      if (path.node.name === oldName) {
        path.node.name = newName;
      }
    } // Rename binding identifier, and update scope.

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  scope.removeOwnBinding(oldName);
  scope.bindings[newName] = binding;
  binding.identifier.name = newName;
}

module.exports = rename;