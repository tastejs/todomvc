(function( Todos) {
  'use strict';

     var App = Ember.Application.create({

              // Constructor
              init: function() {
                this._super();

                // Initiate main controller
                this.set(
                  'todosController',
                  Todos.TodosController.create({
                    store: new Todos.Store( 'todos-emberjs' )
                  })
                );

              }
            });

      window.Todos = App;

})( window.Todos );