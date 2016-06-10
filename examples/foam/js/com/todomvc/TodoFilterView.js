(function () {
	/* global CLASS, TRUE, NOT */
	'use strict';
	// Needed to massage the HTML to fit TodoMVC spec; it works without this.
	CLASS({
		package: 'com.todomvc',
		name: 'TodoFilterView',
		extendsModel: 'foam.ui.ChoiceListView',
		requires: ['com.todomvc.Todo'],
		properties: [
			{
				name: 'choices',
				factory: function () {
					return [[TRUE, 'All'], [NOT(this.Todo.COMPLETED), 'Active'], [this.Todo.COMPLETED, 'Completed']];
				}
			}
		],
		methods: [
			function choiceToHTML(id, choice) {
				var self = this;
				this.setClass('selected', function () { return self.text === choice[1]; }, id);
				return '<li><a id="' + id + '" class="choice">' + choice[1] + '</a></li>';
			}
		]
	});
})();
