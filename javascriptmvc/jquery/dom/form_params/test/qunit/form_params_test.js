module("jquery/dom/form_params")
test("with a form", function(){

	$("#qunit-test-area").html("//jquery/dom/form_params/test/qunit/basics.micro",{})
	
	var formParams =  $("#qunit-test-area form").formParams() ;
	ok(formParams.params.one === 1,"one is right");
	ok(formParams.params.two === 2,"two is right");
	ok(formParams.params.three === 3,"three is right");
	same(formParams.params.four,["4","1"],"four is right");
	same(formParams.params.five,[2,3],"five is right");
	
	
});


test("with true false", function(){
	$("#qunit-test-area").html("//jquery/dom/form_params/test/qunit/truthy.micro",{});
	
	var formParams =  $("#qunit-test-area form").formParams();
	ok(formParams.foo === undefined, "foo is undefined")
	ok(formParams.bar.abc === true, "form bar is true");
	ok(formParams.bar.def === true, "form def is true");
	ok(formParams.bar.ghi === undefined, "form def is undefined");

});

test("just strings",function(){
	$("#qunit-test-area").html("//jquery/dom/form_params/test/qunit/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(false) ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === '2',"two is right");
	ok(formParams.params.three === '3',"three is right");
	same(formParams.params.four,["4","1"],"four is right");
	same(formParams.params.five,['2','3'],"five is right");
	$("#qunit-test-area").html('')
})

test("missing names",function(){
	$("#qunit-test-area").html("//jquery/dom/form_params/test/qunit/checkbox.micro",{});
	var formParams =  $("#qunit-test-area form").formParams() ;
	ok(true, "does not break")
})