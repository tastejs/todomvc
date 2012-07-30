steal('funcunit/qunit','./store.js',
	'jquery/model',
	'jquery/model/list',
	'jquery/dom/fixture',function(){

module("store", {
	setup : function(){
		
	}
});



/*
test("smart findAll", function(){
	
	$.Model('Item');
		
	
	
	ok( this.store.has({parentId: 7})  , "store has everything with parentId 7");
	
	
	var items = this.store.findAll({parentId: 7});
	equals( items.length, 2 , "got the wrong number of items"); 
	$.each(items, function(i, item){
		if(item.parentId != 7){
			ok(false,"got a bad parentId")
		}
	})
})*/

test("store findAll", 5, function(){
	
	$.fixture.make('item',40, function(i){
		return {
			name: "Name "+i,
			parentId: i%4+1
		}
	})
	
	$.Model('Item',{},{});
	$.Model.List('Item.List');
	$.Model.Store('Item.Store');
	
	
	var list = Item.Store.findAll({});
	stop();
	list.bind("add", function(ev, items){
		console.log("here ...")
		start();
		
		ok(items, "add called with items");
		
		equal( items.length,40, "add called with items");
		
		var list2 = Item.Store.findAll({parentId: 2});
		
		equal( list2.length , 10, "immediately loaded");
		
		
		list.unbind('add',arguments.callee);
		
		list.bind('add', function(){
			ok(true, "big list added to")
		})
		
		list2.bind('add', function(){
			ok(true, "small list added too")
		})
		
		Item.Store.add([new Item({id: 100, parentId: 2})]);
		
	})
	
})

test("Store Compare", function(){
	
	
	$.fixture.make('item',40, function(i){
		return {
			name: "Name "+i,
			parentId: i%4+1
		}
	})
	
	$.Model('Item',{},{});
	$.Model.List('Item.List');
	$.Model.Store('Item.Store',{
		compare : {
			count : null
		}
	},{});
	
	
	var list = Item.Store.findAll({count: 2});
	stop();
	list.bind("add", function(ev, items){
		ok(items.length);
		ok(list.length)
		start()
		var list2 = Item.Store.findAll({count: 500});
		equals(list2.length, list.length, "lists have the same items");
		ok(list2 === list,"lists are equal")
	})
})

test("Store Remove", function(){
	$.fixture.make('item',40, function(i){
		return {
			name: "Name "+i,
			parentId: i%4+1
		}
	})
	
	$.Model('Item',{},{});
	$.Model.List('Item.List');
	$.Model.Store('Item.Store',{
		compare : {
			count : null
		}
	},{});
	
	var list = Item.Store.findAll({parentId: 1}),
		len = 0,
		first;
	stop();
	list.bind("add", function(ev, items){
		ok(items.length, "there should be items");
		len = items.length;
		first = items[0]
		first.destroy();
	})
	list.bind("remove", function(ev, items){
		ok(items[0] === first, "removed first item");
		equals(list.length, len - 1, "length adjusted")
		var list2 = Item.Store.findAll({parentId: 1});
		ok(list2.get(first.id)[0] === undefined, "Model Store remove callback");
		start();
	})
});

test("Store Update", function(){
	$.fixture.make('item',40, function(i){
		return {
			name: "Name "+i,
			parentId: i%4+1
		}
	})
	
	$.Model('Item',{},{});
	$.Model.List('Item.List');
	$.Model.Store('Item.Store',{
		compare : {
			count : null
		}
	},{});
	
	var list1 = Item.Store.findAll({parentId: 1}),
		list2 = Item.Store.findAll({parentId: 2}),
		len = 0,
		first;
		
	stop();
	var def1 = $.Deferred(),
		def2 = $.Deferred(),
		first,
		updating;
		
	list1.bind("add", function(ev, items){
		console.log("1 added")
		def1.resolve(true)
		first = items[0]
	});
	list1.bind("remove", function(ev, items){
		console.log("1 removed")
		equals(items[0].id, first.id, "first removed")
	})
	list2.bind("add", function(ev, items){
		console.log("2 added")
		if(!updating){
			def2.resolve(true);
		} else {
			equals(items[0].id, first.id, "item added to second list")
			start();
		}
	});
	
	$.when(def1, def2).then(function(){
		console.log('both ready')
		updating = true;
		first.updated({parentId: 2})
	});
	
});



});

