steal.plugins('funcunit/qunit',
	'jquery/model',
	'jquery/controller',
	'jquery/view/ejs',
	'jquery/dom/fixture')
	.then(function(){
	
module('integration',{
	setup : function(){
		$("#qunit-test-area").html("")
	}
});

test("controller can listen to model instances and model classes", function(){
	
	
	$("#qunit-test-area").html("");
	
	
	
	$.Controller("Test.BinderThing",{
		"{model} created" : function(){
			ok(true,"model called");
			start();
		},
		"{instance} created" : function(){
			ok(true, "instance updated")
		}
	});
	
	$.Model("Test.ModelThing",{
		create : function(attrs, success){
			success({id: 1})
		}
	});
	
	
	var inst = new Test.ModelThing();
	
	$("<div>").appendTo( $("#qunit-test-area") )
		.test_binder_thing({
			model : Test.ModelThing,
			instance: inst
		});
		
	inst.save();
	stop();
})


test("Model and Views", function(){
	stop();
	
	$.Model("Test.Thing",{
		findOne : "/thing"
	},{})
	
	$.fixture("/thing","//jquery/test/thing.json")
	
	var res = $.View("//jquery/test/template.ejs",
		Test.Thing.findOne());
		
	res.done(function(resolved){
		equals(resolved,"foo","works")
		start()
	})
})
	
})
