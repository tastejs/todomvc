var filters_html = require('raw!./templates/filters.html');

/**
 * View to render filter links
 */
module.exports = Ember.View.extend({
	template: Ember.Handlebars.compile( filters_html ),
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
