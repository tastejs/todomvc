var path = require("path");
module.exports = {
	publicPrefix: "assets/",
	resolve: {
		alias: {
			todomvc: path.join(__dirname, "..", "..", ".."),
			ember: path.join(__dirname, "libs", "ember-latest.min.js"),
			jquery: 'todomvc/assets/jquery.min',
			handlebars: 'todomvc/assets/handlebars.min',
			jasmine: 'todomvc/assets/jasmine'
		}
	}
};