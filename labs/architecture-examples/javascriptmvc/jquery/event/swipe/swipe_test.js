steal('funcunit/qunit','funcunit/syn','jquery/event/swipe').then(function(){

module("jquery/swipe", {setup : function(){
	$("#qunit-test-area").html("")
	var div = $("<div id='outer'>"+
			"<div id='inner1'>one</div>"+
			"<div id='inner2'>two<div id='inner3'>three</div></div>"+
			"</div>");
	
	div.appendTo($("#qunit-test-area"));
	var basicCss = {
		position: "absolute",
		border: "solid 1px black"
	}
	$("#outer").css(basicCss).css({top: "10px", left: "10px", 
		zIndex: 1000, backgroundColor: "green", width: "200px", height: "200px"})
}});

test("swipe right event",2, function(){
	
	$("#outer").bind("swipe",function(){
		ok(true,"swipe called");
	}).bind("swipeleft", function(){
		ok(false, "swipe left")
	}).bind("swiperight", function(){
		ok(true, "swiperight")
	});
	stop();
	Syn.drag({
		from: "20x20",
		to: "50x20",
		duration: 100,
	},"outer", function(){
		start();
	})
	
});


test("swipe left event",2, function(){
	
	$("#outer").bind("swipe",function(){
		ok(true,"swipe called");
	}).bind("swipeleft", function(){
		ok(true, "swipe left")
	}).bind("swiperight", function(){
		ok(false, "swiperight")
	});
	stop();
	Syn.drag({
		from: "50x20",
		to: "20x20",
		duration: 100,
	},"outer", function(){
		start();
	})
	
});


test("swipe up event",2, function(){
	
	$("#outer").bind("swipe",function(){
		ok(true,"swipe called");
	}).bind("swipeup", function(){
		ok(true, "swipe left")
	}).bind("swiperight", function(){
		ok(false, "swiperight")
	}).bind("swipedown", function(){
		ok(false, "swipedown")
	});
	stop();
	Syn.drag({
		from: "20x50",
		to: "20x20",
		duration: 100,
	},"outer", function(){
		start();
	})
	
});

test("swipe down event",2, function(){
	
	$("#outer").bind("swipe",function(){
		ok(true,"swipe called");
	}).bind("swipeup", function(){
		ok(false, "swipe left")
	}).bind("swiperight", function(){
		ok(false, "swiperight")
	}).bind("swipedown", function(){
		ok(true, "swipedown")
	});
	stop();
	Syn.drag({
		from: "20x20",
		to: "20x50",
		duration: 100,
	},"outer", function(){
		start();
	})
	
});






})