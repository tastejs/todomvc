steal("jquery/model/list",'funcunit/qunit', 'jquery/dom/fixture', function(){
	 
module("jquery/model/list", {
	setup: function() {
		$.Model.extend("Person")
	
		$.Model.List("Person.List",{
			destroy : "DELETE /person/destroyAll",
			update : "PUT /person/updateAll"
		},{});
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
	equals(models.length, 20,  "Got 20 people")


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


test("list from models", function(){
	var people = Person.models([{id: 1}, {id: 2}]);
	ok(people.elements, "we can find elements from a list")
});

test("destroy a list", function(){
	var people = Person.models([{id: 1}, {id: 2}]);
	stop();
	// make sure a request is made
	$.fixture('DELETE /person/destroyAll', function(){
		
		ok(true, "called right fixture");
		return true;
	})
	// make sure the people have a destroyed event
	people[0].bind('destroyed', function(){
		ok(true, "destroyed event called")
	})
	
	people.destroy(function(deleted){
		ok(true, "destroy callback called");
		ok(people.length, 0, "objects removed");
		ok(deleted.length, 2, "got back deleted items")
		start()
		// make sure the list is empty
		
	})

});

test("destroy a list with nothing in it", function(){
	var people = Person.models([]);
	stop();
	
	// make sure a request is made
	$.fixture('DELETE /person/destroyAll', function(){
		ok(true, "called right fixture");
		return true;
	});
	
	people.destroy(function(deleted){
		ok(true, "destroy callback called");
		equal(deleted.length, people.length, "got back deleted items")
		start();
	});
});

test("update a list", function(){
	var people = Person.models([{id: 1}, {id: 2}]),
		updateWith = {
			name: "Justin",
			age : 29
		},
		newProps = {
			newProp : "yes"
		};
	stop();
	
	// make sure a request is made
	$.fixture('PUT /person/updateAll', function(orig){	
		ok(true, "called right fixture");
		ok(orig.data.ids.length, 2, "got 2 ids")
		same(orig.data.attrs, updateWith, "got the same attrs")
		return newProps;
	})
	
	// make sure the people have a destroyed event
	people[0].bind('updated', function(){
		ok(true, "updated event called")
	})
	
	people.update(updateWith,function(updated){
		ok(true, "updated callback called");
		ok(updated.length, 2, "got back deleted items");
		same(updated[0].attrs(),$.extend({id : 1},newProps, updateWith ));
		start();
	});
})

test("update a list with nothing in it", function(){
	var people = Person.models([]),
		updateWith = {
			name: "Justin",
			age : 29
		};
	stop();
	
	// make sure a request is made
	$.fixture('PUT /person/updateAll', function(orig){
		ok(true, "called right fixture");
		return newProps;
	});

	people.update(updateWith,function(updated){
		ok(true, "updated callback called");
		equal(updated.length, people.length, "nothing updated");
		start();
	});
})

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
});

})
