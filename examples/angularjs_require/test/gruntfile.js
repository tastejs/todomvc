'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.initConfig({
		jasmine: {
			unit: {
				options: {
					specs: [
						'unit/**/*Spec.js'
					],
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfigFile: '../js/main.js',
						requireConfig: {
							baseUrl: '../js',
							paths: {
								jquery: '../test/node_modules/jquery/dist/jquery',
								'angular-mocks': '../test/node_modules/angular-mocks/angular-mocks'
							},
							shim: {
								'angular-mocks': ['angular']
							},
							deps: ['']
						}
					},
					summary: true
				}
			}
		}
	});
};
