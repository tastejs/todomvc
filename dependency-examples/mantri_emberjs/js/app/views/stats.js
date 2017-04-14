goog.provide('Todos.views.Stats');

/**
 * View to render todos stats
 *
 * @param String stats_html, stats indicator view
 * @returns Class
 */
Todos.views.Stats = Ember.View.extend({
	entriesBinding: 'controller.namespace.entriesController',
	elementId: 'todo-count',
	tagName: 'span',
	templateName: 'stats',
	oneLeft: function() {
		return this.getPath( 'entries.remaining' ) === 1;
	}.property( 'entries.remaining' )
});
