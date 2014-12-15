'use strict';

var express = require('express');
var fs = require('fs');
var learnJson = require('./learn.json');

var app = module.exports = express();

app.use(express.static(__dirname));

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
