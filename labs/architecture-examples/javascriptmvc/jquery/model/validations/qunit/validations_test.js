steal('funcunit/qunit','jquery/model/validations').then(function(){

module("jquery/model/validations",{
	setup : function(){
		jQuery.Model.extend("Person",{
		},{});
	}
})

test("models can validate, events, callbacks", 11,function(){
	Person.validate("age", {message : "it's a date type"},function(val){
					return ! ( this.date instanceof Date )
				})
	
	
	var task = new Person({age: "bad"}),
		errors = task.errors()
		
	
	ok(errors, "There are errors");
	equals(errors.age.length, 1, "there is one error");
	equals(errors.age[0], "it's a date type", "error message is right");
	
	task.bind("error.age", function(ev, errs){
		ok(this === task, "we get task back by binding");
		
		ok(errs, "There are errors");
		equals(errs.age.length, 1, "there is one error");
		equals(errs.age[0], "it's a date type", "error message is right");
	})
	
	task.attr("age","blah");
	
	
	
	task.unbind("error.age");
	
	
	task.attr("age", "blaher", function(){}, function(errs){
		ok(this === task, "we get task back in error handler");
		
		ok(errs, "There are errors");
		equals(errs.age.length, 1, "there is one error");
		equals(errs.age[0], "it's a date type", "error message is right");
	});
	
})

test("validatesFormatOf", function(){
	Person.validateFormatOf("thing",/\d-\d/)
	
	ok(!new Person({thing: "1-2"}).errors(),"no errors");
	
	var errors = new Person({thing: "foobar"}).errors();
	
	ok(errors, "there are errors")
	equals(errors.thing.length,1,"one error on thing");
	
	equals(errors.thing[0],"is invalid","basic message");
	
	Person.validateFormatOf("otherThing",/\d/,{message: "not a digit"})
	
	var errors2 = new Person({thing: "1-2", otherThing: "a"}).errors();
	
	equals(errors2.otherThing[0],"not a digit", "can supply a custom message")
});

test("validatesInclusionOf", function(){
	Person.validateInclusionOf("thing", ["yes", "no", "maybe"]);

	ok(!new Person({thing: "yes"}).errors(),"no errors");

	var errors = new Person({thing: "foobar"}).errors();

	ok(errors, "there are errors");
	equals(errors.thing.length,1,"one error on thing");

	equals(errors.thing[0],"is not a valid option (perhaps out of range)","basic message");

	Person.validateInclusionOf("otherThing", ["yes", "no", "maybe"],{message: "not a valid option"});
	
	var errors2 = new Person({thing: "yes", otherThing: "maybe not"}).errors();
	
	equals(errors2.otherThing[0],"not a valid option", "can supply a custom message");
});

test("validatesLengthOf", function(){
	Person.validateLengthOf("thing", 2, 5);

	ok(!new Person({thing: "yes"}).errors(),"no errors");
	
	var errors = new Person({thing: "foobar"}).errors();

	ok(errors, "there are errors");
	equals(errors.thing.length,1,"one error on thing");

	equals(errors.thing[0],"is too long (max=5)","basic message");

	Person.validateLengthOf("otherThing", 2, 5, {message: "invalid length"});

	var errors2 = new Person({thing: "yes", otherThing: "too long"}).errors();

	equals(errors2.otherThing[0],"invalid length", "can supply a custom message");
});

test("validatesPresenceOf", function(){
	$.Model.extend("Task",{
		init : function(){
			this.validatePresenceOf("dueDate")
		}
	},{});
	
    //test for undefined
	var task = new Task(),
		errors = task.errors();
	
	ok(errors)
	ok(errors.dueDate)
	equals(errors.dueDate[0], "can't be empty" , "right message");
	
    //test for null
	task = new Task({dueDate: null});
    errors = task.errors();
	
	ok(errors)
	ok(errors.dueDate)
	equals(errors.dueDate[0], "can't be empty" , "right message");

    //test for ""
	task = new Task({dueDate: ""});
    errors = task.errors();
	
	ok(errors)
	ok(errors.dueDate)
	equals(errors.dueDate[0], "can't be empty" , "right message");

	//Affirmative test
	task = new Task({dueDate : "yes"});
	errors = task.errors();;
	
	ok(!errors, "no errors "+typeof errors);
	
	$.Model.extend("Task",{
		init : function(){
			this.validatePresenceOf("dueDate",{message : "You must have a dueDate"})
		}
	},{});
	
	task = new Task({dueDate : "yes"});
	errors = task.errors();;
	
	ok(!errors, "no errors "+typeof errors);
})

test("validatesRangeOf", function(){
	Person.validateRangeOf("thing", 2, 5);

	ok(!new Person({thing: 4}).errors(),"no errors");

	var errors = new Person({thing: 6}).errors();

	ok(errors, "there are errors")
	equals(errors.thing.length,1,"one error on thing");

	equals(errors.thing[0],"is out of range [2,5]","basic message");

	Person.validateRangeOf("otherThing", 2, 5, {message: "value out of range"});

	var errors2 = new Person({thing: 4, otherThing: 6}).errors();

	equals(errors2.otherThing[0],"value out of range", "can supply a custom message");
});

});
