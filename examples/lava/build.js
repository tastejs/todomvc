/*

Running (don't forget "npm install"):
> node build.js

Building is optional: you can open index_raw in browser, and it will work as expected.
This build script parses page template on server, so you don't see page sources while it's loading.
And naturally, bundled page loads faster.

*/

var fs = require('fs'),
	Lava = require('lava');

function readFile(path) {

	return fs.readFileSync(path, {encoding: 'utf8'});

}

function page_to_widget(page_src) {
	var raw_template = Lava.TemplateParser.parseRaw(page_src);
	if (raw_template.length != 1) Lava.t();
	var raw_tag = raw_template[0];
	var config = Lava.parsers.Common.toWidget(raw_tag);
	config.is_extended = true;
	config['class'] = (raw_tag.attributes && raw_tag.attributes['lava-app'])
		? raw_tag.attributes['lava-app']
		: "Standard";
	return config;
}

var page_widget_src;

// parse body of existing index
readFile('index_raw.html').replace(/\<body([\s\S]+?)\<\/body\>/, function(body) {
	// base.js needs to be moved into different location
	body = body.replace(/\<script src="node_modules\/todomvc-common\/base.js"\>\<\/script\>/, '');
	page_widget_src = "page_config = " + Lava.serializer.serialize(page_to_widget(body)) + ';';
});

var bundle_content = [
	readFile('node_modules/director/build/director.js'),
	readFile('node_modules/lava/node_modules/firestorm/lib/firestorm.js'),
	readFile('node_modules/lava/lib/packages/core.js'),
	readFile('node_modules/lava/lib/packages/parsers.js'),
	readFile('node_modules/lava/lib/packages/core-classes.js'),
	readFile('node_modules/lava/lib/packages/widget-classes.js'),
	readFile('node_modules/lava/lib/packages/widget-templates.js'),
	readFile('js/Widget/Input/AutofocusText.class.js'),
	readFile('js/Widget/TodoApp.class.js'),
	page_widget_src
];

var UglifyJS = require('uglify-js');

var result = UglifyJS.minify(bundle_content.join('\n\n'), {
	fromString: true,
	mangle: true,
	compress: {
		dead_code: true,
		unsafe: true,
		unused: true
	}
});

fs.writeFileSync("bundle.min.js", result.code);