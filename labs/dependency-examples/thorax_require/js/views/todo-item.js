define([
	'jquery',
	'underscore',
	'backbone',
	'thorax',
	'common'
], function( $, _, Backbone, Common ) {

	// This view has no template assigned in the class definition
	// as it will recieve the capture block from the collection
	// helper in templates/app.handlebars as it's template

	return 	Thorax.View.extend({
		name: 'todo-item',

		//... is a list tag.
		tagName:  'li',

		// The DOM events specific to an item.
		events: {
			'click .toggle':	'toggleCompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keypress .edit':	'updateOnEnter',
			'blur .edit':		'close',
			// The "rendered" event is triggered by Thorax each time render()
			// is called and the result of the template has been appended
			// to the View's $el
			rendered: function() {
				this.$el.toggleClass( 'completed', this.model.get('completed') );
			}
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function() {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function() {
			this.$el.addClass('editing');
			this.$('.edit').focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function() {
			var value = this.$('.edit').val().trim();

			if ( value ) {
				this.model.save({ title: value });
			} else {
				this.clear();
			}

			this.$el.removeClass('editing');
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function( e ) {
			if ( e.which === Common.ENTER_KEY ) {
				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function() {
			this.model.destroy();
		}
	});

});
