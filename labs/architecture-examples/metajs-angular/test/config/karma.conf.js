module.exports = function (config) {
	'use strict';

	config.set({
		basePath: '../../',
		frameworks: ['jasmine'],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'js/**/*.js',
			'test/unit/**/*.js'
		],
		autoWatch: false,
		singleRun: true,
		browsers: ['Chrome', 'Firefox']
	});
};
