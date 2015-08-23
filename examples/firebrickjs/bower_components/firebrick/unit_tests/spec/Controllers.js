/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Controllers: ", function() {
		
		//Controller configurations
		var controllerName = "MyController",
			controllerName2 = controllerName + "1",
			controllerId = "myTestController",
			controllerId2 = controllerId + "1";
		
		it("Define Controller", function(){
			var clazz = Firebrick.define(controllerName, {
				extend:"Firebrick.controller.Base"
			});

			expect( Firebrick.get(controllerName) ).toBeDefined();
			Firebrick.classes.removeClass(clazz);
		});
		
		it("Create Controller - shorthand", function(){
			var clazz1 = Firebrick.createController(controllerName, {
					id:controllerId
				}),
				clazz2 = Firebrick.create(controllerName2, {
					extend:"Firebrick.controller.Base",
					id:controllerId2
				});
			
			expect( Firebrick.getById(controllerId) ).toBeDefined();
			expect( Firebrick.getById(controllerId2) ).toBeDefined();
			
			expect( Firebrick.get(controllerName) ).toBeDefined();
			expect( Firebrick.get(controllerName2) ).toBeDefined();
			
			expect( Firebrick.getById(controllerId).id ).toBe( controllerId );
			expect( Firebrick.getById(controllerId2).id ).toBe( controllerId2 );
			
			Firebrick.classes.removeClass(clazz1);
			Firebrick.classes.removeClass(clazz2);
		});
		
	});
});
