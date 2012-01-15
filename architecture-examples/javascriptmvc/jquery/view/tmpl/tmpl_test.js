steal.plugins('funcunit/qunit','jquery/view/tmpl').then(function(){
// use the view/qunit.html test to run this test script
module("jquery/view/tmpl")

test("ifs work", function(){
	$("#qunit-test-area").html("");
	
	$("#qunit-test-area").html("//jquery/view/tmpl/test.tmpl",{});
	ok($("#qunit-test-area").find('h1').length, "There's an h1")
})
});
