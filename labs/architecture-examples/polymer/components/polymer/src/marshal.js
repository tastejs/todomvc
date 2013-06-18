/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

//
// reference marshalling
//

// locate nodes with id and store references to them in this.$ hash
Polymer.marshalNodeReferences = function(inRoot) {
  // establish $ instance variable
  var $ = this.$ = this.$ || {};
  // populate $ from nodes with ID from the LOCAL tree
  if (inRoot) {
    var nodes = inRoot.querySelectorAll("[id]");
    forEach(nodes, function(n) {
      $[n.id] = n;
    });
  }
};