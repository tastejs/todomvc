define(function(){
  'use strict';
  // trim polyfill
  if ( !String.prototype.trim ) {
    String.prototype.trim = function() {
      return this.replace( /^\s+|\s+$/g, '' );
    };
  }
});
