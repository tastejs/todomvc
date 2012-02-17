steal.plugins('funcunit/qunit','funcunit/syn','jquery/event/key').then(function(){
	
module('jquery/event/key');

test("type some things", function(){
	$("#qunit-test-area").append("<input id='key' />")
	var keydown, keypress, keyup;
	$('#key').keydown(function(ev){
		keydown = ev.key();
	}).keypress(function(ev){
		keypress = ev.key();
	}).keyup(function(ev){
		keyup = ev.key();
	});
	
	stop();
	
	Syn.key("a","key", function(){
		equals(keydown, "a","keydown");
		equals(keypress,"a","keypress");
		equals(keyup,   "a","keyup");
		start();
	});
})
	
})
