/*global define window*/
define(function () {
	'use strict';

	var mod = {
		load: function (key) {
			if (window.localStorage === undefined) {
				return;
			}
			var d = window.localStorage[key];
			if (d) {
				return JSON.parse(d);
			} else {
				return;
			}
		},
		save: function (key, data) {
			if (window.localStorage === undefined) {
				return;
			}
			window.localStorage[key] = JSON.stringify(data);
		}
	};
	return mod;
});
