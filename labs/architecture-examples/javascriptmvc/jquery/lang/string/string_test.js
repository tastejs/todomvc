steal('funcunit/qunit','./string').then(function(){
	
module("jquery/lang/string")

test("$.String.sub", function(){
	equals($.String.sub("a{b}",{b: "c"}),"ac")
	
	var foo = {b: "c"};
	
	equals($.String.sub("a{b}",foo,true),"ac");
	
	ok(!foo.b, "removed this b");
	
	
});

test("$.String.sub double", function(){
	equals($.String.sub("{b} {d}",[{b: "c", d: "e"}]),"c e");
})

test("String.underscore", function(){
	equals($.String.underscore("Foo.Bar.ZarDar"),"foo.bar.zar_dar")
})


test("$.String.getObject", function(){
	var obj = $.String.getObject("foo", [{a: 1}, {foo: 'bar'}]);
	
	equals(obj,'bar', 'got bar')
	
	
	// test null data
	
	var obj = $.String.getObject("foo", [{a: 1}, {foo: 0}]);
	
	equals(obj,0, 'got 0 (falsey stuff)')
});

test("$.String.niceName", function(){
	var str = "some_underscored_string";
	var niceStr = $.String.niceName(str);
	equals(niceStr, 'Some Underscored String', 'got correct niceName');
})

	
}).then('./deparam/deparam_test');
