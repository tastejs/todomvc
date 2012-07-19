define('app/views/filters', [
		'text!app/templates/filters.html',
		'ember'
	],
	/**
	 * View to render filter links
	 *
	 * @param String filters_html, filter links html view
	 * @returns Class
	 */
	function( filters_html ) {
		return Ember.View.extend({
			template: Ember.Handlebars.compile( filters_html )
		})
	}
);
