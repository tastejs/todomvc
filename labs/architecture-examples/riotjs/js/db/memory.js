"use strict";

function DB() {
  var store = {};

  return {
    get: function() { return store; },
    put: function(data) { store = data; }
  };
};
