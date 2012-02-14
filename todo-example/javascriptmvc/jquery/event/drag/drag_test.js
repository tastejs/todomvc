steal.plugins("jquery/event/drop",
	'funcunit/qunit',
	'funcunit/syn').then("//jquery/event/drop/drop_test",function(){

module("jquery/event/drag",{
	makePoints : function(){
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
		$("#drop").css(basicCss).css({top: "30px", left: "30px"});
	}
})
test("dragging an element", function(){
	var div = $("<div>"+
			"<div id='drag'></div>"+
			"<div id='midpoint'></div>"+
			"<div id='drop'></div>"+
			"</div>");
	$("#qunit-test-area").html(div);
	var basicCss = {
		width: "20px",
		height: "20px",
		position: "absolute",
		border: "solid 1px black"
	}
	$("#drag").css(basicCss).css({top: "0px", left: "0px", zIndex: 1000, backgroundColor: "red"})
	$("#midpoint").css(basicCss).css({top: "0px", left: "30px"})
	$("#drop").css(basicCss).css({top: "30px", left: "30px"});
	
	
	var drags = {}, drops ={};
	
	$('#drag')
		.live("dragdown", function(){
			drags.dragdown = true;
		})
		.live("draginit", function(){
			drags.draginit = true;
		})
		.live("dragmove", function(){
			drags.dragmove = true;
		})
		.live("dragend", function(){
			drags.dragend = true;
		})
		.live("dragover", function(){
			drags.dragover = true;
		})
		.live("dragout", function(){
			drags.dragout = true;
		})
	$('#drop')
		.live("dropinit", function(){ 
			drops.dropinit = true;
		})
		.live("dropover", function(){ 
			drops.dropover = true;
		})
		.live("dropout", function(){ 
			drops.dropout = true;
		})
		.live("dropmove", function(){ 
			drops.dropmove = true;
		})
		.live("dropon", function(){ 
			drops.dropon = true;
		})
		.live("dropend", function(){ 
			drops.dropend = true;
		})

	stop();
	
	Syn.drag({to: "#midpoint"},"drag", function(){
		ok(drags.dragdown, "dragdown fired correctly")
		ok(drags.draginit, "draginit fired correctly")
		ok(drags.dragmove, "dragmove fired correctly")
		ok(drags.dragend, 	"dragend fired correctly")
		ok(!drags.dragover,"dragover not fired yet")
		ok(!drags.dragout, "dragout not fired yet")
		//console.log(drags, drags.dragout)
		ok(drops.dropinit, "dropinit fired correctly")
		ok(!drops.dropover,"dropover fired correctly")
		ok(!drops.dropout, "dropout not fired")
		ok(!drops.dropmove,"dropmove not fired")
		ok(!drops.dropon,	"dropon not fired yet")
		ok(drops.dropend, 	"dropend fired")
	}).drag({to: "#drop"}, function(){
		ok(drags.dragover,"dragover fired correctly")
		ok(drops.dropover, "dropmover fired correctly")
		ok(drops.dropmove, "dropmove fired correctly")
		ok(drops.dropon,	"dropon fired correctly")
	}).drag({to: "#midpoint"}, function(){
		ok(drags.dragout, 	"dragout fired correctly")
	
		ok(drops.dropout, 	"dropout fired correctly")
		//div.remove();
		start();
	})
	


	
})

test("drag position", function(){
	this.makePoints();
	
	
	var drags = {}, drops ={};
	
	$('#drag').live("draginit", function(){
		drags.draginit = true;
	})
	var offset = $('#drag').offset();

	stop();
	
	Syn.drag("+20 +20","drag", function(){
		var offset2 = $('#drag').offset();
		equals(offset.top+20, offset2.top, "top")
		equals(offset.left+20, offset2.left, "left")
		start();
	})
});

test("dragdown" , function(){
	var div = $("<div>"+
			"<div id='dragger'>"+
				"<p>Place to drag</p>"+
				"<input type='text' id='draginp' />"+
				"<input type='text' id='dragnoprevent' />"+
			"</div>"+
			"</div>");
	
	$("#qunit-test-area").html(div);
	$("#dragger").css({
		position: "absolute",
		backgroundColor : "blue",
		border: "solid 1px black",
		top: "0px",
		left: "0px",
		width: "200px",
		height: "200px"
	})
	var draginpfocused = false,
		dragnopreventfocused = false;
	
	$('#draginp').focus(function(){
		draginpfocused = true;
	})
	$('#dragnoprevent').focus(function(){
		dragnopreventfocused = true;
	})
	
	$('#dragger').bind("dragdown", function(ev, drag){
		if(ev.target.id == 'draginp'){
			drag.cancel();
		}else{
			ev.preventDefault();
		}
	})
	var offset = $('#dragger').offset();

	stop();
	Syn.drag("+20 +20","draginp", function(){
		var offset2 = $('#dragger').offset();
		equals(offset.top, offset2.top, "top")
		equals(offset.left, offset2.left, "left")
		
	}).drag("+20 +20","dragnoprevent", function(){
		var offset2 = $('#dragger').offset();
		equals(offset.top+20, offset2.top, "top")
		equals(offset.left+20, offset2.left, "left")
		// IE doesn't respect preventDefault on text inputs (http://www.quirksmode.org/dom/events/click.html)
		if(!$.browser.msie)
			ok(draginpfocused, "First input was allowed to be focused correctly");
		//ok(!dragnopreventfocused, "Second input was not allowed to focus");
		start();
	})

})

test("dragging child element (a handle)" , function(){
	var div = $("<div>"+
			"<div id='dragger'>"+
				"<div id='dragged'>Place to drag</div>"+
			"</div>"+
			"</div>");
	
	$("#qunit-test-area").html(div);
	$("#dragger").css({
		position: "absolute",
		backgroundColor : "blue",
		border: "solid 1px black",
		top: "0px",
		left: "0px",
		width: "200px",
		height: "200px"
	});

	var dragged = $('#dragged');
		
	$('#dragger').bind("draginit", function(ev, drag){
		drag.only();
		drag.representative(dragged);
	})
	
	stop();

	var offset = $('#dragger').offset();

	Syn.drag("+20 +20","dragged", function() {
		var offset2 = $('#dragger').offset();
		equals(offset.top, offset2.top, "top")
		equals(offset.left, offset2.left, "left")

		ok(dragged.is(':visible'), "Handle should be visible");

		start();
	});
});

});