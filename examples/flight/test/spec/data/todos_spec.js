describeComponent('data/todos', function () {
	'use strict';

	describe('without datastore', function () {
		beforeEach(function () {
			this.dataStore = new mocks.DataStore([]);
			this.setupComponent({
				dataStore: this.dataStore
			});
		});

		it('should add a new entry', function () {
			var title = 'buy some unicorns';

			spyOnEvent(document, 'dataTodoAdded');
			this.component.trigger('uiAddRequested', {
				title: title
			});

			expect('dataTodoAdded').toHaveBeenTriggeredOn(document);
			expect(this.dataStore.data.length).toBe(1);
			expect(this.dataStore.all()[0].title).toBe(title);
		});
	});

	describe('with datastore', function () {
		beforeEach(function () {
			this.dataStore = new mocks.DataStore();
			this.setupComponent({
				dataStore: this.dataStore
			});
		});

		it('removes completed', function () {
			spyOn(this.dataStore, 'destroyAll');
			this.component.trigger('uiClearRequested');
			expect(this.dataStore.destroyAll).toHaveBeenCalledWith({ completed: true });
		});
	});
});
