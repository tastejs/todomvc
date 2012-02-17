steal
 .plugins("jquery/dom/fixture", "jquery/model")
 .plugins('funcunit/qunit').then(function(){

module("jquery/dom/fixture");


test("static fixtures", function(){
	stop();
	$.get("something",function(data){
		equals(data.sweet,"ness","$.get works");
		$.post("something",function(data){
			
			equals(data.sweet,"ness","$.post works");
			
			$.ajax({
				url: "something",
				dataType: "json",
				success: function( data ) {
					equals(data.sweet,"ness","$.ajax works");
					start();
				},
				fixture: "//jquery/dom/fixture/fixtures/test.json"
			})
			
		},"json","//jquery/dom/fixture/fixtures/test.json");
	},'json',"//jquery/dom/fixture/fixtures/test.json");
})

test("dynamic fixtures",function(){
	stop();
	$.fixture.delay = 10;
	var fix = function(){
		return [{sweet: "ness"}]
	}
	$.get("something",function(data){
		equals(data.sweet,"ness","$.get works");
		$.post("something",function(data){
			
			equals(data.sweet,"ness","$.post works");
			
			$.ajax({
				url: "something",
				dataType: "json",
				success: function( data ) {
					equals(data.sweet,"ness","$.ajax works");
					start();
				},
				fixture: fix
			})
			
		},"json",fix);
	},'json',fix);
});

test("fixture function", 3, function(){
	
	stop();
	var url = steal.root.join("jquery/dom/fixture/fixtures/foo.json");
	$.fixture(url,"//jquery/dom/fixture/fixtures/foobar.json" );
	
	$.get(url,function(data){
		equals(data.sweet,"ner","url passed works");
		
		$.fixture(url,"//jquery/dom/fixture/fixtures/test.json" );
		
		$.get(url,function(data){ 
		
			equals(data.sweet,"ness","replaced");
			
			$.fixture(url, null );
		
			$.get(url,function(data){ 
			
				equals(data.a,"b","removed");
				
				start();
				
			},'json')
			
			
		},'json')
		
		
		
	},"json");

});


test("fixtures with converters", function(){
	
	stop();
	$.ajax( {
	  url : steal.root.join("jquery/dom/fixture/fixtures/foobar.json"),
	  dataType: "json fooBar",
	  converters: {
	    "json fooBar": function( data ) {
	      // Extract relevant text from the xml document
	      return "Mr. "+data.name;
	    }
	  },
	  fixture : function(){
	  	return {
			name : "Justin"
		}
	  },
	  success : function(prettyName){
	  	start();
		equals(prettyName, "Mr. Justin")
	  }
	});
})

test("$.fixture.make fixtures",function(){
	stop();
	$.fixture.make('thing', 1000, function(i){
		return {
			id: i,
			name: "thing "+i
		}
	}, 
	function(item, settings){
		if(settings.data.searchText){
			var regex = new RegExp("^"+settings.data.searchText)
			return regex.test(item.name);
		}
	})
	$.ajax({
		url: "things",
		type: "json",
		data: {
			offset: 100,
			limit: 200,
			order: ["name ASC"],
			searchText: "thing 2"
		},
		fixture: "-things",
		success: function(things){
			equals(things.data[0].name, "thing 29", "first item is correct")
			equals(things.data.length, 11, "there are 11 items")
			start();
		}
	})
});

test("simulating an error", function(){
	var st = '{type: "unauthorized"}';
	
	$.fixture("/foo", function(){
		return [401,st]
	});
	stop();
	
	$.ajax({
		url : "/foo",
		success : function(){
			ok(false, "success called");
			start();
		},
		error : function(jqXHR, status, statusText){
			ok(true, "error called");
			equals(statusText, st);
			start();
		}
	})
})


});
