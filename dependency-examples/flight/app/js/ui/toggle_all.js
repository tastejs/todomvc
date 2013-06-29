/*global define */
'use strict';

define([
	'flight/component'
], function (defineComponent) {
	function toggleAll() {
		this.toggleAllComplete = function () {
			this.trigger('uiToggleAllRequested', {
				completed: this.$node.is(':checked')
			});
		};

		this.toggleCheckbox = function (e, data) {
			this.$node[0].checked = !data.remaining;
		};

		this.after('initialize', function () {
			this.on('click', this.toggleAllComplete);
			this.on(document, 'dataStatsCounted', this.toggleCheckbox);
		});
	}

	return defineComponent(toggleAll);
});
