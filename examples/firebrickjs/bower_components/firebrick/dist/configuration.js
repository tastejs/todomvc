/*!
 * Firebrick Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(_require, _exports, _module){
	"use strict";
	var bowerPath = _module.config().bowerPath || "bower_components";
	return require.config({
		paths:{
			"jquery": bowerPath + "/jquery/dist/jquery.min",
			"knockout": bowerPath + "/knockoutjs/dist/knockout",
			"knockout-mapping": bowerPath + "/knockout-mapping/knockout.mapping",
			"firebrick": bowerPath + "/firebrick/dist/firebrick",
			"text": bowerPath + "/text/text",
			"Firebrick.engines": bowerPath + "/firebrick/dist/engines"
		},
		shim:{
			"knockout-mapping": ["knockout"]
		}
	});	
});