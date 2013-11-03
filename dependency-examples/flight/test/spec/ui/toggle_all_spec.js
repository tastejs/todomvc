describeComponent('app/js/ui/toggle_all', function () {
	'use strict';

	beforeEach(function () {
		setupComponent(readFixtures('toggle_all.html'));
	});

	it('check the checkbox w/o remaining', function () {
		var data = {
			all: 2,
			remaining: 0,
			completed: 2,
			filter: ''
		};
		$(document).trigger('dataStatsCounted', data);
		expect(this.component.$node).toBeChecked();
	});

	it('uncheck the checkbox w/ remaining', function () {
		var data = {
			all: 2,
			remaining: 1,
			completed: 1,
			filter: ''
		};
		$(document).trigger('dataStatsCounted', data);
		expect(this.component.$node).not.toBeChecked();
	});
});

