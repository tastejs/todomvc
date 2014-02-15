module.exports = function (grunt) {
	'use strict';
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		simplemocha: {
			options: {
				reporter: 'mocha-known-issues-reporter'
			},
			files: {
				src: 'allTests.js'
			}
		}
	});

	// build tasks
	grunt.registerTask('test', ['simplemocha']);
	grunt.registerTask('dev', ['jshint']);
};
