define('app/models/todo', ['ember'],
  /**
   * Todo entry model
   *
   * @returns Class
   */
  function(){
    return Ember.Object.extend({
      id: null,
      title: null,
      isDone: false,
      // Observer that will react on item change and will update the storage
      todoChanged: function() {
        Todos.Models.Store.update(this);
      }.observes('title', 'isDone')
    });
  }
);
