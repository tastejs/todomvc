steal('funcunit/qunit','./object',function(){

module("object");

test("same", function(){
	
	
	ok( $.Object.same({type: "FOLDER"},{type: "FOLDER", count: 5}, {
		count: null
	}), "count ignored" );
	
	ok( $.Object.same({type: "folder"},{type: "FOLDER"}, {
		type: "i"
	}), "folder case ignored" );
})

test("subsets", function(){
	
	var res1 = $.Object.subsets({parentId: 5, type: "files"},
		[{parentId: 6}, {type: "folders"}, {type: "files"}]);
		
	same(res1,[{type: "files"}])
	
	var res2 = $.Object.subsets({parentId: 5, type: "files"},
		[{}, {type: "folders"}, {type: "files"}]);
		
	same(res2,[{},{type: "files"}]);
	
	var res3 = $.Object.subsets({parentId: 5, type: "folders"},
		[{parentId: 5},{type: "files"}]);
		
	same(res3,[{parentId: 5}])
});

test("subset compare", function(){
	
	ok( $.Object.subset(
		{type: "FOLDER"},
		{type: "FOLDER"}), 
		
		"equal sets" );
	
	ok( $.Object.subset(
		{type: "FOLDER", parentId: 5},
		{type: "FOLDER"}), 
		
		"sub set" );
	
	ok(! $.Object.subset(
		{type: "FOLDER"},
		{type: "FOLDER", parentId: 5}), 
		
		"wrong way" );
	
	
	ok(! $.Object.subset(
		{type: "FOLDER", parentId: 7},
		{type: "FOLDER", parentId: 5}), 
		
		"different values" );

	ok( $.Object.subset(
		{type: "FOLDER", count: 5}, // subset
		{type: "FOLDER"},
		{count: null} ), 
		
		"count ignored" );
	
	
	ok( $.Object.subset(
		{type: "FOLDER", kind: "tree"}, // subset
		{type: "FOLDER", foo: true, bar: true },
		{foo: null, bar: null} ), 
		
		"understands a subset" );
	ok( $.Object.subset(
		{type: "FOLDER", foo: true, bar: true },
		{type: "FOLDER", kind: "tree"}, // subset
		
		{foo: null, bar: null, kind : null} ), 
		
		"ignores nulls" );
});

test("searchText", function(){
	var item = {
			id: 1,
			name: "thinger"
		},
		searchText = {
			searchText : "foo"
		},
		compare = {
			searchText : function(items, paramsText, itemr, params){
				equals(item,itemr);
				equals(searchText, params)
				return true;
			}
		};
		
	ok( $.Object.subset( item, searchText, compare ), "searchText" );
});


});