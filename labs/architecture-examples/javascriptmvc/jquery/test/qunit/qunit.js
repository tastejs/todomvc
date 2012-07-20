//we probably have to have this only describing where the tests are
steal('//jquery/class/class_test',
	  '//jquery/controller/controller_test',
	  '//jquery/dom/compare/compare_test',
	  '//jquery/dom/cur_styles/cur_styles_test',
	  '//jquery/lang/lang_test',
	  '//jquery/lang/deparam/deparam_test',
	  '//jquery/dom/fixture/fixture_test',
	  '//jquery/event/default/default_test',
	  '//jquery/event/drag/drag_test',
	  '//jquery/event/key/key_test',
	  '//jquery/tie/tie_test'
	  
	  
	  ).plugins(	

'jquery/controller/view/test/qunit',



'jquery/dom/dimensions/test/qunit',

'jquery/dom/form_params/test/qunit',

'jquery/event/destroyed/test/qunit',
'jquery/event/hover/test/qunit',




'jquery/model/test/qunit',

'jquery/view/test/qunit',
	'jquery/view/ejs/test/qunit'
).then('integration',
	   '//jquery/event/default/default_pause_test')
