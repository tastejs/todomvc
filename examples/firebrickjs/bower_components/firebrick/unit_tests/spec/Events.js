/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Events: ", function() {
		
		it("(de)Register events 1", function(){

			Firebrick.addListener("hello1", function(){});
			expect(Firebrick.events._eventRegistry.hello1).toBeDefined();
			
			Firebrick.events.removeListener("hello1");
			expect(Firebrick.events._eventRegistry.hello1).not.toBeDefined();
		});
		
		it("(de)Register events 2", function(){
			var f = function(){};
			Firebrick.addListener("hello1", f);
			Firebrick.addListener("hello1", function(){});
			expect(Firebrick.events._eventRegistry.hello1).toBeDefined();
			expect(Firebrick.events._eventRegistry.hello1.length).toBe(2);
			
			Firebrick.events.removeListener("hello1", f);
			expect(Firebrick.events._eventRegistry.hello1.length).toBe(1);
			
			Firebrick.events.removeListener("hello1");
			expect(Firebrick.events._eventRegistry.hello1).not.toBeDefined();
		});

		it("Fire Event", function(){
			
			var eN = "testEvent";
			
			Firebrick.addListener(eN, function(event, int){
				expect(event).toBeDefined();
				expect($.isPlainObject(event)).toBe(true);
				expect(event.event).toBe(eN);
				expect($.isFunction(event.removeSelf)).toBe(true);
				expect(int).toBe(5);
				event.removeSelf();
				expect(Firebrick.events._eventRegistry[eN]).not.toBeDefined();
			});
			
			Firebrick.fireEvent(eN, 5);
			
		});
		
		
		it("Multiple Listeners", function(){
			
			Firebrick.addListener({
				test1: function(){},
				test2: function(){}
			});
			
			expect(Firebrick.events._eventRegistry.test1).toBeDefined();
			expect(Firebrick.events._eventRegistry.test2).toBeDefined();
			
			Firebrick.events.removeListener("test1");
			Firebrick.events.removeListener("test2");
			
			expect(Firebrick.events._eventRegistry.test1).not.toBeDefined();
			expect(Firebrick.events._eventRegistry.test2).not.toBeDefined();
			
		});
		
		it("On events", function(){
			var id = "abc123",
				elem;
			
			$("body").append("<div id='"+id+"' class='outOfSight'></div>");
			elem = $("#abc123");
			expect(elem.length).toBe(1);
			
			Firebrick.events.on("click", "#" + id, function(){
				expect(true).toBe(true);
			});
			
			elem[0].click();
			elem.remove();
			
		});
		
		it("Off events 1", function(){
			var id = "abc123",
				hid = "#" + id, 
				elem,
				clicked = false,
				f = function(){
					clicked = true;
				};
			
			$("body").append("<div id='"+id+"' class='outOfSight'></div>");
			elem = $(hid);
			expect(elem.length).toBe(1);
			
			Firebrick.events.on("click", hid, f);
			Firebrick.events.off("click", hid, f);
			
			elem[0].click();
			
			expect(clicked).toBe(false);
			
			elem.remove();
			
		});
		
		it("Off events 2 (destroy)", function(){
			var clicked = 0;
			Firebrick.events.on("click", "html", function(){
				clicked++;
				this.destroy();
			});
			
			$("html")[0].click();
			
			expect(clicked).toBe(1);
		});
		
	});
});
