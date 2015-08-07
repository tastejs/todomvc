/*!
 * @author Steven Masala [me@smasala.com]
 */
define([], function(){
	"use strict";
	var bowerPath = "../bower_components";
	
	require.config({
		config:{
			"configuration":{
				bowerPath: bowerPath
			}
		},
		paths: {
			"configuration": bowerPath + "/firebrick/src/configuration"
		},
		shim:{
			"firebrick": ["configuration"]
		}
	});
	
	require(["firebrick"], function(){
		
		Firebrick.application({
			app:{
				name:"TODOMVC"
			},
			require: ["controller/AppController"],
			autoRender: false
		});
		
	});
});