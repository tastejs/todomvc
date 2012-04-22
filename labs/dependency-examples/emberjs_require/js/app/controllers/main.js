define('app/controllers/main', [
    'app/controllers/entries',
    'text!app/views/clear_button.html',
    'text!app/views/items.html'
  ], 
  /**
   * Main controller
   *
   * Main controller inherits the `Entries` class
   * which is an `ArrayProxy` linked with the `Store` model
   *
   * @param Class Entries, the Entries class
   * @param String button_html, the html view for the clearCompletedButton
   * @param String items_html, the html view for the `Todos` items
   * @returns Class
   */
  function(Entries, button_html, items_html) {
    return Entries.extend({
      // New todo input
      inputView: Ember.TextField.create({
        placeholder: 'What needs to be done?',
        elementId: 'new-todo',
        storageBinding: 'Todos.Controllers.main',
        // Bind this to newly inserted line
        insertNewline: function() {
          var value = this.get('value');
          if (value) {
            this.get('storage').createNew(value);
            this.set('value', '');
          }
        }
      }),

      // Stats label
      statsView: Ember.View.create({
        elementId: 'todo-stats',
        contentBinding: 'Todos.Controllers.main',
        remainingBinding: 'Todos.Controllers.main.remaining',
        remainingString: function() {
          var remaining = this.get('remaining');
          return remaining + (remaining === 1 ? " item" : " items");
        }.property('remaining'),
        template: Ember.Handlebars.compile('{{remainingString}} left')
      }),

      // Clear completed tasks button
      clearCompletedButton: Ember.Button.create({
        template: Ember.Handlebars.compile(button_html),
        target: 'Todos.Controllers.main',
        action: 'clearCompleted',
        completedBinding: 'Todos.Controllers.main.completed',
        classNameBindings: 'buttonClass',
        // Observer to update content if completed value changes
        buttonString: function() {
          var completed = this.get('completed');
          return completed + " completed" + (completed === 1 ? " item" : " items");
        }.property('completed'),
        // Observer to update class if completed value changes
        buttonClass: function () {
            if (this.get('completed') < 1)
                return 'hidden';
            else
                return '';
        }.property('completed')
      }),

      // Checkbox to mark all todos done.
      allDoneCheckbox: Ember.Checkbox.create({
        classNames: ['mark-all-done'],
        title: "Mark all as complete",
        valueBinding: 'Todos.Controllers.main.allAreDone'
      }),

      // Compile and render the todos view
      todosView: Ember.View.create({
        template: Ember.Handlebars.compile(items_html)
      }), 

      // Activates the views and other initializations
      init: function() {
        this._super();
        this.get('inputView').appendTo('#create-todo');
        this.get('allDoneCheckbox').appendTo('#stats-area');
        this.get('todosView').appendTo('#todos');
        this.get('statsView').appendTo('#todoapp .content');
        this.get('clearCompletedButton').appendTo('#todo-stats');
      }
    });
  }
);
