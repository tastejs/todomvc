describeComponent('app/js/data/stats', function () {
	'use strict';

	describe('recount without datastore', function () {
		beforeEach(function () {
			setupComponent({
				dataStore: new mocks.DataStore([])
			});
		});

		afterEach(function () {
			localStorage.clear();
		});

		it('should trigger a dataStatsCounted event', function () {
			spyOnEvent(document, 'dataStatsCounted');
			this.component.recount();
			expect('dataStatsCounted').toHaveBeenTriggeredOn(document);
		});

		it('should trigger dataStatsCounted when todos are loaded', function () {
			spyOnEvent(document, 'dataStatsCounted');
			$(document).trigger('dataTodosLoaded');
			expect('dataStatsCounted').toHaveBeenTriggeredOn(document);
		});

		it('should provide empty stats', function () {
			spyOnEvent(document, 'dataStatsCounted');
			this.component.recount();
			expect('dataStatsCounted').toHaveBeenTriggeredOnAndWith(document, {
				all: 0,
				remaining: 0,
				completed: 0,
				filter: ''
			});
		});
	});

	describe('recount with datastore', function () {
		beforeEach(function () {
			setupComponent({
				dataStore: new mocks.DataStore()
			});
		});

		it('should provide full stats', function () {
			spyOnEvent(document, 'dataStatsCounted');
			this.component.recount();
			expect('dataStatsCounted').toHaveBeenTriggeredOnAndWith(document, {
				all: 3,
				remaining: 2,
				completed: 1,
				filter: ''
			});
		});
	});
});
