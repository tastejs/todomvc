(function() { "use strict";
  // The route only works in the browser
  if(typeof window === "undefined") return;
  window.$ = window.$ || {};

  (function(win, $){
    if($.route) return;

    // cross browser popstate
    var currentHash,
      fn = $.observable({}),
      listen = win.addEventListener,
      doc = document;

    function pop(hash) {
      hash = hash.type ? location.hash : hash;
      if (hash != currentHash) fn.trigger("pop", hash);
      currentHash = hash;
    }

    if (listen) {
      listen("popstate", pop, false);
      doc.addEventListener("DOMContentLoaded", pop, false);

    } else {
      doc.attachEvent("onreadystatechange", function() {
        if (doc.readyState === "complete") pop("");
      });
    }

    // Change the browser URL or listen to changes on the URL
    $.route = function(to) {
      // listen
      if (typeof to === "function") return fn.on("pop", to);

      // fire
      if (history.pushState) history.pushState(0, 0, to);
      pop(to);
    };

  })(window, window.$);
})();
