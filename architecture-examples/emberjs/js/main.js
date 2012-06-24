(function( app ) {
  'use strict';
  
     var App = Ember.Application.create({

              // Constructor
              init: function() {
                this._super();

                // Initiate main controller
                this.set(
                  'todosController',
                  window.Todos.TodosController.create({
                    store: new window.Todos.Store( 'todos-emberjs' )
                  })
                );

              }
            });

        window.Todos = App;
})();