'use strict';

var express = require('express');
var fs = require('fs');
var learnJson = require('./learn.json');
var markdown = require('marked');
var path = require('path');

var app = module.exports = express();
module.exports.getBlueprintHtml = getBlueprintHtml;

app.use(express.static(__dirname));

// Set a default /api route to display the todomvc-api blueprint markdown file.
app.get('/api', function (req, res) {
	getBlueprintHtml(function (err, html) {
		if (err) {
			throw err;
		}

		res.end(html);
	});
});

Object.defineProperty(module.exports, 'learnJson', {
	set: function (backend) {
		learnJson.backend = backend;
		fs.writeFile(require.resolve('./learn.json'), JSON.stringify(learnJson, null, 2), function (err) {
			if (err) {
				throw err;
			}
		});
	}
});

function getBlueprintHtml(callback) {
	var blueprintPath = require.resolve('todomvc-api/todos.apib');

	fs.readFile(blueprintPath, function (err, blueprint) {
		if (err) {
			return callback(err);
		}

		var cssPath = require.resolve('github-markdown-css/github-markdown.css');
		var body = markdown(blueprint.toString().replace(/^FORMAT.*/, ''));

		callback(null, [
			'<!doctype html>',
			'<html lang="en">',
			'	<head>',
			'		<meta charset="utf-8">',
			'		<title>TodoMVC API Blueprint</title>',
			'		<link rel="stylesheet" href="' + path.relative(__dirname, cssPath) + '">',
			'	</head>',
			'	<body>',
			'		<article class="markdown-body">' + body + '</article>',
			'	</body>',
			'</html>'
		].join('\n'));
	});
}
