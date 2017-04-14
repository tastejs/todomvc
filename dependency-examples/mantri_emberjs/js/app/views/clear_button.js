goog.provide('Todos.views.ClearButton');

/**
 * View to clear completed tasks
 *
 * @param String button_html, the html for view
 * @returns Class
 */
Todos.views.ClearButton = Ember.View.extend({
	entriesBinding: 'controller.namespace.entriesController',
  templateName: 'clear_button',
	classNameBindings: 'buttonClass',
	buttonClass: function () {
		if ( !this.getPath( 'entries.completed' ) )
			return 'hidden';
	}.property( 'entries.completed' )
});
