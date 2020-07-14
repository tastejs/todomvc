"use strict"

var fs = require("fs")
var path = require("path")
var proc = require("child_process")

function read(filepath) {
	try {return fs.readFileSync(filepath, "utf8")} catch (e) {throw new Error("File does not exist: " + filepath)}
}
function isFile(filepath) {
	try {return fs.statSync(filepath).isFile()} catch (e) {return false}
}
function parse(file) {
	var json = read(file)
	try {return JSON.parse(json)} catch (e) {throw new Error("invalid JSON: " + json)}
}

var error
module.exports = function (input) {
	var modules = {}
	var bindings = {}
	var declaration = /^\s*(?:var|let|const|function)[\t ]+([\w_$]+)/gm
	var include = /(?:((?:var|let|const|,|)[\t ]*)([\w_$\.\[\]"'`]+)(\s*=\s*))?require\(([^\)]+)\)(\s*[`\.\(\[])?/gm
	var uuid = 0
	var process = function(filepath, data) {
		data.replace(declaration, function(match, binding) {bindings[binding] = 0})

		return data.replace(include, function(match, def, variable, eq, dep, rest) {
			var filename = new Function("return " + dep).call(), pre = ""

			def = def || "", variable = variable || "", eq = eq || "", rest = rest || ""
			if (def[0] === ",") def = "\nvar ", pre = "\n"
			var dependency = resolve(filepath, filename)
			var localUUID = uuid // global uuid can update from nested `process` call, ensure same id is used on declaration and consumption
			var code = process(dependency, pre + (modules[dependency] == null ? exportCode(filename, dependency, def, variable, eq, rest, localUUID) : def + variable + eq + modules[dependency]))
			modules[dependency] = rest ? "_" + localUUID : variable
			uuid++
			return code + rest
		})
	}

	var resolve = function(filepath, filename) {
		if (filename[0] !== ".") {
			// resolve as npm dependency
			var packagePath = "./node_modules/" + filename + "/package.json"
			var meta = isFile(packagePath) ? parse(packagePath) : {}
			var main = "./node_modules/" + filename + "/" + (meta.main || filename + ".js")
			return path.resolve(isFile(main) ? main : "./node_modules/" + filename + "/index.js")
		}
		else {
			// resolve as local dependency
			return path.resolve(path.dirname(filepath), filename + ".js")
		}
	}

	var exportCode = function(filename, filepath, def, variable, eq, rest, uuid) {
		var code = read(filepath)
		// if there's a syntax error, report w/ proper stack trace
		try {new Function(code)} catch (e) {
			proc.exec("node " + filepath, function(e) {
				if (e !== null && e.message !== error) {
					error = e.message
					console.log("\x1b[31m" + e.message + "\x1b[0m")
				}
			})
		}

		// disambiguate collisions
		var ignored = {}
		code.replace(include, function(match, def, variable, eq, dep) {
			var filename = new Function("return " + dep).call()
			var binding = modules[resolve(filepath, filename)]
			if (binding != null) ignored[binding] = true
		})
		if (code.match(new RegExp("module\\.exports\\s*=\\s*" + variable + "\s*$", "m"))) ignored[variable] = true
		for (var binding in bindings) {
			if (!ignored[binding]) {
				var before = code
				code = code.replace(new RegExp("(\\b)" + binding + "\\b", "g"), binding + bindings[binding])
				if (before !== code) bindings[binding]++
			}
		}

		// fix strings that got mangled by collision disambiguation
		var string = /(["'])((?:\\\1|.)*?)(\1)/g
		var candidates = Object.keys(bindings).map(function(binding) {return binding + (bindings[binding] - 1)}).join("|")
		code = code.replace(string, function(match, open, data, close) {
			var variables = new RegExp(Object.keys(bindings).map(function(binding) {return binding + (bindings[binding] - 1)}).join("|"), "g")
			var fixed = data.replace(variables, function(match) {
				return match.replace(/\d+$/, "")
			})
			return open + fixed + close
		})

		//fix props
		var props = new RegExp("((?:[^:]\\/\\/.*)?\\.\\s*)(" + candidates + ")|([\\{,]\\s*)(" + candidates + ")(\\s*:)", "gm")
		code = code.replace(props, function(match, dot, a, pre, b, post) {
			if (dot && dot.indexOf("//") === 1) return match // Don't do anything because dot was matched in a comment
			else if (dot) return dot + a.replace(/\d+$/, "")
			else return pre + b.replace(/\d+$/, "") + post
		})

		return code
			.replace(/("|')use strict\1;?/gm, "") // remove extraneous "use strict"
			.replace(/module\.exports\s*=\s*/gm, rest ? "var _" + uuid + eq : def + (rest ? "_" : "") + variable + eq) // export
			+ (rest ? "\n" + def + variable + eq + "_" + uuid : "") // if `rest` is truthy, it means the expression is fluent or higher-order (e.g. require(path).foo or require(path)(foo)
	}

	var code = process(path.resolve(input), read(input))
		.replace(/^\s*((?:var|let|const|)[\t ]*)([\w_$\.]+)(\s*=\s*)(\2)(?=[\s]+(\w)|;|$)/gm, "") // remove assignments to self
		.replace(/;+(\r|\n|$)/g, ";$1") // remove redundant semicolons
		.replace(/(\r|\n)+/g, "\n").replace(/(\r|\n)$/, "") // remove multiline breaks

	code = ";(function() {\n" + code + "\n}());"
	//try {new Function(code); console.log("build completed at " + new Date())} catch (e) {}
	error = null
	return code
}
