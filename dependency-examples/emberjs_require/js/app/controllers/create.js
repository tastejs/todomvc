/**
 * Controller to handle entry creation
 */
define('app/controllers/create', [
  'Todos',
  ], function(Todos) {
    return Todos.Controllers.Create = Em.Object.create({
      // Instantiate our view from fetched template
      view: Em.TextField.create({
        placeholder: 'What needs to be done?',
        elementId: 'create-todo',
        // Bind this to newly inserted line
        insertNewline: function() {
          var value = this.get('value');
          if (value) {
            Todos.Models.Store.createFromTitle(value);
            this.set('value', '');
          }
        }
      }),
      // Activates view and other initialization
      // Sort of constructor
      activate: function() {
          this.get('view').appendTo('#create-todo');
      }
    });
  }
);
