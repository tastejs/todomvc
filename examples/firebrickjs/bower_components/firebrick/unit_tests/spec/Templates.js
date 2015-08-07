/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Templates:", function() {
		
		it("loading tpl", function() {
		    expect(typeof Firebrick.templates.loadingTpl).toBe("string");
		});
		
	});	
});
