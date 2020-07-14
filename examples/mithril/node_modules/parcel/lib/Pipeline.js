"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Parser = require('./Parser');

const path = require('path');

const _require = require('@parcel/utils'),
      errorUtils = _require.errorUtils;
/**
 * A Pipeline composes multiple Asset types together.
 */


class Pipeline {
  constructor(options) {
    this.options = options;
    this.parser = new Parser(options);
  }

  process(path, isWarmUp) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let options = _this.options;

      if (isWarmUp) {
        options = Object.assign({
          isWarmUp
        }, options);
      }

      let asset = _this.parser.getAsset(path, options);

      let error = null;
      let generatedMap = {};

      try {
        let generated = yield _this.processAsset(asset);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = generated[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let rendition = _step.value;
            generatedMap[rendition.type] = rendition.value;
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
      } catch (err) {
        error = errorUtils.errorToJson(err);
        error.fileName = path;
      }

      return {
        id: asset.id,
        dependencies: Array.from(asset.dependencies.values()),
        generated: generatedMap,
        sourceMaps: asset.sourceMaps,
        error: error,
        hash: asset.hash,
        cacheData: asset.cacheData
      };
    })();
  }

  processAsset(asset) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        yield asset.process();
      } catch (err) {
        throw asset.generateErrorMessage(err);
      }

      let inputType = path.extname(asset.name).slice(1);
      let generated = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this2.iterateRenditions(asset)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let rendition = _step2.value;
          let type = rendition.type,
              value = rendition.value;

          if (typeof value !== 'string' || rendition.final) {
            generated.push(rendition);
            continue;
          } // Find an asset type for the rendition type.
          // If the asset is not already an instance of this asset type, process it.


          let AssetType = _this2.parser.findParser(asset.name.slice(0, -inputType.length) + type, true);

          if (!(asset instanceof AssetType)) {
            let opts = Object.assign({}, asset.options, {
              rendition
            });
            let subAsset = new AssetType(asset.name, opts);
            subAsset.id = asset.id;
            subAsset.contents = value;
            subAsset.dependencies = asset.dependencies;
            subAsset.cacheData = Object.assign(asset.cacheData, subAsset.cacheData);
            let processed = yield _this2.processAsset(subAsset);

            if (rendition.meta) {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = processed[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  let res = _step4.value;
                  res.meta = rendition.meta;
                  res.isMain = res.type === subAsset.type;
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
            }

            generated = generated.concat(processed);
          } else {
            generated.push(rendition);
          }
        } // Post process. This allows assets a chance to modify the output produced by sub-asset types.

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

      try {
        generated = yield asset.postProcess(generated);
      } catch (err) {
        throw asset.generateErrorMessage(err);
      }

      let hasMap = false;
      let sourceMaps = {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = generated[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let rendition = _step3.value;

          if (rendition.map && rendition.type == asset.type) {
            sourceMaps[rendition.type] = rendition.map;
            hasMap = true;
          }
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

      if (hasMap) {
        asset.sourceMaps = sourceMaps;
      }

      asset.generated = generated;
      asset.hash = yield asset.generateHash();
      return generated;
    })();
  }

  *iterateRenditions(asset) {
    if (Array.isArray(asset.generated)) {
      return yield* asset.generated;
    }

    if (typeof asset.generated === 'string') {
      return yield {
        type: asset.type,
        value: asset.generated
      };
    } // Backward compatibility support for the old API.
    // Assume all renditions are final - don't compose asset types together.


    for (let type in asset.generated) {
      yield {
        type,
        value: asset.generated[type],
        // for scope hoisting, we need to post process all JS
        final: !(type === 'js' && this.options.scopeHoist)
      };
    }
  }

}

module.exports = Pipeline;