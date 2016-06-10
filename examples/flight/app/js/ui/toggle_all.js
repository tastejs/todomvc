/*global define */
'use strict';

define([
	'flight/lib/component'
], function (defineComponent) {
	function toggleAll() {
		this.toggleAllComplete = function () {
			this.trigger('uiToggleAllRequested', {
				completed: this.$node.is(':checked')
			});
		};

		this.toggleCheckbox = function (e, data) {
			this.node.checked = !data.remaining;
		};

		this.after('initialize', function () {
			this.on('click', this.toggleAllComplete);
			this.on(document, 'dataStatsCounted', this.toggleCheckbox);
		});
	}

	return defineComponent(toggleAll);
});
