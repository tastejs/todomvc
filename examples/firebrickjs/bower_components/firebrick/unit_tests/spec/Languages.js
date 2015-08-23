/*!
* Firebrick JS - Unit Tests
* @author Steven Masala [me@smasala.com]
*/
define(["jquery", "firebrick"], function($, Firebrick){
	"use strict";
	describe("Languages: ", function() {
		
		var key = "lang.test.key.123",
			data = {
				en: {
					greet:"Hallo",
					"say.goodbye": "cya"
				},
				de: {
					greet:"Hallo",
					"say.goodbye": "tschuss"
				}
			};
		
		it("Undefined key", function(){
			expect(Firebrick.text(key)).toBe(key);
		});
		
		it("Populate", function(){
			
			Firebrick.languages.init(data);
			
			Firebrick.languages.setLang("en");
			expect(Firebrick.text("say.goodbye")).toBe("cya");
			
			Firebrick.languages.setLang("de");
			expect(Firebrick.text("say.goodbye")).toBe("tschuss");
			
			expect(Firebrick.languages.allLanguages().length).toBe(2);
		});
		
	});
});
