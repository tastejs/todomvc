/* jshint camelcase: false */

module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		openui5_preload: { // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			component: {
				options: {
					resources: {
						cwd: '',
						prefix: '',
						src: [
							'js/**/*.js',
							'js/**/*.json',
							'js/**/*.view.xml',
							'js/**/*.properties'
						]
					},
					dest: '',
					compress: true
				},
				components: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-openui5');

	grunt.registerTask('default', ['openui5_preload']);

};
