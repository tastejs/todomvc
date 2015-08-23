/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Views:", function() {
		
		it("Basic config for shortcut", function(){
			var config = {};
			config = Firebrick.views._basicViewConfigurations(config);
			expect(config.extend).toBeDefined();
			expect(config.extend).toBe("Firebrick.view.Base");
		});
		
		it("getBody", function(){
			
			expect(Firebrick.views._body).toBe(null);
			expect(Firebrick.views.getBody().length).toBeGreaterThan(0);
			expect(Firebrick.views._body).toBeDefined();
			
		});
		
		it("getTarget", function(){
			
			expect(Firebrick.views.getTarget("#cccc")).toBe(null);
			expect(Firebrick.views.getTarget("html").length).toBeGreaterThan(0);
			
		});
		
		it("renderTo", function(){
			
			var id = "testing123",
				html = "<div id="+id+" class='outOfSight'></div>",
				elem;
			
			Firebrick.views.renderTo($("body"), html, true);
			elem = $("#" + id);
			expect(elem.length).toBeGreaterThan(0);
			elem.remove();
			elem = $("#" + id);
			expect(elem.length).toBe(0);
		});
		
		it("bootView", function(done) {
		    var sandbox;
		    
			$("body").append("<div id='fb-sandbox' class='outOfSight'></div>");
			sandbox = $("#fb-sandbox");
			expect(sandbox.children().length).toBe(0);

			Firebrick.addListener("viewReady", function(){
				expect(sandbox.children().length).toBeGreaterThan(0);
				
				Firebrick.classes.removeClass("Test.view.Index");
				$("#fb-sandbox").remove();
				done();
			});
			Firebrick.views.bootView({target: "#fb-sandbox"});
			
		});
		
		it("Create a View", function(done){

			Firebrick.createView("Test.view.Index", {
				autoRender: false,
				listeners: {
					ready: function(){
						expect(this.tpl.indexOf("test")).toBeGreaterThan(0);
						done();
					}
				}
			});
		});
		
	});	
});
