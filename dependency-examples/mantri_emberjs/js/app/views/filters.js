goog.provide('Todos.views.Filters');

/**
 * View to render filter links
 *
 * @param String filters_html, filter links html view
 * @returns Class
 */
Todos.views.Filters = Ember.View.extend({
  templateName: 'filters',
	filterBinding: 'controller.namespace.entriesController.filterBy',
	isAll: function() {
		return Ember.empty( this.get('filter') );
	}.property( 'filter' ),
	isActive: function() {
		return this.get('filter') === 'active';
	}.property('filter'),
	isCompleted: function() {
		return this.get('filter') === 'completed';
	}.property('filter')
});
