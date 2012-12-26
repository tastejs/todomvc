module("jquery/model", { 
	setup: function() {
        var ids = 0;
	    $.Model("Person",{
			findAll: function( params, success, error ) {
				success("findAll");
			},
			findOne: function( params, success, error ) {
				success("findOne");
			},
			create: function( params, success, error ) {
				success({zoo: "zed", id: (++ids)},"create");
			},
			destroy: function( id, success, error ) {
				success("destroy");
			},
			update: function( id, attrs, success, error ) {
				success({zoo: "monkeys"},"update");
			}
		},{
			prettyName: function() {
				return "Mr. "+this.name;
			}
		})
	}
})


test("CRUD", function(){
   
	Person.findAll({}, function(response){
		equals("findAll", response)
	})
	Person.findOne({}, function(response){
		equals("findOne", response)
	})
    var person;
	new Person({foo: "bar"}).save(function(inst, attrs, create){
		equals(create, "create")
		equals("bar", inst.foo)
		equals("zed", inst.zoo)
		ok(inst.save, "has save function");
		person = inst;
	});
    person.update({zoo: "monkey"},function(inst, attrs, update){
		equals(inst, person, "we get back the same instance");
		equals(person.zoo, "monkeys", "updated to monkeys zoo!  This tests that you callback with the attrs")
	})
});

test("findAll deferred", function(){
	$.Model.extend("Person",{
		findAll : function(params, success, error){
			return $.ajax({
				url : "/people",
				data : params,
				dataType : "json person.models",
				fixture: "//jquery/model/test/people.json"
			})
		}
	},{});
	stop();
	var people = Person.findAll({});
	people.then(function(people){
		equals(people.length, 1, "we got a person back");
		equals(people[0].name, "Justin", "Got a name back");
		equals(people[0].constructor.shortName, "Person", "got a class back");
		start();
	})
});

test("findOne deferred", function(){
	$.Model.extend("Person",{
		findOne : function(params, success, error){
			return $.ajax({
				url : "/people/5",
				data : params,
				dataType : "json person.model",
				fixture: "//jquery/model/test/person.json"
			})
		}
	},{});
	stop();
	var person = Person.findOne({});
	person.then(function(person){
		equals(person.name, "Justin", "Got a name back");
		equals(person.constructor.shortName, "Person", "got a class back");
		start();
	})
});

test("save deferred", function(){
	
	$.Model("Person",{
		create : function(attrs, success, error){
			return $.ajax({
				url : "/people",
				data : attrs,
				type : 'post',
				dataType : "json",
				fixture: function(){
					return [{id: 5}]
				},
				success : success
			})
		}
	},{});
	
	var person = new Person({name: "Justin"}),
		personD = person.save();
	
	stop();
	personD.then(function(person){
		start()
		equals(person.id, 5, "we got an id")
		
	});
	
});

test("update deferred", function(){
	
	$.Model("Person",{
		update : function(id, attrs, success, error){
			return $.ajax({
				url : "/people/"+id,
				data : attrs,
				type : 'post',
				dataType : "json",
				fixture: function(){
					return [{thing: "er"}]
				},
				success : success
			})
		}
	},{});
	
	var person = new Person({name: "Justin", id:5}),
		personD = person.save();
	
	stop();
	personD.then(function(person){
		start()
		equals(person.thing, "er", "we got updated")
		
	});
	
});

test("destroy deferred", function(){
	
	$.Model("Person",{
		destroy : function(id, success, error){
			return $.ajax({
				url : "/people/"+id,
				type : 'post',
				dataType : "json",
				fixture: function(){
					return [{thing: "er"}]
				},
				success : success
			})
		}
	},{});
	
	var person = new Person({name: "Justin", id:5}),
		personD = person.destroy();
	
	stop();
	personD.then(function(person){
		start()
		equals(person.thing, "er", "we got destroyed")
		
	});
});


test("hookup and model", function(){
	var div = $("<div/>")
	var p = new Person({foo: "bar2", id: 5});
	p.hookup( div[0] );
	ok(div.hasClass("person"), "has person");
	ok(div.hasClass("person_5"), "has person_5");
	equals(p, div.model(),"gets model" )
})
// test that models returns an array of unique instances
test("unique models", function(){
	var div1 = $("<div/>")
	var div2 = $("<div/>")
	var div3 = $("<div/>")
	var p = new Person({foo: "bar2", id: 5});
	var p2 = new Person({foo: "bar3", id: 4});
	p.hookup( div1[0] );
	p.hookup( div2[0] );
	p2.hookup( div3[0] );
	var models = div1.add(div2).add(div3).models();
	equals(p, models[0], "gets models" )
	equals(p2, models[1], "gets models" )
	equals(2, models.length, "gets models" )
})


test("models", function(){
	var people = Person.models([
		{id: 1, name: "Justin"}
	])
	equals(people[0].prettyName(),"Mr. Justin","wraps wrapping works")
});



test("async setters", function(){
	
	/*
	$.Model("Test.AsyncModel",{
		setName : function(newVal, success, error){
			
			
			setTimeout(function(){
				success(newVal)
			}, 100)
		}
	});
	
	var model = new Test.AsyncModel({
		name : "justin"
	});
	equals(model.name, "justin","property set right away")
	
	//makes model think it is no longer new
	model.id = 1;
	
	var count = 0;
	
	model.bind('name', function(ev, newName){
		equals(newName, "Brian",'new name');
		equals(++count, 1, "called once");
		ok(new Date() - now > 0, "time passed")
		start();
	})
	var now = new Date();
	model.attr('name',"Brian");
	stop();*/
})

test("binding", 2,function(){
	var inst = new Person({foo: "bar"});
	
	inst.bind("foo", function(ev, val){
		ok(true,"updated")	
		equals(val, "baz", "values match")
	});
	
	inst.attr("foo","baz");
	
});

test("error binding", 1, function(){
	$.Model.extend("School",{
	   setName : function(name, success, error){
	     if(!name){
	        error("no name");
	     }
	     return error;
	   }
	})
	var school = new School();
	school.bind("error.name", function(ev, error){
		equals(error, "no name", "error message provided")
	})
	school.attr("name","");
	
	
})

test("auto methods",function(){
	//turn off fixtures
	$.fixture.on = false;
	var School = $.Model.extend("Jquery.Model.Models.School",{
	   findAll : steal.root.join("jquery/model/test")+"/{type}.json",
	   findOne : steal.root.join("jquery/model/test")+"/{id}.json",
	   create : steal.root.join("jquery/model/test")+"/create.json",
	   update : "POST "+steal.root.join("jquery/model/test")+"/update{id}.json"
	},{})
	stop();
	School.findAll({type:"schools"}, function(schools){
		ok(schools,"findAll Got some data back");
		equals(schools[0].constructor.shortName,"School","there are schools")
		
		School.findOne({id : "4"}, function(school){
			ok(school,"findOne Got some data back");
			equals(school.constructor.shortName,"School","a single school");
			
			
			new School({name: "Highland"}).save(function(){
				equals(this.name,"Highland","create gets the right name")
				this.update({name: "LHS"}, function(){
					start();
					equals(this.name,"LHS","create gets the right name")
					
					$.fixture.on = true;
				})
			})
			
		})
		
	})
})

test("isNew", function(){
	var p = new Person();
	ok(p.isNew(), "nothing provided is new");
	var p2 = new Person({id: null})
	ok(p2.isNew(), "null id is new");
	var p3 = new Person({id: 0})
	ok(!p3.isNew(), "0 is not new");
});
test("findAll string", function(){
	$.fixture.on = false;
	$.Model("Test.Thing",{
		findAll : steal.root.join("jquery/model/test/qunit/findAll.json")+''
	},{});
	stop();
	Test.Thing.findAll({},function(things){
		equals(things.length, 1, "got an array");
		equals(things[0].id, 1, "an array of things");
		start();
		$.fixture.on = true;
	})
})
test("Empty uses fixtures", function(){
	$.Model("Test.Things");
	$.fixture.make("thing", 10, function(i){
		return {
			id: i
		}
	});
	stop();
	Test.Thing.findAll({}, function(things){
		start();
		equals(things.length, 10,"got 10 things")
	})
});

test("Model events" , function(){
	var order = 0;
	$.Model("Test.Event",{
		create : function(attrs, success){
			success({id: 1})
		},
		update : function(id, attrs, success){
			success(attrs)
		},
		destroy : function(id, success){
			success()
		}
	},{});
	
	stop();
	$([Test.Event]).bind('created',function(ev, passedItem){
		
		ok(this === Test.Event, "got model")
		ok(passedItem === item, "got instance")
		equals(++order, 1, "order");
		passedItem.update({});
		
	}).bind('updated', function(ev, passedItem){
		equals(++order, 2, "order");
		ok(this === Test.Event, "got model")
		ok(passedItem === item, "got instance")
		
		passedItem.destroy({});
		
	}).bind('destroyed', function(ev, passedItem){
		equals(++order, 3, "order");
		ok(this === Test.Event, "got model")
		ok(passedItem === item, "got instance")
		
		start();
		
	})
	
	var item = new Test.Event();
	item.save();
	
});


test("converters and serializes", function(){
	$.Model("Task1",{
		attributes: {
			createdAt: "date"
		},
		convert: {
			date: function(d){
				var months = ["jan", "feb", "mar"]
				return months[d.getMonth()]
			}
		},
		serialize: {
			date: function(d){
				var months = {"jan":0, "feb":1, "mar":2}
				return months[d]
			}
		}
	},{});
	$.Model("Task2",{
		attributes: {
			createdAt: "date"
		},
		convert: {
			date: function(d){
				var months = ["apr", "may", "jun"]
				return months[d.getMonth()]
			}
		},
		serialize: {
			date: function(d){
				var months = {"apr":0, "may":1, "jun":2}
				return months[d]
			}
		}
	},{});
	var d = new Date();
	d.setMonth(1)
	var task1=new Task1({
		createdAt: d,
		name:"Task1"
	});
	d.setMonth(2)
	var task2=new Task2({
		createdAt: d,
		name:"Task2"
	});
	equals(task1.createdAt, "feb", "Task1 model convert");
	equals(task2.createdAt, "jun", "Task2 model convert");
	equals(task1.serialize().createdAt, 1, "Task1 model serialize");
	equals(task2.serialize().createdAt, 2, "Task2 model serialize");
	equals(task1.serialize().name, "Task1", "Task1 model default serialized");
	equals(task2.serialize().name, "Task2", "Task2 model default serialized");
});

test("default converters", function(){
	var num = 1318541064012;
	equals( $.Model.convert.date(num).getTime(), num, "converted to a date with a number" );
})

test("removeAttr test", function(){
	var person = new Person({foo: "bar"})
	equals(person.foo, "bar", "property set");
	person.removeAttr('foo')
	
	equals(person.foo, undefined, "property removed");
	var attrs = person.attrs()
	equals(attrs.foo, undefined, "attrs removed");
});

test("identity should replace spaces with underscores", function(){
	$.Model("Task",{},{});
	t = new Task({
		id: "id with spaces"
	});
	equals(t.identity(), "task_id_with_spaces")
});

test("save error args", function(){
	var Foo = $.Model('Testin.Models.Foo',{
		create : "/testinmodelsfoos.json"
	},{
		
	})
	var st = '{type: "unauthorized"}';
	
	$.fixture("/testinmodelsfoos.json", function(){
		return [401,st]
	});
	stop();
	var inst = new Foo({}).save(function(){
		ok(false, "success should not be called")
	}, function(jQXHR){
		ok(true, "error called")
		ok(jQXHR.getResponseHeader,"jQXHR object")
		start()
	})
	
	
	
});

test("hookup and elements", function(){
	$.Model('Escaper',{
		escapeIdentity : true
	},{});
	
	var ul = $('<ul><li></li></ul>'),
		li = ul.find('li');
	
	var esc = new Escaper({id: " some crazy #/ %ing stuff"});
	
	li.model(esc);
	
	var res  = esc.elements(ul);
	
	equals(res.length,1)
	equals(res[0], li[0])
})

test('aborting create update and destroy', function(){
	stop();
	var delay = $.fixture.delay;
	$.fixture.delay = 1000;
	
	$.fixture("POST /abort", function(){
		ok(false, "we should not be calling the fixture");
		return {};
	})
	
	$.Model('Abortion',{
		create : "POST /abort",
		update : "POST /abort",
		destroy: "POST /abort"
	},{});
	
	var deferred = new Abortion({name: "foo"}).save(function(){
		ok(false, "success create")
	}, function(){
		ok(true, "create error called");
		
		
		deferred = new Abortion({name: "foo",id: 5})
			.save(function(){},function(){
				ok(true, "error called in update")
				
				deferred = new Abortion({name: "foo",id: 5}).destroy(function(){},
					function(){
						ok(true,"destroy error called")
						$.fixture.delay = delay;
						start();
					})
				
				setTimeout(function(){
					deferred.abort();
				},10)
				
			})
		
		setTimeout(function(){
		deferred.abort();
	},10)
	});
	setTimeout(function(){
		deferred.abort();
	},10)
	
	
});

test("object definitions", function(){
	
	$.Model('ObjectDef',{
		findAll : {
			url : "/test/place"
		},
		findOne : {
			url : "/objectdef/{id}",
			timeout : 1000
		},
		create : {
			
		},
		update : {
			
		},
		destroy : {
			
		}
	},{})
	
	$.fixture("GET /objectdef/{id}", function(original){
		equals(original.timeout,1000,"timeout set");
		return {yes: true}
	});
	stop();
	ObjectDef.findOne({id: 5}, function(){
		start();
	})
})



