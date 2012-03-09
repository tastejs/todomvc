define('app/controllers/entries', ['ember'],
  /**
   * Entries controller
   *
   * @returns Class
   */
  function() {
    return Ember.ArrayProxy.extend({
      content: [],

      createNew: function(value) {
        var todo = Todos.Models.Store.createFromTitle(value);
        this.pushObject(todo);

        var stats = document.getElementById('stats-area');
        if (stats.style.display=='block')
          stats.style.display = 'inline';
        else
          stats.style.display = 'block';
      },

      pushObject: function (item, ignoreStorage) {
        if (!ignoreStorage)
          Todos.Models.Store.create(item);
        return this._super(item);
      },

      removeObject: function (item) {
        Todos.Models.Store.remove(item);
        return this._super(item);
      },

      clearCompleted: function() {
        this.filterProperty('isDone', true).forEach(this.removeObject, this);
      },

      remaining: function() {
        return this.filterProperty('isDone', false).get('length');
      }.property('@each.isDone'),

      completed: function() {
        return this.filterProperty('isDone', true).get('length');
      }.property('@each.isDone'),

      allAreDone: function(key, value) {
        if (value !== undefined) {
          this.setEach('isDone', value);

          return value;
        } else {
          return !!this.get('length') && this.everyProperty('isDone', true);
        }
      }.property('@each.isDone'),

    });
  }
);
