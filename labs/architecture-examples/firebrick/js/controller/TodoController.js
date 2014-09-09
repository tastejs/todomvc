Firebrick.define("Todo.controller.TodoController", {
	extends:"Firebrick.controller.Base",
	
	init:function(){
	
		this.app.on({
			"#todo-list li div.view":{
				dblclick: this.todoDblClick,
			},
			"#todo-list li input.edit":{
				blur: this.todoEditBlur,
				keydown: this.keyDownEdit,
			},
			"#todo-list button.destroy":{
				click: this.removeTodo
			},
			"#new-todo":{
				keydown: this.newTodo
			},
			"#clear-completed":{
				click: this.clearCompletedTodos
			},
			"#toggle-all": {
				click: this.toggleAll
			},
			scope:this
		});
	
		//init the view
		this.init_view();
		
		this.callParent();
	},
	
	init_view: function(data){
		var me = this,
			data = window.localStorage.getItem("firebrick-todos"),
			storeConf = {};		
		
		if(data){
			storeConf.data = JSON.parse(data);
		}
		
		var store = Firebrick.createStore("Todo.store.TodoStore", storeConf);
		
		store.on("storeUpdated", function(){
			me.updateFigures(store);
			window.localStorage.setItem("firebrick-todos", store.toJson());
		});
		
		var view = Firebrick.createView("Todo.view.TodoApp", {
			target:"#todoapp",
			controller: this,
			autoRender:false,
			data:store
		});
		
		view.render();
		
		me.activeLink();
		Firebrick.router.onHashChange(function(){
			me.activeLink()
		});
	},
	
	updateFigures: function(store){
		var completed = store.findAllRecords("checked", true);
		store.data.left = store.size() - completed.length;
		store.data.completed = completed.length;
		store.data.allchecked = completed.length == store.size() ? true : false;
	},
	
	activeLink: function(){
		var filters = $("#filters a").removeClass("selected");

		var hash;
		$.each(filters, function(i, element){
			hash = element.hash;
			if(Firebrick.router.is(hash)){
				//show only if not checked
				$(element).addClass("selected");
			}else if(Firebrick.router.is("/") && hash == "#/"){
				//when / is called with no hash
				$(element).addClass("selected");
			}
		});
		
		
		Firebrick.getView("Todo.view.TodoApp").rivets.update();
	},
	
	showMe: function(rivets){
		var todo = rivets.view.models.todo;
		if(todo){
			
			if(Firebrick.router.is("#/active")){
				//show only if not checked
				return !todo.getData("checked");
			}else if(Firebrick.router.is("#/completed")){
				//show only if checked
				return todo.getData("checked");
			}
			
		}
		//show me
		return true;
	},
	
	todoDblClick: function(event, element){
		var me = this, 
			element = $(element),
			parent = element.closest("li"),
			edit = parent.find("> input");
		
		parent.addClass("editing");
		element.hide();
		edit.show();
		edit.focus();
	},
	
	keyDownEdit: function(event, element){
		var me = this,
			key = event.keyCode || event.which,
			element = $(element);
	
		if(key == 13){
			element.blur();
		}
	},
	
	todoEditBlur: function(event, element){
		var me = this, 
			element = $(element),
			li = element.closest("li"),
			container = li.find("> div.view");
			
		li.removeClass("editing");
		element.hide();
		container.show();
	},
	
	newTodo: function(event, element){
		var code = event.keyCode || event.which;
		
		
		if(code == 13){
			var me = this,
				element = $(element),
				view = Firebrick.getView("Todo.view.TodoApp"),
				store = view.getStore(),
				record = Firebrick.createRecord().setData({checked:false, text:element.val()});

			store.insert(0, record);
			
			element.val("");
		}
		
	},
	
	removeTodo: function(event, element){
		var me = this,
			element = $(element),
			li = element.closest("li"),
			view = Firebrick.getView("Todo.view.TodoApp"),
			store = view.getStore();
			
		//manipulate the store by removing the entry
		store.remove("recordId", li.attr("id"));
		
	},
	
	clearCompletedTodos: function(event, element){
		Firebrick.getView("Todo.view.TodoApp").getStore().removeAll("checked", true);
	},
	
	singleToggle:function(event, rivetel){
		//this function is called from view so that the store fires updated event and 
		var el = rivetel.todo,
			checked = rivetel.todo.data.checked;
		if(typeof checked != "boolean"){
			checked = true;
		}else{
			checked = !checked;
		}
		rivetel.todo.setValue("checked", checked);
	},
	
	toggleAll: function(event, element){
		var me = this,
			element = $(element),
			checked = element.is(":checked"),
			view = Firebrick.getView("Todo.view.TodoApp"),
			records = view.getStore().findAll();	
		
		$.each(records, function(i, r){
			//TODO: Batch call for Rivets
			r.data.checked = checked ? true : false;
		});
		
		view.getStore().fireEvent("storeUpdated", view.getStore(), records);
	}
	
});