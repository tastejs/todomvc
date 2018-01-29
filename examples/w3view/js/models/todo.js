(function (exports){
	'use strict';

	var STORE = '';
	var model = {};
	//ifaces
	model.item = {title: '', completed: false};
	//
	model.list = [];
	//

	var store = exports.localStorage;
	function filterComplete(item, i){
		return item.completed;
	}
	function filterActive(item, i){
		return !filterComplete(item, i);
	}

	model.load = function (){
		this.list = JSON.parse(store.getItem(STORE) || "[]");
	};
	model.save = function (){
		store.setItem(STORE, JSON.stringify(this.list || []));
	};

	model.countActive = function (){
		return model.getActive().length;
	};
	model.getActive = function (){
		return this.list.filter(filterActive);
	};
	model.getCompleted = function (){
		return this.list.filter(filterComplete);
	};

	model.addItem = function (item){
		if(!item || !item.title || !(item.title = item.title.trim())) return;
		this.list.push(item);
		this.save();
	};
	model.setValue = function (item, value){
		if(!item) return;
		value=value.trim();
		var i =  this.list.indexOf(item);
		if(i < 0) return;
		if(!value){
			this.list.splice(i, 1);
		} else {
			item.title = value;
		}
		this.save();
	};
	model.remItem = function (item){
		var i =  this.list.indexOf(item);
		if(i < 0) return;		
		this.list.splice(i, 1);
		this.save();
	};
	model.itemSwitchCompleted = function (item){
		if(!item) return;
		item.completed = !item.completed;
		this.save();
	};
	model.toggleAll = function (onoff){
		this.list.forEach(function(item){
			item.completed = onoff;
		});
		this.save();
	};
	model.clearCompleted = function (){
		this.list = this.getActive();
		this.save();
	};

	exports.todoModel = function(store){
		STORE=store;
		return model;
	};
})(window)