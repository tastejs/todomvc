var TodoController = Stapes.create().extend({
	"bindEventHandlers": function() {
		this.model.on({
			"change" : function() {
				this.store.save( this.model.getAll() );
				this.view.render( this.model.getAllAsArray() );
				this.view.showLeft( this.model.getLeft().length );

				if ( this.model.getAllAsArray().length > 0 ) {
					this.view.show();
				} else {
					this.view.hide();
				}
			},

			"change ready": function() {
				this.view.showClearCompleted( this.model.getComplete().length );
			}
		}, this);

		this.view.on({
			"clearcompleted": function() {
				this.model.clearCompleted();
			},

			"editTodo": function(id) {
				this.model.update(id, function(item) {
					item.edit = true;
					return item;
				});
			},

			"ready": function() {
				this.model.set( this.store.load() );
			},

			"statechange": function(state) {
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

			"todoadd": function(todo) {
				this.model.addTodo(todo);
				this.view.clearInput();
			},

			"tododelete": function(id) {
				this.model.remove(id);
			},

			"todocompleted todouncompleted": function(id, e) {
				this.model.update(id, function(item) {
					item.completed = e.type === "todocompleted";
					return item;
				});
			},

			"todoedit": function(data) {
				this.model.update(data.id, function(item) {
					item.name = data.name;
					item.edit = false;
					return item;
				});
			},

			"completeall uncompleteall": function(completeall) {
				this.model.update(function(item) {
					item.completed = completeall;
					return item;
				});
			}
		}, this);
	},

	"init": function() {
		this.model = TodoModel;
		this.view = TodoView;
		this.store = TodoStore;

		this.bindEventHandlers();

		this.model.init();
		this.view.init();
		this.store.init();
	}
});