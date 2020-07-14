"use strict"

var fs = require("fs")
var zlib = require("zlib")
var chokidar = require("chokidar")
var Terser = require("terser")

var bundle = require("./bundle")

var aliases = {o: "output", m: "minify", w: "watch", s: "save"}
var params = {}
var args = process.argv.slice(2), command = null
for (var i = 0; i < args.length; i++) {
	if (args[i][0] === '"') args[i] = JSON.parse(args[i])
	if (args[i][0] === "-") {
		if (command != null) add(true)
		command = args[i].replace(/\-+/g, "")
	}
	else if (command != null) add(args[i])
	else params.input = args[i]
}
if (command != null) add(true)

function add(value) {
	params[aliases[command] || command] = value
	command = null
}

function format(n) {
	return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

function build() {
	var original = bundle(params.input)
	if (!params.minify) {
		fs.writeFileSync(params.output, original, "utf-8")
		return
	}
	console.log("minifying...")
	var minified = Terser.minify(original)
	if (minified.error) throw new Error(minified.error)
	fs.writeFileSync(params.output, minified.code, "utf-8")
	var originalSize = original.length
	var compressedSize = minified.code.length
	var originalGzipSize = zlib.gzipSync(original).byteLength
	var compressedGzipSize = zlib.gzipSync(minified.code).byteLength

	console.log("Original size: " + format(originalGzipSize) + " bytes gzipped (" + format(originalSize) + " bytes uncompressed)")
	console.log("Compiled size: " + format(compressedGzipSize) + " bytes gzipped (" + format(compressedSize) + " bytes uncompressed)")

	if (params.save) {
		var readme = fs.readFileSync("./README.md", "utf8")
		var kb = compressedGzipSize / 1000

		fs.writeFileSync("./README.md",
			readme.replace(
				/(<!-- size -->)(.+?)(<!-- \/size -->)/,
				"$1" + (kb % 1 ? kb.toFixed(2) : kb) + " KB$3"
			)
		)
	}
}

build()
if (params.watch) chokidar.watch(".", {ignored: params.output}).on("all", build)
