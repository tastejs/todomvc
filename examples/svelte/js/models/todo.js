'use strict';
/* jshint esnext: false */
/* jshint esversion: 9 */

export const valid = function({ title }) {
	return !!(title && title.trim());
};

export const build = function({id, title = '', completed = false }) {
	return {
		...(id && {id}),
		title: title && title.trim(),
		completed
	};
};
