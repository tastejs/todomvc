describeComponent('app/js/ui/stats', function () {
	'use strict';

	beforeEach(function () {
		setupComponent(readFixtures('footer.html'));
	});

	it('renders when stats change', function () {
		var data = {
			all: 3,
			remaining: 2,
			completed: 1,
			filter: ''
		};
		expect(this.component.$node).toBeEmpty();
		$(document).trigger('dataStatsCounted', data);
		expect(this.component.$node).not.toBeEmpty();
		expect(this.component.$node).toBeVisible();
	});

	it('is hidden when data is empty', function () {
		var data = {
			all: 0,
			remaining: 0,
			completed: 0,
			filter: ''
		};
		$(document).trigger('dataStatsCounted', data);
		expect(this.component.$node).toBeHidden();
	});

	it('hides clear-completed with no completed items', function () {
		var data = {
			all: 2,
			remaining: 2,
			completed: 0,
			filter: ''
		};
		this.component.render(null, data);
		expect(this.component.select('clearCompletedSelector').length).toBe(0);
	});

	it('shows clear-completed with completed items', function () {
		var data = {
			all: 2,
			remaining: 1,
			completed: 1,
			filter: ''
		};
		this.component.render(null, data);
		expect(this.component.select('clearCompletedSelector').length).toBe(1);
	});

	it('triggers uiClearRequested on click', function () {
		var data = {
			all: 2,
			remaining: 1,
			completed: 1,
			filter: ''
		};
		spyOnEvent(document, 'uiClearRequested');
		this.component.render(null, data);
		this.component.trigger(this.component.attr.clearCompletedSelector, 'click');
		expect('uiClearRequested').toHaveBeenTriggeredOn(this.component);
	});
});
