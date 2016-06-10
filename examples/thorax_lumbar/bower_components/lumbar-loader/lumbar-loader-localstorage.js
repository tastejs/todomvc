/*jshint evil: true */
/*global LocalCache, exports, loadResources, lumbarLoader */
lumbarLoader.loadJS = function(moduleName, callback) {
  return loadResources(moduleName, 'js', callback, function(href, callback) {
    loadViaXHR(href, function(err, data) {
      if (!err && data) {
        try {
          window.eval(data);
          callback();
          return true;
        } catch (err) {
          /* NOP */
        }
      }

      callback(err ? 'connection' : 'javascript');
    });
    return 1;
  }).length;
};
lumbarLoader.loadCSS = function(moduleName, callback) {
  return loadResources(moduleName, 'css', callback, function(href) {
    loadViaXHR(href, function(err, data) {
      data && exports.loader.loadInlineCSS(data);
      callback(err ? 'connecion' : undefined);
      return !err;
    });
    return 1;
  }).length;
};

function loadViaXHR(href, callback) {
  var cache = LocalCache.get(href);
  if (cache) {
    // Dump off the stack to prevent any errors with loader module interaction
    setTimeout(function() {
      callback(undefined, cache);
    }, 0);

    return;
  }

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      var success = (xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && xhr.responseText);

      if (callback(!success, xhr.responseText)) {
        LocalCache.store(href, xhr.responseText, LocalCache.TTL.WEEK);
      }
    }
  };

  xhr.open('GET', href, true);
  xhr.send(null);
}
