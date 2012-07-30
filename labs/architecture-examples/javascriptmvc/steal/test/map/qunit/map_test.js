module("steal")

test("map", function() {
	ok(foo, "foo was loaded");
	ok(foo2, "foo2 was loaded");
	ok(another, "another was loaded");
	ok(second, "second was loaded");
	ok($, "$ was loaded");
	ok($.String.capitalize, "$.String.capitalize was loaded");
})
