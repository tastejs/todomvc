steal
  .then("funcunit/qunit", "jquery/tie",'jquery/model')
  .then(function(){
  	
	
	module("jquery/tie",{
		setup : function(){
			$.Model("Person",{
				setAge : function(age, success, error){
					age =  +(age);
					if(isNaN(age) || !isFinite(age) || age < 1 || age > 10){
						error()
					}else{
						return age;
					}
				}
			});
		}
	});
	
	test("sets age on tie", function(){
		
		var person1 = new Person({age: 5});
		var inp = $("<input/>").appendTo( $("#qunit-test-area") );
		
		inp.tie(person1, 'age');
		
		equals(inp.val(), "5", "sets age");
		
		var person2 = new Person();
		var inp2 = $("<input/>").appendTo( $("#qunit-test-area") );
		inp2.tie(person2, 'age');
		equals(inp2.val(), "", "nothing set");
		
		person2.attr("age",6);
		
		equals(inp2.val(), "6", "nothing set");
		
		
	});
	
	test("removing the controller, removes the tie ", 3, function(){
		var person1 = new Person({age: 5});
		var inp = $("<div/>").appendTo( $("#qunit-test-area") );
		
		$.Controller("Foo",{
			val : function(value){
				equals(value, 5, "Foo got the value correct")
			}
		});
		
		inp.foo().tie(person1,"age");
		var foo = inp.controller('foo'),
			tie = inp.controller('tie');
		inp.foo("destroy");
		
		person1.attr("age",7)
		ok(foo._destroyed, "Foo is destroyed");
		ok(tie._destroyed, "Tie is destroyed")
	})
	
	test("destroying the person, removes the tie", function(){
		var person1 = new Person({age: 5});
		var inp = $("<div/>").appendTo( $("#qunit-test-area") );
		
		$.Controller("Foo",{
			val : function(value){
				equals(value, 5, "Foo got the value correct")
			}
		});
		
		inp.foo().tie(person1,"age");
		var foo = inp.controller('foo'),
			tie = inp.controller('tie');
		
		person1.destroyed();
		
		person1.attr("age",7)
		ok(!foo._destroyed, "Foo is not destroyed");
		ok(tie._destroyed, "Tie is destroyed")
	})
	
	test("removing html element removes the tie", function() {
		var person1 = new Person({age: 5});
		var inp = $("<div/>").appendTo( $("#qunit-test-area") );
		
		$.Controller("Foo",{
			val : function(value) {}
		});
		
		inp.foo().tie(person1,"age");
		var foo = inp.controller('foo'),
			tie = inp.controller('tie');

		inp.remove(); // crashes here
		
		ok(foo._destroyed, "Foo is destroyed");
		ok(tie._destroyed, "Tie is destroyed")
	});
	
	test("tie on a specific controller", function(){});
	
	test("no controller with val, only listen", function(){
		var person1 = new Person({age: 5});
		var inp = $("<div/>").appendTo( $("#qunit-test-area") );
		
		inp.tie(person1,"age");
		
		inp.trigger("change",7);
		equals(7, person1.attr('age'), "persons age set on change event");
	});
	
	test("input error recovery", function(){
		var person1 = new Person({age: 5});
		var inp = $("<input/>").appendTo( $("#qunit-test-area") );
		
		inp.tie(person1, 'age');
		
		inp.val(100).trigger('change');
		
		equals(inp.val(), "5", "input value stays the same");
		equals(person1.attr('age'), "5", "persons age stays the same");
	})
		
 });