/*global include, mask, Compo, ruta */

/*
 *	Filter Presentation:
 *		- HASH-change listener
 *		- navigation(filter) buttons
 *
 */

include
	.load('filter.mask::Template')
	.done(function (resp) {
		'use strict';

		mask.registerHandler(':filter', Compo.createClass({
			template: resp.load.Template
		}));
	});
