define('app/views/stats', [
		'text!app/templates/stats.html',
		'ember'
	],
	/**
	 * View to render todos stats
	 *
	 * @param String stats_html, stats indicator view
	 * @returns Class
	 */
	function( stats_html ) {
		return Ember.View.extend({
			elementId: 'todo-count',
			tagName: 'span',
			remainingBinding: 'controller.remaining',
			template: Ember.Handlebars.compile( stats_html ),
			oneLeft: function() {
				return this.get( 'remaining' ) === 1;
			}.observes( 'remaining' )
		})
	}
);
