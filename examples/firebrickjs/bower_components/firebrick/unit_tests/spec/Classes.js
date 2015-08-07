/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick", "Test/class/Class1"], function($, Firebrick){
	"use strict";
	describe("Classes: ", function() {
		
		it("Remove Class", function(){
			var name = "ABC";
			
			Firebrick.create(name);
			
			expect( Firebrick.get(name) ).toBeDefined();
			Firebrick.classes.removeClass(name);
			expect( Firebrick.classes._createdClasses[name] ).not.toBeDefined();
		});
		
		it("Inheritance", function(){
			//Configuration
			var superClass = {
					a:1
				},
				obj = {
					b:2
				},
				newClass = Firebrick.classes.extend(obj, superClass),
				proto;

			expect( newClass ).toBeDefined();
			expect( newClass.a ).toBe(1);
			expect( newClass.hasOwnProperty("a") ).toBe(false);
			
			proto = Object.getPrototypeOf(newClass);
			expect( proto ).toBeDefined();
			expect( proto.a ).toBe(1);
			
			expect(superClass.b).not.toBeDefined();
			
		});
		
		it("Overwriting class properties", function(){
			var clazzName = "SomeClass",
				obj1 = Firebrick.define(clazzName, {
					abc: 1
				}),
				obj2 = {
					abc: "Steve"
				};
			
			expect(obj1.abc).toBe(1);
			Firebrick.classes.overwrite(clazzName, obj2);
			expect(obj1.abc).toBe("Steve");
			Firebrick.classes.removeClass(obj1);
		});
		
		it("Create Class", function(){
			var className = "abc",
				clazz = Firebrick.create(className, {
					name: "Steve",
					getName: function(){
						return this.name;
					}
				});
			
			expect(clazz).toBeDefined();
			expect(clazz.name).toBe("Steve");
			expect(clazz.getName()).toBe("Steve");
			Firebrick.classes.removeClass(clazz);
		});
		
		it("Create Class with Init", function(){
			var className = "abc1",
				clazz = Firebrick.define(className, {
					name: "Bob",
					init: function(){
						this.name = "Steve";
						//this.callParent(arguments) not needed here as there is no parent
					}
				});
			
			expect(clazz).toBeDefined();
			//init shouldn't be called yet
			expect(clazz.name).toBe("Bob");
			
			clazz = Firebrick.create(className);
			//now init was called
			expect(clazz.name).toBe("Steve");
			
		});
		
		it("Mixins", function(){
			var className = "mixinTest",
				mixinName = "MyMixin",
				mixin = Firebrick.define(mixinName, {
					abc:123
				}),
				clazz = Firebrick.define(className, {
					mixins:mixinName
				});
			
			expect(clazz._mixins).toBeDefined();
			expect(clazz._mixins[mixinName]).toBe(1);
			expect(Firebrick.classes.hasMixin(clazz, mixinName)).toBe(true);
			
			expect($.isPlainObject(clazz.mixins)).toBe(true);
			expect(mixin.abc).toBe(123);
			
			expect($.isPlainObject(clazz.mixins)).toBe(true);
			expect(clazz.abc).toBe(123);
			
			Firebrick.classes.removeClass(mixin);
			Firebrick.classes.removeClass(clazz);
			
		});
		
		it("Extend a class", function(){
			
			var clazz = Firebrick.define("AClass", {
				extend: "Test.class.Class1"	//found in the unit application direction "helpers"
			});
			
			expect(clazz.value).toBe(true);
			
			Firebrick.classes.removeClass(clazz);
		});
		
	});
});
