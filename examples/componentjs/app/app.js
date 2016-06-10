/* global ComponentJS, cs, app, _ */
(function () {
	'use strict';

	// application bootstrap class
	ComponentJS.symbol('cs');
	cs.ns('app').boot = cs.clazz({
		statics: {
			init: function () {
				// bootstrap ComponentJS framework
				cs.bootstrap();
				cs.debug(0);
			},
			main: function () {
				// fire up the component tree
				cs.create('/ui', app.ui.composite.root);
				cs('/ui').state(_.isObject(document) ? 'visible' : 'prepared');
			}
		}
	});
}());
