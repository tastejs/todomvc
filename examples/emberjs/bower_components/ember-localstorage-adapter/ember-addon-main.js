'use strict';

var path = require('path');
var fs = require('fs');

module.exports = {
  name: 'Ember Localstorage Adapter',
  treeFor: function(name) {
    if (name !== 'vendor') { return; }

    var treePath =  path.join(__dirname, '..', 'ember-localstorage-adapter');

    var namespacedPath = path.join(treePath, 'ember-localstorage-adapter');

    if(!fs.existsSync(namespacedPath)) {
      fs.mkdirSync(namespacedPath);
    }

    fs.writeFileSync(
      path.join(namespacedPath, 'localstorage_adapter.js'),
      fs.readFileSync(path.join(treePath, 'localstorage_adapter.js'), {encoding: 'utf8'})
    );

    return unwatchedTree(treePath);
  },
  included: function(app){
    this.app = app;
    this.app.import('vendor/ember-localstorage-adapter/localstorage_adapter.js');
  }
};

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
};
