steal("jquery/event/destroyed")  //load your app
 .then('funcunit/qunit') 
 .then(function(){

module("jquery/event/destroyed")
test("removing an element", function(){
	var div = $("<div/>").data("testData",5)
	div.appendTo($("#qunit-test-area"))
	var destroyed = false;
	div.bind("destroyed",function(){
		destroyed = true;
		equals($(this).data("testData"),5, "other data still exists")
	})
	div.remove();
	ok(destroyed, "destroyed called")
});

});