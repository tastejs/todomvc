(function (window){
	'use strict';
	function controller(model){
		this.model = model;

		model.load();

	  this.setView = function (view){
			this.view = view;
		};

		var filter = 'showAll';
		this.showAll = function (){
			filter = 'showAll';
			this.view.setData({
				list: this.model.list,
				total:{
					count: this.model.list.length, 
					active: this.model.countActive()
				}
			});
		};
		this.showActive = function (){
			filter = 'showActive';
			var active = this.model.getActive();
			this.view.setData({
				list: active,
				total: {
					count: this.model.list.length,
					active: active.length
				}
			});
		};
		this.showCompleted = function (){
			filter = 'showCompleted';
			var completed = this.model.getCompleted();
			this.view.setData({
				list: completed,
				total: {
					count: this.model.list.length,
					active: this.model.list.length - completed.length
				}
			});
		};
		this.refresh = function(){
			this[filter]();
		};

		this.addNewTodo = function(text){
			this.model.addItem({
				title: text,
				completed: false
			});
			this.refresh();
		};

		this.editTodo = function(item, value){
			model.setValue(item, value);
			this.refresh();
		};

		this.toggleItemCompleted = function (item){
			this.model.itemSwitchCompleted(item);
			this.refresh();
		};

		this.remItem = function(item){
			this.model.remItem(item);
			this.refresh();
		};

		this.toggleAll = function(onoff){
			this.model.toggleAll(onoff);
			this.refresh();
		};

		this.clearCompleted = function(){
			this.model.clearCompleted();
			this.refresh();
		};
	};
	window.todoController=controller;
})(window);