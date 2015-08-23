/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Basics:", function() {
		
		it("version to be string", function() {
		    expect(typeof Firebrick.version).toBe("string");
		});
		
		it("default values", function() {
			expect(Firebrick.scrollTopOffset).toBe(0);
			expect(Firebrick.scrollContainerSelector).toBe("body, html");
		});

	});	
});
