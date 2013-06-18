/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {

  var log = window.logFlags || {};

  // bind a property in A to a path in B by converting A[property] to a
  // getter/setter pair that accesses B[...path...]
  function bindProperties(inA, inProperty, inB, inPath) {
    log.bind && console.log("[%s]: bindProperties: [%s] to [%s].[%s]",
        inB.localName || 'object', inPath, inA.localName, inProperty);
    // capture A's value if B's value is null or undefined,
    // otherwise use B's value
    var v = PathObserver.getValueAtPath(inB, inPath);
    if (v === null || v === undefined) {
      PathObserver.setValueAtPath(inB, inPath, inA[inProperty]);
    }
    return PathObserver.defineProperty(inA, inProperty, {object: inB, path: inPath});
  }

  // exports
  Polymer.bindProperties = bindProperties;

})();