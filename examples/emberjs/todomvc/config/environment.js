'use strict';

module.exports = function (environment) {
	const ENV = {
		modulePrefix: 'todomvc',
		environment,
		/**
		 * Default is:
		 *   rootURL: '/',
		 *   locationType: 'history'
		 *
		 * These settings are required by todomvc's (the repo) tests
		 * (And the deployed site -- using GH Pages to point at the pre-built assets in source)
		 */
		rootURL: '/examples/emberjs/todomvc/dist/',
		locationType: 'history',
		EmberENV: {
			EXTEND_PROTOTYPES: false,
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
			},
		},

		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		},
	};

	if (environment === 'development') {
		// ENV.APP.LOG_RESOLVER = true;
		// ENV.APP.LOG_ACTIVE_GENERATION = true;
		// ENV.APP.LOG_TRANSITIONS = true;
		// ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		// ENV.APP.LOG_VIEW_LOOKUPS = true;
	}

	if (environment === 'test') {
		// Testem prefers this...
		ENV.locationType = 'none';

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV.APP.LOG_VIEW_LOOKUPS = false;

		ENV.APP.rootElement = '#ember-testing';
		ENV.APP.autoboot = false;
	}

	if (environment === 'production') {
		// here you can enable a production-specific feature
	}

	return ENV;
};
