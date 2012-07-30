(function(){
	var isReady,
		stateAfterScript;
		
//we probably have to have this only describing where the tests are
steal('jquery').then(function(){
	$(function(){
			isReady = true;
	})
},'jquery/class/class_test.js')
.then('jquery/controller/controller_test.js')
.then('jquery/dom/compare/compare_test.js')
.then('jquery/dom/cur_styles/cur_styles_test.js')
.then('jquery/dom/dimensions/dimensions_test.js')
.then('jquery/dom/form_params/form_params_test.js')
.then('jquery/dom/route/route_test.js')
.then('jquery/lang/lang_test.js')
.then('jquery/dom/fixture/fixture_test.js')
.then('jquery/event/default/default_test.js')
.then('jquery/event/destroyed/destroyed_test.js')
.then('jquery/event/drag/drag_test.js')
.then('jquery/event/hover/hover_test.js')
.then('jquery/event/key/key_test.js')
.then('jquery/tie/tie_test.js')
.then('jquery/controller/view/test/qunit')
.then('jquery/model/test/qunit')
.then('jquery/view/test/qunit')
.then('./integration.js')
.then('jquery/event/default/default_pause_test.js',function(){
	
	stateAfterScript = isReady;
	module('jquery v steal');


	test("jquery isn't ready", function(){
		ok(!stateAfterScript, "jQuery isn't ready yet")
	})
   	
});

})();
