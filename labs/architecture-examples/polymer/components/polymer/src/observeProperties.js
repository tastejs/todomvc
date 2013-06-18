/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  //
  // automagic property observation side effects
  // this implementation uses MDV polyfill
  //
  
  // imports
  var log = window.logFlags || {};
  
  var OBSERVE_SUFFIX = 'Changed';
 
  function observeProperties() {
    for (var p in this) {
      observeProperty.call(this, p);
    }
  }
  
  function observeProperty(inName) {
    if (isObservable.call(this, inName)) {
      log.observe && console.log('[' + this.localName + '] watching [' + inName + ']');
      var observer = new PathObserver(this, inName, function(inNew, inOld) {
        log.data && console.log('[%s#%s] watch: [%s] now [%s] was [%s]', this.localName, this.node.id || '', inName, this[inName], inOld);
        propertyChanged.call(this, inName, inOld);
      }.bind(this));
      Polymer.registerObserver(this, 'property', inName, observer);
    }
  }

  function isObservable(inName) {
    return (inName[0] != '_')
        && !(inName in Object.prototype)
        && Boolean(this[inName + OBSERVE_SUFFIX]);
  }
  
  function propertyChanged(inName, inOldValue) {
    //log.data && console.log('[%s#%s] propertyChanged: [%s] now [%s] was [%s]', this.node.localName, this.node.id || '', inName, this[inName], inOldValue);
    var fn = inName + OBSERVE_SUFFIX;
    if (this[fn]) {
      this[fn](inOldValue);
    }
  }
  
  // exports
  Polymer.observeProperties = observeProperties;

})();