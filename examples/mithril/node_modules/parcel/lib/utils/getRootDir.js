"use strict";

const path = require('path');

function getRootDir(files) {
  let cur = null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let file = _step.value;
      let parsed = path.parse(file);

      if (!cur) {
        cur = parsed;
      } else if (parsed.root !== cur.root) {
        // bail out. there is no common root.
        // this can happen on windows, e.g. C:\foo\bar vs. D:\foo\bar
        return process.cwd();
      } else {
        // find the common path parts.
        let curParts = cur.dir.split(path.sep);
        let newParts = parsed.dir.split(path.sep);
        let len = Math.min(curParts.length, newParts.length);
        let i = 0;

        while (i < len && curParts[i] === newParts[i]) {
          i++;
        }

        cur.dir = i > 1 ? curParts.slice(0, i).join(path.sep) : cur.root;
      }
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

  return cur ? cur.dir : process.cwd();
}

module.exports = getRootDir;