/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Utils:", function() {
		
		it("Overwrite", function(){
			var obj1 = {a: 1, b:10},
				obj2 = {a: 5};
			
			expect(obj1.a).toBe(1);
			expect(obj1.b).toBe(10);
			obj1 = Firebrick.utils.overwrite(obj1, obj2);
			expect(obj1.a).toBe(5);
			expect(obj1.b).toBe(10);
		});
		
		it("Copyover", function(){
			var obj1 = {a: 1, b:10},
				obj2 = {a: 5};
			
			expect(obj1.a).toBe(1);
			expect(obj1.b).toBe(10);
			obj1 = Firebrick.utils.copyover(obj1, obj2);
			expect(obj1.a).toBe(1);
			expect(obj1.b).toBe(10);
		});
		
		it("Merge properties", function(){
			
//			{
//				a:{
//					aa:1
//				},
//				//parent (extended from)
//				__proto__:{
//					a:{
//						aa:10,
//						bb:20,
//						cc:30
//					}
//				}
//			}
			
			var obj = {
					a: {
						aa:10,
						bb:20,
						cc:30
					}
				};
			
			obj = Object.create(obj, {
					a: {
						value: {
							aa:1
						},
						enumerable: true,
						writable: true
					}
				});
			
			expect(obj.a.aa).toBe(1);
			expect(obj.a.bb).toBeUndefined();
			
			obj = Firebrick.utils.merge("a", obj);
			
			expect(obj.a.aa).toBe(1);
			expect(obj.a.bb).toBe(20);
			expect(obj.a.cc).toBe(30);
			
			expect(Object.getPrototypeOf(obj).a.aa).toBe(10);
			
		});
		
		it("delay", function(done){
			
			Firebrick.utils.delay(function(){
				expect(true).toBe(true);
				done();
			}, 2);
			
		});
		
		it("intervals", function(done){
			var calls = 0;
			
			Firebrick.utils.setInterval(function(){
				var id = this.id;
				calls++;
				if(calls > 1){
					expect(calls).toBe(2);
					expect(Firebrick.utils.isIntervalRunning(id)).toBe(true);
					this.stop();
					expect(Firebrick.utils.isIntervalRunning(id)).toBe(false);
					done();
					return;
				}
				
				expect(calls).toBeLessThan(2);
			}, 2);
			
		});
		
		it("Strip arguments", function(){
			
			var func1 =  function(){
					var args = Firebrick.utils.stripArguments(arguments);
					expect(arguments[0]).not.toBe(1);
					expect(args[0]).toBe(1);
				},
				func2 = function(){
					return func1(arguments);
				};
			
			
			func2(1,2,3);
			
		});
		
		it("Resolve class path", function(){
			var classname = "Test.class.Class1",
				path = Firebrick.utils.getPathFromName(classname),
				oldAppName = Firebrick.app.name;
			
			expect(path).toBe("Test/class/Class1");
			
			classname = "Test.abc.class.Class1";
			Firebrick.app.name = "Test.abc";
			path = Firebrick.utils.getPathFromName(classname);
			expect(path).toBe("Test.abc/class/Class1");
			
			//reset
			Firebrick.app.name = oldAppName;
		});
		
		it("Unique Id", function(){
			var id = Firebrick.utils.uniqId();
			expect(typeof id).toBe("string");
			expect(id.length).toBeGreaterThan(5);
		});
		
	});	
});
