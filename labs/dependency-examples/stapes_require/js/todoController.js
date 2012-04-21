define(
["lib/stapes", "todoModel", "todoView", "todoStore"],
function(Stapes, TodoModel, TodoView, TodoStore) {
	return Stapes.create().extend({
		"bindEventHandlers" : function() {
			this.model.on({
				"change" : function() {
					this.store.save( this.model.getAll() );
					this.view.render( this.model.getAllAsArray() );
					this.view.showLeft( this.model.getLeft().length );

					if (this.model.getAllAsArray().length > 0) {
						this.view.show();
					} else {
						this.view.hide();
					}
				},

				"change ready" : function() {
					this.view.showClearCompleted( this.model.getComplete().length );
				}
			}, this);

			this.view.on({
				"clearcompleted" : function() {
					this.model.clearCompleted();
				},

				"edittodo" : function(id) {
					this.model.update(id, function(item) {
						item.edit = true;
						return item;
					});
				},

				"ready" : function() {
					this.model.set( this.store.load() );
				},

				"statechange" : function(state) {
					switch(state) {
						case "all":
							this.view.render( this.model.getAllAsArray() );
							break;
						case "active":
							this.view.render( this.model.getLeft() );
							break;
						case "completed":
							this.view.render( this.model.getComplete() );
							break;
					}
				},

				"taskadd" : function(task) {
					this.model.addTask(task);
					this.view.clearInput();
				},

				"taskdelete" : function(id) {
					this.model.remove(id);
				},

				"taskdone taskundone" : function(id, e) {
					this.model.update(id, function(item) {
						item.complete = e.type === "taskdone";
						return item;
					});
				},

				"taskedit" : function(data) {
					this.model.update(data.id, function(item) {
						item.name = data.name;
						item.edit = false;
						return item;
					});
				},

				"doneall undoneall" : function(alldone) {
					this.model.update(function(item) {
						item.complete = alldone;
						return item;
					});
				}
			}, this);
		},

		"init" : function() {
			this.model = TodoModel;
			this.view = TodoView;
			this.store = TodoStore;

			this.bindEventHandlers();

			this.model.init();
			this.view.init();
			this.store.init();
		}
	});
});