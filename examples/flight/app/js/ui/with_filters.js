/*global define, $ */
'use strict';

define(function () {
	return function withFilters() {
		this.attributes({
			filterSelector: '#filters a'
		});

		this.chooseFilter = function (e, data) {
			var filter = data.el.hash.slice(2);

			this.select('filterSelector').removeClass('selected');
			$(data.el).addClass('selected');
			this.trigger('uiFilterRequested', { filter: filter });
		};

		this.markSelected = function (filter) {
			this.$node.find('[href="#/' + filter + '"]').addClass('selected');
		};

		this.after('initialize', function () {
			this.on('click', { filterSelector: this.chooseFilter });
		});
	};
});
