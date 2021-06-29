'use strict';

var pathToFileURL = require('url').pathToFileURL;

var importESM;
try {
  // Node.js <10 errors out with a SyntaxError when loading a script that uses import().
  // So a function is dynamically created to catch the SyntaxError at runtime instead of parsetime.
  // That way we can keep supporting all Node.js versions all the way back to 0.10.
  importESM = new Function('id', 'return import(id);');
} catch (e) {
  importESM = null;
}

function requireOrImport(path, callback) {
  var err = null;
  var cjs;
  try {
    cjs = require(path);
  } catch (e) {
    if (pathToFileURL && importESM && e.code === 'ERR_REQUIRE_ESM') {
      // This is needed on Windows, because import() fails if providing a Windows file path.
      var url = pathToFileURL(path);
      importESM(url).then(function(esm) { callback(null, esm); }, callback);
      return;
    }
    err = e;
  }
  process.nextTick(function() { callback(err, cjs); });
}

module.exports = requireOrImport;
