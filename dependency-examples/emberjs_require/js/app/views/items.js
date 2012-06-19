define('app/views/items', [
		'text!app/templates/items.html',
		'ember'
	],
	/**
	 * View to render todos items
	 *
	 * @param String items_html, the html view for the `Todos` items
	 * @returns Class
	 */
	function( items_html ) {
		return Ember.View.extend({
			template: Ember.Handlebars.compile( items_html )
		})
	}
);
