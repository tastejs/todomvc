module.exports = function (grunt) {
	'use strict';

	var conf = {
		connect: {
			server: {
				options: {
					port: 8001,
					keepalive: true
				}
			}
		}
	};

	grunt.initConfig(conf);

	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['connect']);
}
