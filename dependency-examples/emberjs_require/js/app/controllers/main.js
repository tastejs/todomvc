/**
 * Main controller
 */
define('app/controllers/main', [
  'app/controllers/entries',
  'text!app/views/clear_button.html',
  'text!app/views/item.html'
  ], function(Entries, button_html, item_html) {
    return Entries.extend({
      // New todo input
      inputView: Ember.TextField.create({
        placeholder: 'What needs to be done?',
        elementId: 'create-todo',
        // Bind this to newly inserted line
        insertNewline: function() {
          var value = this.get('value');
          if (value) {
            this.createNew(value);
            this.set('value', '');
          }
        }
      }),

      // Stats label
      statsView: Ember.View.create({
        elementId: 'todo-stats',
        contentBinding: 'Todos.Controllers.Main',
        remainingBinding: 'Todos.Controllers.Main.remaining',
        remainingString: function() {
          var remaining = this.get('remaining');
          return remaining + (remaining === 1 ? " item" : " items");
        }.property('remaining'),
        template: Ember.Handlebars.compile('{{remainingString}} left')
      }),

      // Clear completed tasks button
      clearCompletedButton: Ember.Button.create({
        template: Ember.Handlebars.compile(button_html),
        completedBinding: 'Todos.Controller.Entries.completed',
        classNameBindings: 'clearCompletedButton',
        // Observer to update content if completed value changes
        completedString: function() {
          var completed = Todos.Controllers.Main.get('completed');
          return completed + " completed" + (completed === 1 ? " item" : " items");
        }.property('completed'),
        // Observer to update class if completed value changes
        completedButtonClass: function () {
            if (Todos.Controllers.Main.get('completed') < 1)
                return 'hidden';
            else
                return '';
        }.property('completed')
      }),

      allDoneCheckbox: Ember.Checkbox.create({
        classNames: ['mark-all-done'],
        title: "Mark all as complete",
        valueBinding: 'Todos.Controllers.Main.allAreDone'
      }),

      todosCollection: Ember.CollectionView.create({
        elementId: "todo-list",
        contentBinding: "Todos.Controllers.Main",
        tagName: "ul",
        itemClassBinding: "content.isDone",
        itemView: Ember.View.create({
          tagName: 'em',
          template: Ember.Handlebars.compile(item_html),
        })
      }), 

      // Activates the views and other initializations
      init: function() {
        this._super();
        this.get('inputView').appendTo('#create-todo');
        this.get('allDoneCheckbox').appendTo('#stats-area');
        this.get('todosCollection').appendTo('#todos');
        this.get('statsView').appendTo('#todoapp .content');
        this.get('clearCompletedButton').appendTo('#todo-stats');
      }
    });
  }
);
