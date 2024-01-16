'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

/**
 * Tweaks to this over the default:
 * - enabled typescript
 * - sourcemaps always on
 */
module.exports = function (defaults) {
	const app = new EmberApp(defaults, {
		// Add options here
		'ember-cli-babel': {
			enableTypeScriptTransform: true,
		},
		sourcemap: true,
	});

	const { Webpack } = require('@embroider/webpack');

	return require('@embroider/compat').compatBuild(app, Webpack, {
		extraPublicTrees: [],
		staticAddonTrees: true,
		staticAddonTestSupportTrees: true,
		staticHelpers: true,
		staticModifiers: true,
		staticComponents: true,
		staticEmberSource: true,
		// the ember-inspector doesn't yet support this
		// staticEmberSource: true,
		// amdCompatibility: {
		// 	es: [],
		// },
		// splitAtRoutes: ['route.name'], // can also be a RegExp
		packagerOptions: {
			webpackConfig: {
				// Highest fidelity
				devtool: 'source-map',
			},
		},
	});
};
