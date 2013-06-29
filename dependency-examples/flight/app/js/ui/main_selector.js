/*global define */
'use strict';

define([
	'flight/component'
], function (defineComponent) {
	function mainSelector() {
		this.toggle = function (e, data) {
			var toggle = data.all > 0;
			this.$node.toggle(toggle);
		};

		this.after('initialize', function () {
			this.$node.hide();
			this.on(document, 'dataStatsCounted', this.toggle);
		});
	}

	return defineComponent(mainSelector);
});
