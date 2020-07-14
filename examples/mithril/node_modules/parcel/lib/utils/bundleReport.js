"use strict";

const path = require('path');

const prettifyTime = require('./prettifyTime');

const logger = require('@parcel/logger');

const filesize = require('filesize');

const LARGE_BUNDLE_SIZE = 1024 * 1024;
const DEFAULT_NUM_LARGE_ASSETS = 10;
const COLUMNS = [{
  align: 'left'
}, // name
{
  align: 'right'
}, // size
{
  align: 'right' // time

}];

function bundleReport(mainBundle, detailed = false) {
  // Get a list of bundles sorted by size
  let bundles = Array.from(iterateBundles(mainBundle)).sort((a, b) => b.totalSize - a.totalSize);
  let rows = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let bundle = _step.value;
      // Add a row for the bundle
      rows.push([formatFilename(bundle.name, logger.chalk.cyan.bold), logger.chalk.bold(prettifySize(bundle.totalSize, bundle.totalSize > LARGE_BUNDLE_SIZE)), logger.chalk.green.bold(prettifyTime(bundle.bundleTime))]); // If detailed, generate a list of the largest assets in the bundle

      if (detailed && bundle.assets.size > 1) {
        let assets = Array.from(bundle.assets).filter(a => a.type === bundle.type).sort((a, b) => b.bundledSize - a.bundledSize);

        let largestAssets = (() => {
          if (detailed === 'all') {
            return assets;
          }

          return assets.slice(0, isNaN(detailed) || typeof detailed === 'boolean' ? DEFAULT_NUM_LARGE_ASSETS : parseInt(detailed, 10));
        })();

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = largestAssets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            let asset = _step2.value;
            // Add a row for the asset.
            rows.push([(asset == assets[assets.length - 1] ? '└── ' : '├── ') + formatFilename(asset.name, logger.chalk.reset), logger.chalk.dim(prettifySize(asset.bundledSize)), logger.chalk.dim(logger.chalk.green(prettifyTime(asset.buildTime)))]);
          } // Show how many more assets there are

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

        if (assets.length > largestAssets.length) {
          rows.push(['└── ' + logger.chalk.dim(`+ ${assets.length - largestAssets.length} more assets`)]);
        } // If this isn't the last bundle, add an empty row before the next one


        if (bundle !== bundles[bundles.length - 1]) {
          rows.push([]);
        }
      }
    } // Render table

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

  logger.log('');
  logger.table(COLUMNS, rows);
}

module.exports = bundleReport;

function* iterateBundles(bundle) {
  if (!bundle.isEmpty) {
    yield bundle;
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = bundle.childBundles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      let child = _step3.value;
      yield* iterateBundles(child);
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

function prettifySize(size, isLarge) {
  let res = filesize(size);

  if (isLarge) {
    return logger.chalk.yellow(logger.emoji.warning + '  ' + res);
  }

  return logger.chalk.magenta(res);
}

function formatFilename(filename, color = logger.chalk.reset) {
  let dir = path.relative(process.cwd(), path.dirname(filename));
  return logger.chalk.dim(dir + (dir ? path.sep : '')) + color(path.basename(filename));
}