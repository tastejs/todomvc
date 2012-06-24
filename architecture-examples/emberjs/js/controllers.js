(function( app ) {
  'use strict';

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


        app.TodosController = TodosController;

})( window.Todos );