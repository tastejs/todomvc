/*global define */
'use strict';

define([
	'flight/lib/component'
], function (defineComponent) {
	function newItem() {
		var ENTER_KEY = 13;

		this.createOnEnter = function (e) {
			if (e.which !== ENTER_KEY ||
				!this.$node.val().trim()) {
				return;
			}

			this.trigger('uiAddRequested', {
				title: this.$node.val().trim()
			});

			this.$node.val('');
		};

		this.after('initialize', function () {
			this.on('keydown', this.createOnEnter);
		});
	}

	return defineComponent(newItem);
});
