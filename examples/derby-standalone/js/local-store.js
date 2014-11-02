(function(global) {
  'use strict';

  global.LocalStore = LocalStore;

  function LocalStore(key, model) {
    // The key name in localStorage
    this.key = key;
    // A scoped model to sync with the localStorage key
    this.model = model;
    // Flag used to avoid infinite loop with saving to localStorage causing
    // event in another client, causing save, causing event, etc.
    this.disableSave = false;
  }

  LocalStore.prototype.init = function(page) {
    // Load the initial state
    var value = localStorage.getItem(this.key);
    this.update(value);
    var self = this;

    // Save the full model state to localStorage on any model change
    this.model.on('all', '**', function() {
      if (self.disableSave) return;
      var value = JSON.stringify(self.model.get());
      localStorage.setItem(self.key, value);
    });

    // When another window modifies the localStorage key, update the model
    page.dom.on('storage', window, function(e) {
      if (e.key !== self.key) return;
      self.update(e.newValue);
    });
  };

  // Modify the model to sync with a JSON string
  LocalStore.prototype.update = function(value) {
    this.disableSave = true;
    var data = JSON.parse(value);
    this.model.setDiffDeep(data);
    this.disableSave = false;
  };

})(this);
