/*global KISSY */
KISSY.add('app/ini', function () {
	'use strict';

	return {
		defaultView: 'app/views/default',
		routes: function (/* pathname */) {
			return this.defaultView;
		}
	};
});