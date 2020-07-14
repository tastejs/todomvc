"use strict"

var o = require("../../ospec/ospec")
var bundle = require("../bundle")

var fs = require("fs")

var ns = "./"
function write(filepath, data) {
	try {var exists = fs.statSync(ns + filepath).isFile()} catch (e) {/* ignore */}
	if (exists) throw new Error("Don't call `write('" + filepath + "')`. Cannot overwrite file")
	fs.writeFileSync(ns + filepath, data, "utf8")
}
function remove(filepath) {
	fs.unlinkSync(ns + filepath)
}

o.spec("bundler", function() {
	o("relative imports works", function() {
		write("a.js", 'var b = require("./b")')
		write("b.js", "module.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b = 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports works with semicolons", function() {
		write("a.js", 'var b = require("./b");')
		write("b.js", "module.exports = 1;")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b = 1;\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports works with let", function() {
		write("a.js", 'let b = require("./b")')
		write("b.js", "module.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\nlet b = 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports works with const", function() {
		write("a.js", 'const b = require("./b")')
		write("b.js", "module.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\nconst b = 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports works with assignment", function() {
		write("a.js", 'var a = {}\na.b = require("./b")')
		write("b.js", "module.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar a = {}\na.b = 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports works with reassignment", function() {
		write("a.js", 'var b = {}\nb = require("./b")')
		write("b.js", "module.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b = {}\nb = 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports removes extra use strict", function() {
		write("a.js", '"use strict"\nvar b = require("./b")')
		write("b.js", '"use strict"\nmodule.exports = 1')

		o(bundle(ns + "a.js")).equals(';(function() {\n"use strict"\nvar b = 1\n}());')

		remove("a.js")
		remove("b.js")
	})
	o("relative imports removes extra use strict using single quotes", function() {
		write("a.js", "'use strict'\nvar b = require(\"./b\")")
		write("b.js", "'use strict'\nmodule.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\n'use strict'\nvar b = 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("relative imports removes extra use strict using mixed quotes", function() {
		write("a.js", '"use strict"\nvar b = require("./b")')
		write("b.js", "'use strict'\nmodule.exports = 1")

		o(bundle(ns + "a.js")).equals(';(function() {\n"use strict"\nvar b = 1\n}());')

		remove("a.js")
		remove("b.js")
	})
	o("works w/ window", function() {
		write("a.js", 'window.a = 1\nvar b = require("./b")')
		write("b.js", "module.exports = function() {return a}")

		o(bundle(ns + "a.js")).equals(";(function() {\nwindow.a = 1\nvar b = function() {return a}\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works without assignment", function() {
		write("a.js", 'require("./b")')
		write("b.js", "1 + 1")

		o(bundle(ns + "a.js")).equals(";(function() {\n1 + 1\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works if used fluently", function() {
		write("a.js", 'var b = require("./b").toString()')
		write("b.js", "module.exports = []")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar _0 = []\nvar b = _0.toString()\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works if used fluently w/ multiline", function() {
		write("a.js", 'var b = require("./b")\n\t.toString()')
		write("b.js", "module.exports = []")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar _0 = []\nvar b = _0\n\t.toString()\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works if used w/ curry", function() {
		write("a.js", 'var b = require("./b")()')
		write("b.js", "module.exports = function() {}")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar _0 = function() {}\nvar b = _0()\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works if used w/ curry w/ multiline", function() {
		write("a.js", 'var b = require("./b")\n()')
		write("b.js", "module.exports = function() {}")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar _0 = function() {}\nvar b = _0\n()\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works if used fluently in one place and not in another", function() {
		write("a.js", 'var b = require("./b").toString()\nvar c = require("./c")')
		write("b.js", "module.exports = []")
		write("c.js", 'var b = require("./b")\nmodule.exports = function() {return b}')

		o(bundle(ns + "a.js")).equals(";(function() {\nvar _0 = []\nvar b = _0.toString()\nvar b0 = _0\nvar c = function() {return b0}\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("works if used in sequence", function() {
		write("a.js", 'var b = require("./b"), c = require("./c")')
		write("b.js", "module.exports = 1")
		write("c.js", "var x\nmodule.exports = 2")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b = 1\nvar x\nvar c = 2\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("works if assigned to property", function() {
		write("a.js", 'var x = {}\nx.b = require("./b")\nx.c = require("./c")')
		write("b.js", "var bb = 1\nmodule.exports = bb")
		write("c.js", "var cc = 2\nmodule.exports = cc")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar x = {}\nvar bb = 1\nx.b = bb\nvar cc = 2\nx.c = cc\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("works if assigned to property using bracket notation", function() {
		write("a.js", 'var x = {}\nx["b"] = require("./b")\nx["c"] = require("./c")')
		write("b.js", "var bb = 1\nmodule.exports = bb")
		write("c.js", "var cc = 2\nmodule.exports = cc")

		o(bundle(ns + "a.js")).equals(';(function() {\nvar x = {}\nvar bb = 1\nx["b"] = bb\nvar cc = 2\nx["c"] = cc\n}());')

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("works if collision", function() {
		write("a.js", 'var b = require("./b")')
		write("b.js", "var b = 1\nmodule.exports = 2")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b0 = 1\nvar b = 2\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("works if multiple aliases", function() {
		write("a.js", 'var b = require("./b")\n')
		write("b.js", 'var b = require("./c")\nb.x = 1\nmodule.exports = b')
		write("c.js", "var b = {}\nmodule.exports = b")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b = {}\nb.x = 1\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("works if multiple collision", function() {
		write("a.js", 'var b = require("./b")\nvar c = require("./c")\nvar d = require("./d")')
		write("b.js", "var a = 1\nmodule.exports = a")
		write("c.js", "var a = 2\nmodule.exports = a")
		write("d.js", "var a = 3\nmodule.exports = a")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar a = 1\nvar b = a\nvar a0 = 2\nvar c = a0\nvar a1 = 3\nvar d = a1\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
		remove("d.js")
	})
	o("works if included multiple times", function() {
		write("a.js", "module.exports = 123")
		write("b.js", 'var a = require("./a").toString()\nmodule.exports = a')
		write("c.js", 'var a = require("./a").toString()\nvar b = require("./b")')

		o(bundle(ns + "c.js")).equals(";(function() {\nvar _0 = 123\nvar a = _0.toString()\nvar a0 = _0.toString()\nvar b = a0\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("works if included multiple times reverse", function() {
		write("a.js", "module.exports = 123")
		write("b.js", 'var a = require("./a").toString()\nmodule.exports = a')
		write("c.js", 'var b = require("./b")\nvar a = require("./a").toString()')

		o(bundle(ns + "c.js")).equals(";(function() {\nvar _0 = 123\nvar a0 = _0.toString()\nvar b = a0\nvar a = _0.toString()\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("reuses binding if possible", function() {
		write("a.js", 'var b = require("./b")\nvar c = require("./c")')
		write("b.js", 'var d = require("./d")\nmodule.exports = function() {return d + 1}')
		write("c.js", 'var d = require("./d")\nmodule.exports = function() {return d + 2}')
		write("d.js", "module.exports = 1")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar d = 1\nvar b = function() {return d + 1}\nvar c = function() {return d + 2}\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
		remove("d.js")
	})
	o("disambiguates conflicts if imported collides with itself", function() {
		write("a.js", 'var b = require("./b")')
		write("b.js", "var b = 1\nmodule.exports = function() {return b}")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b0 = 1\nvar b = function() {return b0}\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("disambiguates conflicts if imported collides with something else", function() {
		write("a.js", 'var a = 1\nvar b = require("./b")')
		write("b.js", "var a = 2\nmodule.exports = function() {return a}")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar a = 1\nvar a0 = 2\nvar b = function() {return a0}\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("disambiguates conflicts if imported collides with function declaration", function() {
		write("a.js", 'function a() {}\nvar b = require("./b")')
		write("b.js", "var a = 2\nmodule.exports = function() {return a}")

		o(bundle(ns + "a.js")).equals(";(function() {\nfunction a() {}\nvar a0 = 2\nvar b = function() {return a0}\n}());")

		remove("a.js")
		remove("b.js")
	})
	o("disambiguates conflicts if imported collides with another module's private", function() {
		write("a.js", 'var b = require("./b")\nvar c = require("./c")')
		write("b.js", "var a = 1\nmodule.exports = function() {return a}")
		write("c.js", "var a = 2\nmodule.exports = function() {return a}")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar a = 1\nvar b = function() {return a}\nvar a0 = 2\nvar c = function() {return a0}\n}());")

		remove("a.js")
		remove("b.js")
		remove("c.js")
	})
	o("does not mess up strings", function() {
		write("a.js", 'var b = require("./b")')
		write("b.js", 'var b = "b b b \\" b"\nmodule.exports = function() {return b}')

		o(bundle(ns + "a.js")).equals(';(function() {\nvar b0 = "b b b \\\" b"\nvar b = function() {return b0}\n}());')

		remove("a.js")
		remove("b.js")
	})
	o("does not mess up properties", function() {
		write("a.js", 'var b = require("./b")')
		write("b.js", "var b = {b: 1}\nmodule.exports = function() {return b.b}")

		o(bundle(ns + "a.js")).equals(";(function() {\nvar b0 = {b: 1}\nvar b = function() {return b0.b}\n}());")

		remove("a.js")
		remove("b.js")
	})
})
