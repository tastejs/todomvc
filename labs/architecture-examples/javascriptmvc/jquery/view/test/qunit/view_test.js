
module("jquery/view");

test("Ajax transport", function(){
	var order = 0;
	$.ajax({
		url: "//jquery/view/test/qunit/template.ejs",
		dataType : "view",
		async : false
	}).done(function(view){
		equals(++order,1, "called synchronously");
		equals(view({message: "hi"}).indexOf("<h3>hi</h3>"), 0, "renders stuff!")
	});
	
	equals(++order,2, "called synchronously");
})


test("multiple template types work", function(){
	
	$.each(["micro","ejs","jaml", "tmpl"], function(){
		$("#qunit-test-area").html("");
		ok($("#qunit-test-area").children().length == 0,this+ ": Empty To Start")
		
		$("#qunit-test-area").html("//jquery/view/test/qunit/template."+this,{"message" :"helloworld"})
		ok($("#qunit-test-area").find('h3').length, this+": h3 written for ")
		ok( /helloworld\s*/.test( $("#qunit-test-area").text()), this+": hello world present for ")
	})
})
test("plugin in ejs", function(){
	$("#qunit-test-area").html("");
	$("#qunit-test-area").html("//jquery/view/test/qunit/plugin.ejs",{})
	ok(/something/.test( $("#something").text()),"something has something");
	$("#qunit-test-area").html("");
})
test("nested plugins", function(){
	$("#qunit-test-area").html("");
	$("#qunit-test-area").html("//jquery/view/test/qunit/nested_plugin.ejs",{})
	ok(/something/.test( $("#something").text()),"something has something");
})

test("async templates, and caching work", function(){
	$("#qunit-test-area").html("");
	stop();
	var i = 0;
	$("#qunit-test-area").html("//jquery/view/test/qunit/temp.ejs",{"message" :"helloworld"}, function(text){
		ok( /helloworld\s*/.test( $("#qunit-test-area").text()))
		ok(/helloworld\s*/.test(text), "we got a rendered template");
		i++;
		equals(i, 2, "Ajax is not synchronous");
		equals(this.attr("id"), "qunit-test-area" )
		start();
	});
	i++;
	equals(i, 1, "Ajax is not synchronous")
})
test("caching works", function(){
	// this basically does a large ajax request and makes sure 
	// that the second time is always faster
	$("#qunit-test-area").html("");
	stop();
	var startT = new Date(),
		first;
	$("#qunit-test-area").html("//jquery/view/test/qunit/large.ejs",{"message" :"helloworld"}, function(text){
		first = new Date();
		ok(text, "we got a rendered template");
		
		
		$("#qunit-test-area").html("");
		$("#qunit-test-area").html("//jquery/view/test/qunit/large.ejs",{"message" :"helloworld"}, function(text){
			var lap2 = (new Date()) - first,
				lap1 =  first-startT;
			// ok( lap1 > lap2, "faster this time "+(lap1 - lap2) )
			
			start();
			$("#qunit-test-area").html("");
		})
		
	})
})
test("hookup", function(){
	$("#qunit-test-area").html("");
	
	$("#qunit-test-area").html("//jquery/view/test/qunit/hookup.ejs",{}); //makes sure no error happens
})

test("inline templates other than 'tmpl' like ejs", function(){
        $("#qunit-test-area").html("");

        $("#qunit-test-area").html($('<script type="test/ejs" id="test_ejs"><span id="new_name"><%= name %></span></script>'));

        $("#qunit-test-area").html('test_ejs', {name: 'Henry'});
        equal( $("#new_name").text(), 'Henry');
	$("#qunit-test-area").html("");
});

test("object of deferreds", function(){
	var foo = $.Deferred(),
		bar = $.Deferred();
	stop();
	$.View("//jquery/view/test/qunit/deferreds.ejs",{
		foo : foo.promise(),
		bar : bar
	}).then(function(result){
		equals(result, "FOO and BAR");
		start();
	});
	setTimeout(function(){
		foo.resolve("FOO");
	},100);
	bar.resolve("BAR");
	
});

test("deferred", function(){
	var foo = $.Deferred();
	stop();
	$.View("//jquery/view/test/qunit/deferred.ejs",foo).then(function(result){
		equals(result, "FOO");
		start();
	});
	setTimeout(function(){
		foo.resolve({
			foo: "FOO"
		});
	},100);
	
});


test("modifier with a deferred", function(){
	$("#qunit-test-area").html("");
	stop();
	
	var foo = $.Deferred();
	$("#qunit-test-area").html("//jquery/view/test/qunit/deferred.ejs", foo );
	setTimeout(function(){
		foo.resolve({
			foo: "FOO"
		});
		start();
		equals($("#qunit-test-area").html(), "FOO", "worked!");
	},100);

});

test("jQuery.fn.hookup", function(){
	$("#qunit-test-area").html("");
	var els = $($.View("//jquery/view/test/qunit/hookup.ejs",{})).hookup();
	$("#qunit-test-area").html(els); //makes sure no error happens
});

test("non-HTML content in hookups", function(){
  $("#qunit-test-area").html("<textarea></textarea>");
  $.View.hookup(function(){});
  $("#qunit-test-area textarea").val("asdf");
  equals($("#qunit-test-area textarea").val(), "asdf");
});

test("html takes promise", function(){
	var d = $.Deferred();
	$("#qunit-test-area").html(d);
	stop();
	d.done(function(){
		equals($("#qunit-test-area").html(), "Hello World", "deferred is working");
		start();
	})
	setTimeout(function(){
		d.resolve("Hello World")
	},10)
});

test("val set with a template within a hookup within another template", function(){
	$("#qunit-test-area").html("//jquery/view/test/qunit/hookupvalcall.ejs",{});
})

/*test("bad url", function(){
	$.View("//asfdsaf/sadf.ejs")
});*/

test("hyphen in type", function(){
	$(document.body).append("<script type='text/x-ejs' id='hyphenEjs'>\nHyphen\n</script>")

	$("#qunit-test-area").html('hyphenEjs',{});
	
	ok( /Hyphen/.test( $("#qunit-test-area").html() ), "has hyphen" );
})


