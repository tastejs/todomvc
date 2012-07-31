steal('funcunit/qunit','jquery/lang/observe',function(){


module('jquery/lang/observe/delegate')

var matches = $.Observe.prototype.delegate.matches;

test("matches", function(){
	
	equals( matches(['**'], ['foo','bar','0']) ,
		'foo.bar.0' , "everything" );
		
	equals( matches(['*.**'], ['foo']) ,
		null , "everything at least one level deep" )
	
	equals( matches(['foo','*'], ['foo','bar','0']) ,
		'foo.bar' )
	
	equals(matches(['*'], 
					['foo','bar','0']) ,
					'foo' );
					
	equals( matches([ '*', 'bar' ], 
					['foo','bar','0']) ,
					'foo.bar' )
	// - props - 
	// - returns - 'foo.bar'
})

test("list events", function(){
	
	var list = new $.Observe.List([
		{name: 'Justin'},
		{name: 'Brian'},
		{name: 'Austin'},
		{name: 'Mihael'}])
	list.comparator = 'name';
	list.sort();
	// events on a list
	// - move - item from one position to another
	//          due to changes in elements that change the sort order
	// - add (items added to a list)
	// - remove (items removed from a list)
	// - reset (all items removed from the list)
	// - change something happened
	
	// a move directly on this list
	list.bind('move', function(ev, item, newPos, oldPos){
		ok(true,"move called");
		equals(item.name, "Zed");
		equals(newPos, 3);
		equals(oldPos, 0);
	});
	
	// a remove directly on this list
	list.bind('remove', function(ev, items, oldPos){
		ok(true,"remove called");
		equals(items.length,1);
		equals(items[0].name, 'Alexis');
		equals(oldPos, 0, "put in right spot")
	})
	list.bind('add', function(ev, items, newPos){
		ok(true,"add called");
		equals(items.length,1);
		equals(items[0].name, 'Alexis');
		equals(newPos, 0, "put in right spot")
	});
	
	list.push({name: 'Alexis'});
	
	// now lets remove alexis ...
	list.splice(0,1);
	list[0].attr('name',"Zed")
})


test("delegate", 4,function(){
	
	var state = new $.Observe({
		properties : {
		  prices : []
		}
	});
	var prices = state.attr('properties.prices');
	
	state.delegate("properties.prices","change", function(ev, attr, how, val, old){
		equals(attr, "0", "correct change name")
		equals(how, "add")
		equals(val[0].attr("foo"),"bar", "correct")
		ok(this === prices, "rooted element")
	});
	
	prices.push({foo: "bar"});
	
	state.undelegate();
	
})
test("delegate on add", 2, function(){
	
	var state = new $.Observe({});
	
	state.delegate("foo","add", function(ev, newVal){
		ok(true, "called");
		equals(newVal, "bar","got newVal")
	}).delegate("foo","remove", function(){
		ok(false,"remove should not be called")
	});
	
	state.attr("foo","bar")
	
})

test("delegate set is called on add", 2, function(){
	var state = new $.Observe({});
	
	state.delegate("foo","set", function(ev, newVal){
		ok(true, "called");
		equals(newVal, "bar","got newVal")
	});
	state.attr("foo","bar")
});

test("delegate's this", 5, function(){
	var state = new $.Observe({
		person : {
			name : {
				first : "justin",
				last : "meyer"
			}
		},
		prop : "foo"
	});
	var n = state.attr('person.name'),
		check
	
	// listen to person name changes
	state.delegate("person.name","set", check = function(ev, newValue, oldVal, from){
		// make sure we are getting back the person.name
		equals(this, n)
		equals(newValue, "Brian");
		equals(oldVal, "justin");
		// and how to get there
		equals(from,"first")
	});
	n.attr('first',"Brian");
	state.undelegate("person.name",'set',check)
	// stop listening
	
	// now listen to changes in prop
	state.delegate("prop","set", function(){
		equals(this, 'food');
	}); // this is weird, probably need to support direct bind ...
	
	// update the prop
	state.attr('prop','food')
})


test("delegate on deep properties with *", function(){
	var state = new $.Observe({
		person : {
			name : {
				first : "justin",
				last : "meyer"
			}
		}
	});
	
	state.delegate("person","set", function(ev, newVal, oldVal, attr){
		equals(this, state.attr('person'), "this is set right")
		equals(attr, "name.first")
	});
	state.attr("person.name.first","brian")
});

test("compound sets", function(){
	
	var state = new $.Observe({
		type : "person",
		id: "5"
	});
	var count = 0;
	state.delegate("type=person id","set", function(){
		equals(state.type, "person","type is person")
		ok(state.id !== undefined, "id has value");
		count++;
	})
	
	// should trigger a change
	state.attr("id",0);
	equals(count, 1, "changing the id to 0 caused a change");
	
	// should not fire a set
	state.removeAttr("id")
	equals(count, 1, "removing the id changed nothing");
	
	state.attr("id",3)
	equals(count, 2, "adding an id calls callback");
	
	state.attr("type","peter")
	equals(count, 2, "changing the type does not fire callback");
	
	state.removeAttr("type");
	state.removeAttr("id");
	
	equals(count, 2, "");
	
	state.attrs({
		type : "person",
		id: "5"
	});
	
	equals(count, 3, "setting person and id only fires 1 event");
	
	state.removeAttr("type");
	state.removeAttr("id");
	
	state.attrs({
		type : "person"
	});
	equals(count, 3, "setting person does not fire anything");
})

});