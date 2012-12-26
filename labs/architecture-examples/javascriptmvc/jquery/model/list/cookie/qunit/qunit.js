steal('funcunit/qunit','jquery/model/list/cookie').then(function($){
	
module("jquery/model/list/cookie",{
	setup: function(){
		// clear any existing cookie ... 
		$.cookie("list", "", {expires: -1})
		$.Model.extend("Search", {}, {});
		
		$.Model.List.Cookie.extend("Search.Store")
	}
})

test("storing and retrieving",function(){
	
	var store = new Search.Store([]) //should be able to look up by namespace ....
	
	ok(!store.length, "empty list");
	
	store.push( new Search({id: 1}), new Search({id: 2})   )
	store.store("list");
	
	var store2 = new Search.Store([]).retrieve("list");
	equals(store2.length, 2, "there are 2 items")
	
})
	
})
