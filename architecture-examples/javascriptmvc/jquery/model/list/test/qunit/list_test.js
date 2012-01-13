
module("jquery/model/list", {
	setup: function() {
		$.Model.extend("Person")
	
		$.Model.List.extend("Person.List",{
			destroy: function() {
				equals(this.length, 20,  "Got 20 people")
			}
		});
		var people = []
		for(var i =0; i < 20; i++){
			people.push( new Person({id: "a"+i}) )
		}
		this.people = new $.Model.List(people);
	}
})

test("hookup with list", function(){
	
	
	
	var div = $("<div>")
	
	for(var i =0; i < 20 ; i ++){
		var child = $("<div>");
		var p = new Person({foo: "bar"+i, id: i});
		p.hookup( child[0] );
		div.append(child)
	}
	var models = div.children().models();
	ok(models.Class === Person.List, "correct type");
	models.destroy();

})

test("create", function(){
	
	equals(this.people.length, 20)
	
	equals(this.people.get("a2")[0].id,"a2" , "get works")
})


test("splice", function(){
	ok(this.people.get("a1").length,"something where a1 is")
	this.people.splice(1,1)
	equals(this.people.length, 19)
	ok(!this.people.get("a1").length,"nothing where a1 is")
	
})

test("remove", function(){
	var res = this.people.remove("a1")
	ok(!this.people.get("a1").length,"nothing where a1 is")
	ok(res.length, "got something array like")
	equals(res[0].id, "a1")
})


test("list from wrapMany", function(){
	var people = Person.wrapMany([{id: 1}, {id: 2}]);
	ok(people.destroy, "we can destroy a list")
});

test("events - add", 4, function(){
	var list = new Person.List;
	list.bind("add", function(ev, items){
		ok(1, "add called");
		equals(items.length, 1, "we get an array")
	});
	
	var person = new Person({id: 1, name: "alex"});
	
	
	list.push(person);
	
	// check that we are listening to updates on person ...
	
	ok( $(person).data("events"), "person has events" );
	
	list.unbind("add");
	
	ok( !$(person).data("events"), "person has no events" );
	
});

test("events - update", function(){
	var list = new Person.List;
	list.bind("update", function(ev, updated){
		ok(1, "update called");
		ok(person === updated, "we get the person back");
		
		equals(updated.name, "Alex", "got the right name")
	});
	
	var person = new Person({id: 1, name: "justin"});
	list.push(person);
	
	person.updated({name: "Alex"})
})
