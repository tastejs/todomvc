define('app/controllers/todos', [
		'app/controllers/entries',
		'text!app/views/clear_button.html',
		'text!app/views/items.html'
	],
	/**
	 * Todos controller
	 *
	 * Main controller inherits the `Entries` class
	 * which is an `ArrayProxy` linked with the `Store` model
	 *
	 * @param Class Entries, the Entries class
	 * @param String button_html, the html view for the clearCompletedButton
	 * @param String items_html, the html view for the `Todos` items
	 * @returns Class
	 */
	function( Entries, button_html, items_html ) {
		return Entries.extend({
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
				template: Ember.Handlebars.compile( button_html ),
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
				template: Ember.Handlebars.compile( items_html )
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
				storageBinding: 'Todos.todosController',
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
	}
);
