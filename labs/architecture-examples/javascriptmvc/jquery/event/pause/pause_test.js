steal.plugins('funcunit/qunit','funcunit/syn','jquery/event/pause').then(function(){

module("jquery/event/pause", {setup : function(){
	$("#qunit-test-area").html("")
	var div = $("<div id='wrapper'><ul id='ul'>"+
				"<li><p>Hello</p>"+
					"<ul><li><p id='foo'>Foo Bar</p></li></ul>"+
				"</li></ul></div>").appendTo($("#qunit-test-area"));
	
}});

test("basics",3, function(){
	
	var calls =0,
		lastTime,
		space = function(){
			if(lastTime){
				
				ok(new Date - lastTime > 35,"space between times "+(new Date - lastTime))
			}
			lastTime = new Date()
		};
	
	$('#ul').delegate("li", "show",function(ev){
		calls++;
		space();
		
		ev.pause();
		
		setTimeout(function(){
			ev.resume();	
		},100)
		
	})
	
	$('#wrapper').bind('show', function(){
		space()
		equals(calls, 2, "both lis called");
		start()
	});
	stop();
	$('#foo').trigger("show")
});







});