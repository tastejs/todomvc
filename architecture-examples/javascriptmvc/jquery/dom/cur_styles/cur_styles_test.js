steal
 .plugins("jquery/dom/dimensions",'jquery/view/micro')  //load your app
 .plugins('funcunit/qunit').then(function(){

module("jquery/dom/curStyles");


test("reading", function(){
	
	$("#qunit-test-area").html("//jquery/dom/cur_styles/test/curStyles.micro",{})

	var res = $.curStyles( $("#styled")[0], 
	   ["padding-left",
		'position',
		'display',
		"margin-top", 
		"borderTopWidth",
		"float"] );
	equals(res.borderTopWidth, "2px","border top");
	equals(res.display, "block","display");
	equals(res.cssFloat, "left","float");
	equals(res.marginTop, "10px","margin top");
	equals(res.paddingLeft, "5px","padding left");
	equals(res.position, "relative","position");
	$("#qunit-test-area").html("")
});

})

