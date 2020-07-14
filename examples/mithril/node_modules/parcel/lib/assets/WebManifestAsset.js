"use strict";

const Asset = require('../Asset');

class WebManifestAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'webmanifest';
  }

  parse(content) {
    return JSON.parse(content);
  }

  collectDependencies() {
    if (Array.isArray(this.ast.icons)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.ast.icons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let icon = _step.value;
          icon.src = this.addURLDependency(icon.src);
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

    if (Array.isArray(this.ast.screenshots)) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.ast.screenshots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let shot = _step2.value;
          shot.src = this.addURLDependency(shot.src);
        }
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
    }

    if (this.ast.serviceworker && this.ast.serviceworker.src) {
      this.ast.serviceworker.src = this.addURLDependency(this.ast.serviceworker.src);
    }
  }

  generate() {
    return JSON.stringify(this.ast);
  }

}

module.exports = WebManifestAsset;