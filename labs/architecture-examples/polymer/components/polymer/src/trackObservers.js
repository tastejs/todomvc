/* 
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
  // observer tracking
  var trackingTable = new SideTable();
  
  function registerObserver(element, type, name, observer) {
    var o$ = getObserversOfType(element, type, true);
    o$[name.toLowerCase()] = observer;
  }
  
  function unregisterObserver(element, type, name) {
    var $o = getObserversOfType(element, type), lcName = name.toLowerCase();
    if ($o && $o[lcName]) {
      //console.log('remove observer: %s, %s', type, name);
      $o[lcName].close();
      $o[lcName] = null;
      return true;
    }
  }
  
  function unregisterObserversOfType(element, type) {
    var $o = getObserversOfType(element, type);
    if ($o) {
      Object.keys($o).forEach(function(key) {
        unregisterObserver(element, type, key);
      });
    }
  }
  
  function getObserversOfType(element, type, force) {
    var b$ = trackingTable.get(element);
    if (force) {
      if (!b$) {
        trackingTable.set(element, b$ = {});
      }
      if (!b$[type]) {
        b$[type] = {};   
      }
    }
    return b$ && b$[type];
  }

  // exports
  Polymer.registerObserver = registerObserver;
  Polymer.unregisterObserver = unregisterObserver;
  Polymer.unregisterObserversOfType = unregisterObserversOfType;
  
})();

