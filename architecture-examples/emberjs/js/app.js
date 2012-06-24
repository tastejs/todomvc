(function() {
  'use strict';

    // Controllers
    var Entries = Ember.ArrayProxy.extend({
          store: null,
          content: [],

          createNew: function( value ) {
            if ( !value.trim() ){
              return;
            }
            var todo = this.get( 'store' ).createFromTitle( value );
            this.pushObject( todo );
          },

          pushObject: function( item, ignoreStorage) {
            if ( !ignoreStorage )
              this.get( 'store' ).create( item );
            return this._super( item );
          },

          removeObject: function( item ) {
            item = item.get( 'todo' ) || item;
            this.get( 'store' ).remove( item );
            return this._super( item );
          },

          clearCompleted: function() {
            this.filterProperty(
              'completed', true
            ).forEach( this.removeObject, this );
          },

          total: function() {
            return this.get( 'length' );
          }.property( '@each.length' ),

          remaining: function() {
            return this.filterProperty( 'completed', false ).get( 'length' );
          }.property( '@each.completed' ),

          completed: function() {
            return this.filterProperty( 'completed', true ).get( 'length' );
          }.property( '@each.completed' ),

          allAreDone: function( key, value ) {
            if ( value !== undefined ) {
              this.setEach( 'completed', value );
              return value;
            } else {
              return !!this.get( 'length' ) &&
                this.everyProperty( 'completed', true );
            }
          }.property( '@each.completed' ),

          init: function() {
            this._super();
            // Load items if any upon initialization
            var items = this.get( 'store' ).findAll();
            if ( items.get( 'length' ) ) {
              this.set( '[]', items );
            };
          }
        });


    var TodosController = Entries.extend({
          // New todo input
          inputView: Ember.TextField.create({
            placeholder: 'What needs to be done?',
            elementId: 'new-todo',
            storageBinding: 'Todos.todosController',
            // Bind this to newly inserted line
            insertNewline: function() {
              var value = this.get( 'value' );
              if ( value ) {
                this.get( 'storage' ).createNew( value );
                this.set( 'value', '' );
              }
            }
          }),

          // Stats report
          statsView: Ember.View.create({
            elementId: 'todo-count',
            tagName: 'span',
            contentBinding: 'Todos.todosController',
            remainingBinding: 'Todos.todosController.remaining',
            template: Ember.Handlebars.compile(
              '<strong>{{remaining}}</strong> {{remainingString}} left'
            ),
            remainingString: function() {
              var remaining = this.get( 'remaining' );
              return ( remaining === 1 ? ' item' : ' items' );
            }.property( 'remaining' )
          }),

          // Handle visibility of some elements as items totals change
          visibilityObserver: function() {
            $( '#main, #footer' ).toggle( !!this.get( 'total' ) );
          }.observes( 'total' ),

          // Clear completed tasks button
          clearCompletedButton: Ember.Button.create({
            template: Ember.Handlebars.compile( $('#buttonTemplate').html() ),
            target: 'Todos.todosController',
            action: 'clearCompleted',
            completedCountBinding: 'Todos.todosController.completed',
            elementId: 'clear-completed',
            classNameBindings: 'buttonClass',
            // Observer to update class if completed value changes
            buttonClass: function () {
                if ( !this.get( 'completedCount' ) )
                    return 'hidden';
            }.property( 'completedCount' )
          }),

          // Checkbox to mark all todos done.
          allDoneCheckbox: Ember.Checkbox.create({
            elementId: 'toggle-all', 
            checkedBinding: 'Todos.todosController.allAreDone'
          }),

          // Compile and render the todos view
          todosView: Ember.View.create({
            template: Ember.Handlebars.compile( $('#itemsTemplate').html() )
          }),

          // Todo list item view
          todoView: Ember.View.extend({
            classNames: [ 'view' ],
            doubleClick: function() {
              this.get( 'content' ).set( 'editing', true );
            }
          }),

          // Todo list item editing view
          todoEditor: Ember.TextField.extend({
            storageBinding: 'TodosController', //'Todos.todosController',
            classNames: [ 'edit' ],
            whenDone: function() {
              this.get( 'todo' ).set( 'editing', false );
              if ( !this.get( 'todo' ).get( 'title' ).trim() ) {
               this.get( 'storage' ).removeObject( this.get( 'todo' ) );
              }
            },
            focusOut: function() {
              this.whenDone();
            },
            didInsertElement: function() {
              this.$().focus();
            },
            insertNewline: function() {
              this.whenDone();
            }
          }),

          // Activates the views and other initializations
          init: function() {
            this._super();
            this.get( 'inputView' ).appendTo( 'header' );
            this.get( 'allDoneCheckbox' ).appendTo( '#main' );
            this.get( 'todosView' ).appendTo( '#main' );
            this.get( 'statsView' ).appendTo( '#footer' );
            this.get( 'clearCompletedButton' ).appendTo( '#footer' );
          }
        });
      

    // Models

    var Todo = Ember.Object.extend({
          id: null,
          title: null,
          completed: false,
          // set store reference upon creation instead of creating static bindings
          store: null,
          // Observer that will react on item change and will update the storage
          todoChanged: function() {
            this.get( 'store' ).update( this );
          }.observes( 'title', 'completed' )
        });

    var Store = function( name ) {
          this.name = name;
          var store = localStorage.getItem( this.name );
          this.data = ( store && JSON.parse( store ) ) || {};

          // Save the current state of the **Store** to *localStorage*.
          this.save = function() {
            localStorage.setItem( this.name, JSON.stringify( this.data ) );
          };

          // Wrapper around `this.create`
          // Creates a `Todo` model object out of the title
          this.createFromTitle = function( title ) {
            var todo = Todo.create({
              title: title,
              store: this
            });
            this.create( todo );
            return todo;
          };

          // Store the model inside the `Store`
          this.create = function ( model ) {
            if ( !model.get( 'id' ) )
              model.set( 'id', Date.now() );
            return this.update( model );
          };

          // Update a model by replacing its copy in `this.data`.
          this.update = function( model ) {
            this.data[ model.get( 'id' ) ] = model.getProperties(
              'id', 'title', 'completed'
            );
            this.save();
            return model;
          };

          // Retrieve a model from `this.data` by id.
          this.find = function( model ) {
            var todo = Todo.create( this.data[ model.get( 'id' ) ] );
            todo.set( 'store', this );
            return todo;
          };

          // Return the array of all models currently in storage.
          this.findAll = function() {
            var result = [],
                key;

            for ( key in this.data ) {
              var todo = Todo.create( this.data[ key ] );
              todo.set( 'store', this );
              result.push( todo );
            }

            return result;
          };

          // Delete a model from `this.data`, returning it.
          this.remove = function( model ) {
            delete this.data[ model.get( 'id' ) ];
            this.save();
            return model;
          };
        };
      

    // Initialize App

    var App = Ember.Application.create({

          // Constructor
          init: function() {
            this._super();

            // Initiate main controller
            this.set(
              'todosController',
              TodosController.create({
                store: new Store( 'todos-emberjs' )
              })
            );

          }
        });

    window.Todos = App;
})();
