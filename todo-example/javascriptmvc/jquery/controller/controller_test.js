steal
 .plugins("jquery/controller",'jquery/controller/subscribe')  //load your app
 .plugins('funcunit/qunit')  //load qunit
 .then(function(){
 	
module("jquery/controller")
test("subscribe testing works", function(){
	
	var ta = $("<div/>").appendTo( $("#qunit-test-area") )
	
	ta.html("click here")

	var clicks = 0, destroys = 0;
	var subscribes = 0;
	$.Controller.extend("MyTest",{
		click: function() {
			clicks++
		},
		"a.b subscribe" : function() {
			subscribes++
		},
		destroy: function() {
			
			this._super()
			destroys++;
		}
	})
	ta.my_test();
	ta.trigger("click")
	equals(clicks,1, "can listen to clicks")
	
	OpenAjax.hub.publish("a.b",{})
	equals(subscribes,1, "can subscribe")
	var controllerInstance = ta.controller('my_test')
	ok( controllerInstance.Class == MyTest, "can get controller" )
	controllerInstance.destroy()
	
	equals(destroys,1, "destroy called once")
	ok(!ta.controller(), "controller is removed")
	
	OpenAjax.hub.publish("a.b",{})
	equals(subscribes,1, "subscription is torn down")
	ta.trigger("click")
	equals(clicks,1, "No longer listening")
	
	
	
	ta.my_test();
	ta.trigger("click")
	OpenAjax.hub.publish("a.b",{})
	equals(clicks,2, "can listen again to clicks")
	equals(subscribes,2, "can listen again to subscription")
	
	ta.remove();
	
	ta.trigger("click")
	OpenAjax.hub.publish("a.b",{})
	equals(clicks,2, "Clicks stopped")
	equals(subscribes,2, "Subscribes stopped")
})


test("document and main controllers", function(){
	var a = $("<div id='test'><span/></div>").appendTo($("#qunit-test-area")),
		a_inner = a.find('span'),
		b = $("<div><span/></div>").appendTo($("#qunit-test-area")),
		b_inner = b.find('span'),
		doc_outer_clicks = 0,
		doc_inner_clicks = 0,
		main_outer_clicks = 0,
		main_inner_clicks = 0;

	$.Controller.extend("TestController", { onDocument: true }, {
		click: function() {
			doc_outer_clicks++;
		},
		"span click" : function() {
			doc_inner_clicks++;
		}
	})

	a_inner.trigger("click");
	equals(doc_outer_clicks,1,"document controller handled (no-selector) click inside listening element");
	equals(doc_inner_clicks,1,"document controller handled (selector) click inside listening element");

	b_inner.trigger("click");
	equals(doc_outer_clicks,1,"document controller ignored (no-selector) click outside listening element");
	equals(doc_inner_clicks,1,"document controller ignored (selector) click outside listening element");

	$(document.documentElement).controller('test').destroy();

	$.Controller.extend("MainController", { onDocument: true }, {
		click: function() {
			main_outer_clicks++;
		},
		"span click" : function() {
			main_inner_clicks++;
		}
	})

	b_inner.trigger("click");
	equals(main_outer_clicks,1,"main controller handled (no-selector) click");
	equals(main_inner_clicks,1,"main controller handled (selector) click");

	$(document.documentElement).controller('main').destroy();

	a.remove();
	b.remove();
})


test("bind to any special", function(){
	jQuery.event.special.crazyEvent = {
		
	}
	var called = false;
	jQuery.Controller.extend("WeirdBind",{
		crazyEvent: function() {
			called = true;
		}
	})
	var a = $("<div id='crazy'></div>").appendTo($("#qunit-test-area"))
	a.weird_bind();
	a.trigger("crazyEvent")
	ok(called, "heard the trigger");
	
	$("#qunit-test-area").html("")
	
})

test("parameterized actions", function(){
	var called = false;
	jQuery.Controller.extend("WeirderBind",{
		"{parameterized}" : function() {
			called = true;
		}
	})
	var a = $("<div id='crazy'></div>").appendTo($("#qunit-test-area"))
	a.weirder_bind({parameterized: "sillyEvent"});
	a.trigger("sillyEvent")
	ok(called, "heard the trigger")
	
	$("#qunit-test-area").html("")
})

test("windowresize", function(){
	var called = false;
	jQuery.Controller.extend("WindowBind",{
		"{window} resize" : function() {
			called = true;
		}
	})
	$("#qunit-test-area").html("<div id='weird'>")
	$("#weird").window_bind();
	$(window).trigger('resize')
	ok(called,"got window resize event");
	
	$("#qunit-test-area").html("")
})

// this.delegate(this.cached.header.find('tr'), "th", "mousemove", "th_mousemove"); 
test("delegate", function(){
	var called = false;
	jQuery.Controller.extend("DelegateTest",{
		click: function() {}
	})
	var els = $("<div><span><a href='#'>click me</a></span></div>").appendTo($("#qunit-test-area"))
	var c = els.delegate_test();
	c.controller().delegate(els.find("span"), "a", "click", function(){
		called = true;
	})
	els.find("a").trigger('click')
	ok(called, "delegate works")
	$("#qunit-test-area").html("")
})

test("inherit", function(){
	var called = false;
	$.Controller.extend( "Parent", {
		click: function(){
			called = true;
		}
	})
	Parent.extend( "Child", {
		
	})
	var els = $("<div><span><a href='#'>click me</a></span></div>").appendTo($("#qunit-test-area"))
	els.child();
	els.find("a").trigger('click')
	ok(called, "inherited the click method")
	$("#qunit-test-area").html("")
});

test("objects in action", function(){
	$.Controller('Thing',{
		"{item} someEvent" : function(thing, ev){
			ok(true, "called");
			equals(ev.type, "someEvent","correct event")
			equals(this.Class.fullName, "Thing", "This is a controller isntance")
			equals(thing.name,"Justin","Raw, not jQuery wrapped thing")
		}
	});
	
	var thing1 = {name: "Justin"};
	
	var ta = $("<div/>").appendTo( $("#qunit-test-area") )
	ta.thing({item : thing1});
	
	$(thing1).trigger("someEvent");
	
	$("#qunit-test-area").html("");
	
});

test("dot",function(){
	$.Controller("Dot",{
		"foo.bar" : function(){
			ok(true,'called')
		}
	});
	
	var ta = $("<div/>").appendTo( $("#qunit-test-area") );
	ta.dot().trigger("foo.bar");
	$("#qunit-test-area").html("");
})

// HTMLFormElement[0] breaks
test("the right element", 1, function(){
	$.Controller('FormTester',{
		init : function(){
			equals(this.element[0].nodeName.toLowerCase(), "form" )
		}
	})
	$("<form><input name='one'/></form>").appendTo( $("#qunit-test-area") )
		.form_tester();
	$("#qunit-test-area").html("")
})

});
