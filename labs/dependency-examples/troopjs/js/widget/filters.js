define( [ 'troopjs-core/component/widget', 'jquery' ], function FiltersModule(Widget, $) {

	return Widget.extend({
		'hub:memory/route': function onRoute(topic, uri) {
			this.publish('todos/filter', uri.source);
		},

		'hub:memory/todos/filter': function onFilter(topic, filter) {
			filter = filter || '/';

			// Update UI
			$('a[href^="#"]')
				.removeClass('selected')
				.filter('[href="#' + filter + '"]')
				.addClass('selected');
		}
	});
});
