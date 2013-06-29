/*global define */
'use strict';

define([
	'flight/component',
	'./with_filters',
	'text!app/templates/stats.html',
	'../utils'
], function (defineComponent, withFilters, statsTmpl, utils) {
	function stats() {
		var template = utils.tmpl(statsTmpl);

		this.defaultAttrs({
			clearCompletedSelector: '#clear-completed'
		});

		this.render = function (e, data) {
			var toggle = data.all > 0;

			this.$node.html(template(data));
			this.$node.toggle(toggle);
			this.markSelected(data.filter);
		};

		this.clearCompleted = function () {
			this.trigger('uiClearRequested');
		};

		this.after('initialize', function () {
			this.$node.hide();
			this.on(document, 'dataStatsCounted', this.render);
			this.on('click', { 'clearCompletedSelector': this.clearCompleted });
		});
	}

	return defineComponent(stats, withFilters);
});
