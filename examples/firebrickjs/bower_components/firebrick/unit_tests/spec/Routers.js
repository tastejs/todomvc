/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Routers:", function() {
		
		var testing = false,
			href = window.location.href;
		
		beforeEach(function(){
			testing = true;
		});
		
		afterEach(function(){
			testing = false;
			window.location = href + "#";
		});
		
		it("Router", function(done){

			Firebrick.router.set({
				"#jasmineTest1":{
					require: ["text!Test/view/Index.html"],
					callback: function(hashEvent, html){
						expect($.isPlainObject(hashEvent)).toBe(true);
						expect(typeof html).toBe("string");
						done();
					}
				}
			});
			
			window.location = href + "#jasmineTest1";
		
		});
		
		it("Params", function(done){

			Firebrick.router.set({
				"#jasmineTest2":function(){
					var route = Firebrick.router.getRoute();
					expect(route.parameters.name).toBe("Steve");
					expect(route.parameters.id).toBe("123");
					done();
				}
			});
			
			window.location = href + "#jasmineTest2?name=Steve&id=123";
		
		});
		
		it("Router default", function(done){

			Firebrick.router.set({
				defaults: function(){
					var route = Firebrick.router.getRoute();
					if(testing){
						expect(route.parameters.worked).toBe("true");
						done();
					}
				}
			});
			
			window.location = href + "#noRouteSet?worked=true";
		
		});
		
		
	});	
});
