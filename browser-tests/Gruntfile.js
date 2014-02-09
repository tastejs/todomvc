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
		},
		jshint : {
			options: {
				globals: {
					require: true,
					console: true,
					module: true
				},
				curly: true,
				eqeqeq: true,
				eqnull: true,
				expr: true,
				latedef: true,
				onevar: true,
				noarg: true,
				node: true,
				trailing: true,
				undef: true,
				unused: true
			},
			files: {
				src: ['*.js']
			},
		}
	});

	// build tasks
	grunt.registerTask('test', ['simplemocha']);
	grunt.registerTask('dev', ['jshint']);
};
