'use strict';

module.exports = {
	extends: 'recommended',
	rules: {
		// Polaris allows <style> tags
		//   https://github.com/ember-template-lint/ember-template-lint/blob/master/lib/rules/no-forbidden-elements.js
		'no-forbidden-elements': ['error', { forbidden: ['meta', 'html', 'script'] }],
		// Stylistic
		'no-inline-styles': false,
	},
};
