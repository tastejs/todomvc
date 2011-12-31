(function() {
  var storageName = 'todos-spine';

  if (typeof Spine === "undefined" || Spine === null) {
    Spine = require('spine');
  }
  Spine.Model.Local = {
    extended: function() {
      this.change(this.saveLocal);
      return this.fetch(this.loadLocal);
    },
    saveLocal: function() {
      var result;
      result = JSON.stringify(this);
      return localStorage[storageName] = result;
    },
    loadLocal: function() {
      var result;
      result = localStorage[storageName];
      return this.refresh(result || [], {
        clear: true
      });
    }
  };
  if (typeof module !== "undefined" && module !== null) {
    module.exports = Spine.Model.Local;
  }
}).call(this);
