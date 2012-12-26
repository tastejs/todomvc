steal('jquery/controller/view','jquery/view/micro','funcunit/qunit')  //load qunit
 .then(function(){
	
	module("jquery/controller/view");
	
	test("this.view", function(){
		
		$.Controller.extend("jquery.Controller.View.Test.Qunit",{
			init: function() {
				this.element.html(this.view())
			}
		})
		jQuery.View.ext = ".micro";
		$("#qunit-test-area").append("<div id='cont_view'/>");
		
		new jquery.Controller.View.Test.Qunit( $('#cont_view') );
		
		ok(/Hello World/i.test($('#cont_view').text()),"view rendered")
	});
	
	test("test.suffix.doubling", function(){
		
		$.Controller.extend("jquery.Controller.View.Test.Qunit",{
			init: function() {
				this.element.html(this.view('init.micro'))
			}
		})
		
		jQuery.View.ext = ".ejs"; // Reset view extension to default
		equal(".ejs", jQuery.View.ext); 
		
		$("#qunit-test-area").append("<div id='suffix_test_cont_view'/>");
		
		new jquery.Controller.View.Test.Qunit( $('#suffix_test_cont_view') );
		
		ok(/Hello World/i.test($('#suffix_test_cont_view').text()),"view rendered")
	});
	
	test("complex paths nested inside a controller directory", function(){
		$.Controller.extend("Myproject.Controllers.Foo.Bar");
		
		var path = jQuery.Controller._calculatePosition(Myproject.Controllers.Foo.Bar, "init.ejs", "init")
		equals(path, "//myproject/views/foo/bar/init.ejs", "view path is correct")
		
		$.Controller.extend("Myproject.Controllers.FooBar");
		path = jQuery.Controller._calculatePosition(Myproject.Controllers.FooBar, "init.ejs", "init")
		equals(path, "//myproject/views/foo_bar/init.ejs", "view path is correct")
	})
});

