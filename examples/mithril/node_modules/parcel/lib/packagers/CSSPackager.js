"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const path = require('path');

const Packager = require('./Packager');

const lineCounter = require('../utils/lineCounter');

const urlJoin = require('../utils/urlJoin');

class CSSPackager extends Packager {
  start() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.lineOffset = 0;
      _this.columnOffset = 0;
    })();
  }

  addAsset(asset) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let css = asset.generated.css || ''; // Figure out which media types this asset was imported with.
      // We only want to import the asset once, so group them all together.

      let media = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = asset.parentDeps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let dep = _step.value;

          if (!dep.media) {
            // Asset was imported without a media type. Don't wrap in @media.
            media.length = 0;
            break;
          } else {
            media.push(dep.media);
          }
        } // If any, wrap in an @media block

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

      if (media.length) {
        css = `@media ${media.join(', ')} {\n${css.trim()}\n}\n`;
      }

      if (asset.options.sourceMaps) {
        let lineCount = lineCounter(css);

        if (lineCount == 1) {
          _this2.bundle.addOffset(asset, _this2.lineOffset, _this2.columnOffset);

          yield _this2.write(css);
          _this2.columnOffset += css.length;
        } else {
          const lines = css.split('\n');

          if (_this2.columnOffset == 0) {
            _this2.bundle.addOffset(asset, _this2.lineOffset, 0);

            yield _this2.write(css + '\n');
          } else {
            _this2.columnOffset = 0;

            _this2.bundle.addOffset(asset, _this2.lineOffset + 1, 0);

            _this2.columnOffset = lines[lines.length - 1].length;
            yield _this2.write('\n' + css);
          }

          _this2.lineOffset += lineCount;
        }
      } else {
        yield _this2.write(css);
      }
    })();
  }

  end() {
    var _this3 = this,
        _superprop_callEnd = (..._args) => super.end(..._args);

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this3.options.sourceMaps) {
        // Add source map url if a map bundle exists
        let mapBundle = _this3.bundle.siblingBundlesMap.get('map');

        if (mapBundle) {
          let mapUrl = urlJoin(_this3.options.publicURL, path.basename(mapBundle.name));
          yield _this3.write(`\n/*# sourceMappingURL=${mapUrl} */`);
        }
      }

      yield _superprop_callEnd();
    })();
  }

}

module.exports = CSSPackager;