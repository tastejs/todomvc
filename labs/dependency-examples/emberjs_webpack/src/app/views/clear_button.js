var button_html = require('raw!./templates/clear_button.html');

/**
 * View to clear completed tasks
 */
module.exports = Ember.View.extend({
	entriesBinding: 'controller.namespace.entriesController',
	template: Ember.Handlebars.compile( button_html ),
	classNameBindings: 'buttonClass',
	buttonClass: function () {
		if ( !this.getPath( 'entries.completed' ) )
			return 'hidden';
	}.property( 'entries.completed' )
})
