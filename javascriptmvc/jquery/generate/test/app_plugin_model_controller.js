load('steal/rhino/steal.js')
load('steal/rhino/test.js');

(function(rhinoSteal){
	_S = steal.test;
	
	
	_S.module("jquery/generate")
	STEALPRINT = false;
	
	_S.test("app" , function(t){
		_args = ['cnu']; 
		load('jquery/generate/app');
		_S.clear();
		_S.open('cnu/cnu.html')
		t.ok(typeof steal !== 'undefined', "steal is fine")
		_S.clear();
	})
	
	_S.test("app 2 levels deep" , function(t){		
		_args = ['cnu/widget']; 
		load('jquery/generate/plugin');
		_S.clear();
		_S.open('cnu/widget/widget.html')
		t.ok(typeof steal !== 'undefined', "steal is fine")
		_S.clear();
	})
	
	/**
	 * Tests generating a very basic controller and model
	 */
	
	_S.test("controller, model, and page" , function(t){		
		_args = ['Cnu.Controllers.Todos']; 
		load('jquery/generate/controller');
		_S.clear();

		_args = ['Cnu.Models.Todo']; 
		load('jquery/generate/model');
		_S.clear();
		cnuContent = readFile('cnu/cnu.js').
		    replace(".models()", ".models('todo')").
		    replace(".controllers()", ".controllers('todos')");
		load('steal/rhino/steal.js')
		new steal.File('cnu/cnu.js').save( cnuContent );
		

		_args = ['cnu','cnugen.html']; 
		load('jquery/generate/page');
		_S.clear();
		
		_S.open('cnu/cnugen.html');
		
		t.ok(typeof Cnu.Controllers.Todos !== 'undefined', "Cnu.Controllers.Todos")
		t.ok(typeof Cnu.Controllers.Todos !== 'undefined',"load Cnu.Controllers.Todos")
		t.ok(typeof Cnu.Models.Todo !== 'undefined', "load Cnu.Models.Todo")
		
		rhinoSteal.File("cnu").removeDir();
	})
	
})(steal);
