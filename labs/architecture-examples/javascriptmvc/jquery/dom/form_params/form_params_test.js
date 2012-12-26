steal("jquery/dom/form_params")  //load your app
 .then('funcunit/qunit','jquery/view/micro')  //load qunit
 .then(function(){

$.ajaxSetup({
	cache : false
});
     
module("jquery/dom/form_params")
test("with a form", function(){

	$("#qunit-test-area").html("//jquery/dom/form_params/test/basics.micro",{})
	
	var formParams =  $("#qunit-test-area form").formParams() ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === "2","two is right");
	ok(formParams.params.three === "3","three is right");
	same(formParams.params.four,["4","1"],"four is right");
	same(formParams.params.five,["2","3"],"five is right");

	equal(typeof formParams.id , 'string', "Id value is empty");

	
});


test("with true false", function(){
	$("#qunit-test-area").html("//jquery/dom/form_params/test/truthy.micro",{});
	
	var formParams =  $("#qunit-test-area form").formParams(true);
	ok(formParams.foo === undefined, "foo is undefined")
	ok(formParams.bar.abc === true, "form bar is true");
	ok(formParams.bar.def === true, "form def is true");
	ok(formParams.bar.ghi === undefined, "form def is undefined");
	ok(formParams.wrong === false, "'false' should become false");
});

test("just strings",function(){
	$("#qunit-test-area").html("//jquery/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(false) ;
	ok(formParams.params.one === "1","one is right");
	ok(formParams.params.two === '2',"two is right");
	ok(formParams.params.three === '3',"three is right");
	same(formParams.params.four,["4","1"],"four is right");
	same(formParams.params.five,['2','3'],"five is right");
	$("#qunit-test-area").html('')
});

test("empty string conversion",function() {
	$("#qunit-test-area").html("//jquery/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(false) ;
	ok('' === formParams.empty, 'Default empty string conversion');
	formParams =  $("#qunit-test-area form").formParams(true);
	ok(undefined === formParams.empty, 'Default empty string conversion');
});

test("missing names",function(){
	$("#qunit-test-area").html("//jquery/dom/form_params/test/checkbox.micro",{});
	var formParams =  $("#qunit-test-area form").formParams() ;
	ok(true, "does not break")
});

test("same input names to array", function() {
	$("#qunit-test-area").html("//jquery/dom/form_params/test/basics.micro",{});
	var formParams =  $("#qunit-test-area form").formParams(true);
	same(formParams.param1, ['first', 'second', 'third']);
});

});
