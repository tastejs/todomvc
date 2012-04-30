(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.FooterViewModel = function(todos) {
    this.collection_observable = kb.collectionObservable(todos);
    this.remaining_count = ko.computed(__bind(function() {
      return this.collection_observable.collection().remainingCount();
    }, this));
    this.remaining_text = ko.computed(__bind(function() {
      return "" + (this.collection_observable.collection().remainingCount() === 1 ? 'item' : 'items') + " left";
    }, this));
    this.clear_text = ko.computed(__bind(function() {
      var count;
      count = this.collection_observable.collection().completedCount();
      if (count) {
        return "Clear " + count + " completed " + (count === 1 ? 'item' : 'items');
      } else {
        return '';
      }
    }, this));
    this.onDestroyCompleted = __bind(function() {
      return todos.destroyCompleted();
    }, this);
    return this;
  };
}).call(this);
