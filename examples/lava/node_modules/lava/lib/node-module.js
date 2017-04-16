/*
This file is a loader - it reads framework files from disk and evaluates them,
producing the Node.js module instance. Also calls Lava.init()
*/

var path = require("path");
var fs = require("fs");
var vm = require("vm");
var util = require("util");

var context = vm.createContext({
	Firestorm: require('firestorm')
});

var FILES = [
	"./packages/core.js",
	"./packages/parsers.js",
	"./packages/core-classes.js",
	"./packages/widget-classes.js",
	"./packages/widget-templates.js",
	"./locale/en.js"
];

FILES = FILES.map(function(file) {
	var file_path = path.join(path.dirname(fs.realpathSync(__filename)), file);
	return path.resolve(path.dirname(module.filename), file_path);
});

FILES.forEach(function(file_path) {
	if (fs.existsSync(file_path)) {
		try {
			var code = fs.readFileSync(file_path, "utf8");
			return vm.runInContext(code, context, file_path);
		} catch(ex) {
			util.debug("ERROR in file: " + file_path + " / " + ex);
			process.exit(1);
		}
	} else {
		console.log("Lava module - skipping - file not exists: " + file_path);
	}
});

context.Lava.init();
module.exports = context.Lava;