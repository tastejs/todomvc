/*!
 * Firebrick Dependency Configuration
 * @author Steven Masala [me@smasala.com]
**/

define(function(_require, _exports, _module){
	"use strict";
	var bowerPath = _module.config().bowerPath || "bower_components";
	return require.config({
		paths:{
			"jquery": bowerPath + "/jquery/dist/jquery",
			"knockout": bowerPath + "/knockoutjs/dist/knockout.debug",
			"knockout-mapping": bowerPath + "/knockout-mapping/knockout.mapping",
			"firebrick": bowerPath + "/firebrick/src/firebrick",
			"text": bowerPath + "/text/text",
			"Firebrick.engines": bowerPath + "/firebrick/src/engines"
		},
		shim:{
			"knockout-mapping": ["knockout"]
		}
	});	
});