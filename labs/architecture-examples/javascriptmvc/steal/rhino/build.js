load('steal/rhino/rhino.js')

// moves js scripts to framework
// creates steal.production.js
// creates the zip
// copy js.bat and js to root
new steal.File("steal/js.bat").copyTo("js.bat", [])
new steal.File("steal/js").copyTo("js", [])

// compress steal.js to steal.production.js
steal('steal/build', 'steal/build/scripts', function() {
	var script = readFile('steal/steal.js'),
		text = steal.build.builders.scripts.clean(script),
		compressed = steal.build.builders.scripts.compressors.localClosure()(text, true);
	new steal.File("steal/steal.production.js").save(compressed);
});

new steal.File("../stealjs").removeDir()
new steal.File("stealjs.zip").remove()
new steal.File("../stealjs").mkdir()

var ignore = [".git", ".gitignore", "dist", "js", "js.bat"]

new steal.File("../stealjs/steal").mkdir()
new steal.File("steal").copyTo("../stealjs/steal/", ignore)
new steal.File("js").copyTo("../stealjs/js", [])
new steal.File("js.bat").copyTo("../stealjs/js.bat", [])

new steal.File("../stealjs").zipDir("stealjs.zip", "..\\stealjs\\")