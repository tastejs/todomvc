/**
 * Todo entry model
 */
define('app/models/todo', [
    'ember'
    ], function(Ember){
    return Em.Object.extend({
      id: null,
      title: null,
      isDone: false,
      todoChanged: function() {
        Em.Logger.log('Todo changed:', this);
      }.observes('title', 'isDone')
    });
});
