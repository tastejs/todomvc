/*global cs, app, ComponentJS, _*/
/* application bootstrap class */

(function () {
	'use strict';
	ComponentJS.symbol('cs');
	cs.ns('app').boot = cs.clazz({
		statics: {
			init: function () {
				/* bootstrap ComponentJS framework */
				cs.bootstrap();
				// ComponentJS provides debugging levels from 0 (disabled) to 9
				// (all debug messages)
				cs.debug(0);
			},
			main: function () {
				/* fire up the component tree */
				cs.create('/ui', app.ui.composite.root);
				cs('/ui').state(_.isObject(document) ? 'visible' : 'prepared');
			}
		}
	});
}());
