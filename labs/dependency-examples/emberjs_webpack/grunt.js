module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		webpack: {
			app: extend(require("./webpackConfig.js"), {
				src: "src/app.js",
				dest: "assets/bundle.js",
				minimize: true
			}),
			app_debug: extend(require("./webpackConfig.js"), {
				src: "src/app.js",
				dest: "assets/bundle.js",
				debug: true,
				includeFilenames: true
			})
		}
	});

	grunt.loadNpmTasks('grunt-webpack');

	grunt.registerTask('default', 'webpack:app');
	grunt.registerTask('debug', 'webpack:app_debug');
}

function extend(obj, obj2) {
	var o = {};
	for(var name in obj) {
		o[name] = obj[name];
	}
	for(var name in obj2) {
		o[name] = obj2[name];
	}
	return o;
}