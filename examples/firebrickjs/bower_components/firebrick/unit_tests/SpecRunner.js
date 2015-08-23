/**
Called by SpecRunner.html
**/
require.config({
	baseUrl: "",
	paths: {
		"jquery": 'bower_components/jquery/dist/jquery.min',
		"Test": "helpers",
		"spec": 'spec',
		"knockout": "bower_components/knockoutjs/dist/knockout",
		"knockout-mapping":"bower_components/knockout-mapping/knockout.mapping",
		"text": "bower_components/text/text",
		"firebrick": "../src/firebrick"
	},
	shim:{
		"knockout-mapping": ["knockout"]
	}
});

require(['jquery', 'spec/Index', 'firebrick'], function($, index) {
	"use strict";
	var jasmineEnv = jasmine.getEnv();
	
	Firebrick.app.name = "Test";

	$(function() {
		require(index.specs, function() {
			jasmineEnv.execute();
	    });
	});
	
});