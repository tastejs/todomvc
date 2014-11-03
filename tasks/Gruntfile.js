module.exports = function (grunt) {
	var bower = require('bower');
	var wrench = require('wrench');

	grunt.registerTask('todomvc-common', function () {
		// For some reason, I began trusting Batman to be my test directory for
		// `todomvc-common`.  If you work on changes in ...
		//
		//   examples/batman/bower_components/todomvc-common
		//
		// ... or even just drop the latest `todomvc-common` there, this task will
		// find all of the other `bower_components/todomvc-common` directories, and
		// update them with what Batman has.
		//
		// I also added Bower up top for in the future, as that might come in handy
		// to correctly fetch and install the latest todomvc-common, without relying
		// on this weird Batman system.
		var sourceTodoMvcCommon = 'examples/angularjs/bower_components/todomvc-common';
		var sourceIdentifierRegex = /angularjs/;

		grunt.file.setBase('../');

		var directories = grunt.file.expand({
			filter: function (src) {
				return grunt.file.isDir(src) && src.substr(-14) === 'todomvc-common' && !src.match(sourceIdentifierRegex);
			}
		}, ['*/**']);

		directories.forEach(function (destPath) {
			wrench.copyDirSyncRecursive(
				sourceTodoMvcCommon,
				destPath,
				{
					forceDelete: true,
					preserveFiles: false
				},
				function () {
					console.log(arguments);
				});
		});
	});
};
