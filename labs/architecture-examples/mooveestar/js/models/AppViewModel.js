/*global MooVeeStar */
/*jshint browser:true, mootools:true */
(function (window) {

	'use strict';

	window.models = window.models || {};

	window.models.AppViewModel = new Class({
		Extends: MooVeeStar.Model,
		properties: {
			filter: {
				possible: ['all', 'active', 'completed']
			},
			total: {
				initial: 0,
				sanitize: function (v) { return parseInt(v, 10) || 0; },
			},
			active: {
				initial: 0,
				sanitize: function (v) { return parseInt(v, 10) || 0; },
				set: function (v) {
					this._props.active = v;
					this.set('active-label', 'item' + (v !== 1 ? 's':'') + ' left');
				}
			},
			completed: {
				initial: 0,
				sanitize: function (v) { return parseInt(v, 10) || 0; },
				set: function (v) {
					this._props.completed = v;
					this.set('active', this.get('total', true) - v);
				}
			}
		}

	});

})(window);