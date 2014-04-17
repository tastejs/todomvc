module.exports = function (config) {
	'use strict';

	config.set({
		basePath: '../..',
		frameworks: ['jasmine'],
		files: [
            'js/lib/platypus/platypus.js',
            'js/converters/converters.js',
            'js/repositories/state.repository.js',
            'js/repositories/todo.repository.js',
            'js/models/state.model.js',
            'js/models/todo.factory.js',
            'js/viewcontrols/todo/todo.viewcontrol.js',
            'js/app.js',
            'test/mock/mock.js',
			'test/unit/**/*.js'
		],
		autoWatch: true,
		singleRun: false,
		browsers: ['Chrome', 'Firefox']
	});
};
