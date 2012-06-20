define('app/views/clear_button', [
		'text!app/templates/clear_button.html',
		'ember'
	],
	/**
	 * View to clear completed tasks
	 *
	 * @param String button_html, the html for view
	 * @returns Class
	 */
	function( button_html ) {
		return Ember.View.extend({
			template: Ember.Handlebars.compile( button_html ),
			completedBinding: 'controller.completed',
			elementId: 'clear-completed',
			classNameBindings: 'buttonClass',
			// Observer to update class if completed value changes
			buttonClass: function () {
				if ( !this.get( 'completed' ) )
					return 'hidden';
			}.property( 'completed' )
		})
	}
);
