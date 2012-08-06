var stats_html = require('raw!./templates/stats.html');

/**
 * View to render todos stats
 */
module.exports = Ember.View.extend({
	entriesBinding: 'controller.namespace.entriesController',
	elementId: 'todo-count',
	tagName: 'span',
	template: Ember.Handlebars.compile( stats_html ),
	oneLeft: function() {
		return this.getPath( 'entries.remaining' ) === 1;
	}.property( 'entries.remaining' )
})
