/* global cs, app, $, _ */
(function () {
	'use strict';

	// component of the root UI composite
	cs.ns('app.ui.composite').root = cs.clazz({
		mixin: [cs.marker.controller, cs.marker.view],
		protos: {
			create: function () {
				// create main composite component and auto-increase its state with us
				cs(this).create('main', app.ui.composite.main);
				cs(this).property('ComponentJS:state-auto-increase', true);
			},
			prepare: function () {
				// await the readiness of the DOM
				if (_.isObject(document)) {
					var self = this;
					cs(self).guard('render', 1);
					$(document).ready(function () {
						// load all markup code
						$.markup.load(function () {
							cs(self).guard('render', -1);
						});
					});
				}
			},
			render: function () {
				// place a socket onto the DOM body element
				cs(this).socket({ ctx: $('body'), spool: 'materialized' });
			},
			release: function () {
				// destroy socket onto DOM body element
				cs(this).unspool('materialized');
			},
			cleanup: function () {
				// destroy main composite component
				cs(this, 'main').destroy();
			}
		}
	});
}());
