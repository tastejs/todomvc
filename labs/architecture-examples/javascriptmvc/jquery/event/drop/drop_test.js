steal('funcunit','funcunit/syn').then(function(){
	
module("jquery/event/drop");

test("new drop added",2, function(){
	var div = $("<div>"+
			"<div id='drag'></div>"+
			"<div id='midpoint'></div>"+
			"<div id='drop'></div>"+
			"</div>");
	
	div.appendTo($("#qunit-test-area"));
	var basicCss = {
		width: "20px",
		height: "20px",
		position: "absolute",
		border: "solid 1px black"
	}
	$("#drag").css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "red"})
	$("#midpoint").css(basicCss).css({top: "0px", left: "30px"})
	$("#drop").css(basicCss).css({top: "0px", left: "60px"});
	
	$('#drag').bind("draginit", function(){});
	
	$("#midpoint").bind("dropover",function(){
		ok(true, "midpoint called");
		
		$("#drop").bind("dropover", function(){
			ok(true, "drop called");
		});
		$.Drop.compile();
	});
	stop();
	Syn.drag({to: "#drop"},"drag", function(){
		start();
	});
});
	
	
	
})
