/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Stores:", function() {
		
		var data = {
				a:1,
				name: "Steve"
			},
			storeName = "SomeStore",
			store;
		
		beforeEach(function(){
			store = Firebrick.createStore(storeName, {
				data: data
			});
		});
		
		afterEach(function(){
			store.destroy();
			expect(Firebrick.get(storeName).status).toBe("destroyed");
		});
		
		it("Create store", function(){
			expect(store).toBeDefined();
		});
		
		it("Populate Store", function(){
			expect(store.getData().name()).toBe("Steve");
			
			store.getData().name("Fred");
			expect(store.getData().name()).toBe("Fred");
			
		});
		
		
	});	
});
