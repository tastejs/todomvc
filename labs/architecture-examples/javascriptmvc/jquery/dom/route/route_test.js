steal('funcunit/qunit').then('./route.js',function(){

module("jquery/dom/route")

test("deparam", function(){
	$.route.routes = {};
	$.route(":page",{
		page: "index"
	})

	var obj = $.route.deparam("jQuery.Controller");
	same(obj, {
		page : "jQuery.Controller",
		route: ":page"
	});

	obj = $.route.deparam("");
	same(obj, {
		page : "index",
		route: ":page"
	});

	obj = $.route.deparam("jQuery.Controller&where=there");
	same(obj, {
		page : "jQuery.Controller",
		where: "there",
		route: ":page"
	});
    
    $.route.routes = {};
    $.route(":page/:index",{
        page: "index",
        index: "foo"
	});

    obj = $.route.deparam("jQuery.Controller/&where=there");
	same(obj, {
		page : "jQuery.Controller",
        index: "foo",
		where: "there",
		route: ":page/:index"
	});
})

test("deparam of invalid url", function(){
    $.route.routes = {};
    $.route("pages/:var1/:var2/:var3", {
        var1: 'default1',
        var2: 'default2',
        var3: 'default3'
    });
    
    // This path does not match the above route, and since the hash is not 
    // a &key=value list there should not be data.
    obj = $.route.deparam("pages//");
	same(obj, {});

    // A valid path with invalid parameters should return the path data but
    // ignore the parameters.
    obj = $.route.deparam("pages/val1/val2/val3&invalid-parameters");
	same(obj, {
        var1: 'val1',
        var2: 'val2',
        var3: 'val3',
		route: "pages/:var1/:var2/:var3"
    });
})

test("deparam of url with non-generated hash (manual override)", function(){
	$.route.routes = {};
    
	// This won't be set like this by route, but it could easily happen via a 
	// user manually changing the URL or when porting a prior URL structure.
	obj = $.route.deparam("page=foo&bar=baz&where=there");
	same(obj, {
		page: 'foo',
		bar: 'baz',
		where: 'there'
	});
})

test("param", function(){
	$.route.routes = {};
	$.route("pages/:page",{
		page: "index"
	})

	var res = $.route.param({page: "foo"});
	equals(res, "pages/foo")

	res = $.route.param({page: "foo", index: "bar"});
	equals(res, "pages/foo&index=bar")

	$.route("pages/:page/:foo",{
		page: "index",
        foo: "bar"
	})

    res = $.route.param({page: "foo", foo: "bar", where: "there"});
	equals(res, "pages/foo/&where=there")

    // There is no matching route so the hash should be empty.
    res = $.route.param({});
	equals(res, "")

    $.route.routes = {};
    
    res = $.route.param({page: "foo", bar: "baz", where: "there"});
	equals(res, "&page=foo&bar=baz&where=there")

    res = $.route.param({});
	equals(res, "")
});

test("symmetry", function(){
	$.route.routes = {};
	
	var obj = {page: "=&[]", nestedArray : ["a"], nested : {a :"b"}  }
	
	var res = $.route.param(obj)
	
	var o2 = $.route.deparam(res)
	same(o2, obj)
})

test("light param", function(){
	$.route.routes = {};
	$.route(":page",{
		page: "index"
	})

	var res = $.route.param({page: "index"});
	equals(res, "")

    $.route("pages/:p1/:p2/:p3",{
		p1: "index",
        p2: "foo",
        p3: "bar"
	})

    res = $.route.param({p1: "index", p2: "foo", p3: "bar"});
	equals(res, "pages///")

    res = $.route.param({p1: "index", p2: "baz", p3: "bar"});
	equals(res, "pages//baz/")
});

test('param doesnt add defaults to params', function(){
	$.route.routes = {};
	
	$.route("pages/:p1",{
        p2: "foo"
	})
	var res = $.route.param({p1: "index", p2: "foo"});
	equals(res, "pages/index")
})

test("param-deparam", function(){
    
	$.route(":page/:type",{
		page: "index",
        type: "foo"
	})

    var data = {page: "jQuery.Controller", 
				type: "document", 
				bar: "baz", 
				where: "there"};
    var res = $.route.param(data);
    var obj = $.route.deparam(res);
	delete obj.route
	same(obj,data )
	return;
    data = {page: "jQuery.Controller", type: "foo", bar: "baz", where: "there"};
    res = $.route.param(data);
    obj = $.route.deparam(res);
	delete obj.route;
	same(data, obj)
	
	data = {page: " a ", type: " / "};
    res = $.route.param(data);
    obj = $.route.deparam(res);
	delete obj.route;
	same(obj ,data ,"slashes and spaces")

    data = {page: "index", type: "foo", bar: "baz", where: "there"};
    res = $.route.param(data);
    obj = $.route.deparam(res);
	delete obj.route;
	same(data, obj)

    $.route.routes = {};
    
    data = {page: "foo", bar: "baz", where: "there"};
    res = $.route.param(data);
    obj = $.route.deparam(res);
	same(data, obj)
})

test("precident", function(){
	$.route.routes = {};
	$.route(":who",{who: "index"});
	$.route("search/:search");

	var obj = $.route.deparam("jQuery.Controller");
	same(obj, {
		who : "jQuery.Controller",
		route: ":who"
	});

	obj = $.route.deparam("search/jQuery.Controller");
	same(obj, {
		search : "jQuery.Controller",
		route: "search/:search"
	},"bad deparam");

	equal( $.route.param({
			search : "jQuery.Controller"
		}),
		"search/jQuery.Controller" , "bad param");

	equal( $.route.param({
			who : "jQuery.Controller"
		}),
		"jQuery.Controller" );
})

test("precident2", function(){
	$.route.routes = {};
	$.route(":type",{who: "index"});
	$.route(":type/:id");

	equal( $.route.param({
			type : "foo",
			id: "bar"
		}),
		"foo/bar" );
})

test("linkTo", function(){
    $.route.routes = {};
    $.route(":foo");
    var res = $.route.link("Hello",{foo: "bar", baz: 'foo'});
    equal( res, '<a href="#!bar&baz=foo" >Hello</a>');
})

test("param with route defined", function(){
	$.route.routes = {};
	$.route("holler")
	$.route("foo");
	
	var res = $.route.param({foo: "abc",route: "foo"});
	
	equal(res, "foo&foo=abc")
})

test("route endings", function(){
	$.route.routes = {};
	$.route("foo",{foo: true});
	$.route("food",{food: true})
	
	var res = $.route.deparam("food")
	ok(res.food, "we get food back")
	
})

})
