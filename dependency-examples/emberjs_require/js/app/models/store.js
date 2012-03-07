/**
 * Todo entries storage model
 */
define('app/models/store', [
  'ember',
  'app/models/todo'
  ], function(Ember, Todo){
    // Our Store is represented by a single JS object in *localStorage*.
    // Create it with a meaningful name, like the name you'd give a table.
    return function(name) {
      this.name = name;
      var store = localStorage.getItem(this.name);
      this.data = (store && JSON.parse(store)) || {};

      // Save the current state of the **Store** to *localStorage*.
      this.save = function() {
        localStorage.setItem(this.name, JSON.stringify(this.data));
      };

      this.createFromTitle = function(title) {
        var todo = Todo.create({title: title});
        this.create(todo);
      },

      this.create = function (model) {
        if (!model.get('id')) model.set('id', Date.now());
        return this.update(model);
      };

      // Update a model by replacing its copy in `this.data`.
      this.update = function(model) {
        this.data[model.get('id')] = model.getProperties('id', 'title', 'isDone');
        this.save();
        return model;
      };

      // Retrieve a model from `this.data` by id.
      this.find = function(model) {
        return Todos.Todo.create(this.data[model.get('id')]);
      };

      // Return the array of all models currently in storage.
      this.findAll = function() {
        var result = [];
        for (var key in this.data) {
          var todo = Todo.create(this.data[key]);
          result.push(todo);
        }

        return result;
      };

      // Delete a model from `this.data`, returning it.
      this.remove = function(model) {
        delete this.data[model.get('id')];
        this.save();
        return model;
      };
    };
  }
);
