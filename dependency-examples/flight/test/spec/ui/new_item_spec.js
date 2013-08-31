describeComponent('app/js/ui/new_item', function () {
	'use strict';

	var ENTER_KEY = 13;

	beforeEach(function () {
		setupComponent(readFixtures('new_todo.html'));
	});

	it('triggers uiAddRequested on enter', function () {
		var event = $.Event('keydown');
		event.which = ENTER_KEY;

		spyOnEvent(document, 'uiAddRequested');
		this.component.$node.val('shave moar yaks');

		this.component.trigger(event);

		expect('uiAddRequested').toHaveBeenTriggeredOnAndWith(document, {
			title: 'shave moar yaks'
		});
	});

	it('trims values', function () {
		var event = $.Event('keydown');
		event.which = ENTER_KEY;

		spyOnEvent(document, 'uiAddRequested');
		this.component.$node.val('  trim inputs ');

		this.component.trigger(event);

		expect('uiAddRequested').toHaveBeenTriggeredOnAndWith(document, {
			title: 'trim inputs'
		});
	});

	it('ignore empty values', function () {
		var event = $.Event('keydown');
		event.which = ENTER_KEY;

		spyOnEvent(document, 'uiAddRequested');

		this.component.trigger(event);

		expect('uiAddRequested').not.toHaveBeenTriggeredOn(document);
	});
});

