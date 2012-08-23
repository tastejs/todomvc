'use strict';
var TodoController = Stapes.create().extend({
	'bindEventHandlers': function() {
		this.on({
			'change:state': function(state) {
				this.view.setActiveRoute(state);
				this.renderAll();
			}
		});

		this.model.on({
			'change' : function() {
				this.renderAll();
			},

			'change ready': function() {
				this.view.showClearCompleted( this.model.getComplete().length );
			}
		}, this);

		this.view.on({
			'clearcompleted': function() {
				this.model.clearCompleted();
			},

			'edittodo': function(id) {
				this.view.makeEditable(id);
			},

			'ready': function() {
				this.model.set( this.store.load() );
			},

			'statechange': function(state) {
				this.set('state', state);
			},

			'todoadd': function(todo) {
				this.model.addTodo(todo);
				this.view.clearInput();
			},

			'tododelete': function(id) {
				this.model.remove(id);
			},

			'todocompleted todouncompleted': function(id, e) {
				this.model.update(id, function(item) {
					item.completed = (e.type === 'todocompleted');
					return item;
				});
			},

			'todoedit': function(data) {
				if (data.title === "") {
					this.model.remove(data.id);
				} else {
					this.model.update(data.id, function(item) {
						item.title = data.title;
						return item;
					});
				}
			},

			'completedall uncompletedall': function(completedall, e) {
				this.model.update(function(item) {
					item.completed = completedall;
					return item;
				});
			}
		}, this);
	},

	renderAll: function() {
		this.store.save( this.model.getAll() );
		this.view.render( this.model.getItemsByState( this.get('state') ) );
		this.view.showLeft( this.model.getLeft().length );

		if ( this.model.getAllAsArray().length > 0 ) {
			this.view.show();
		} else {
			this.view.hide();
		}
	},

	'init': function() {
		this.model = TodoModel;
		this.view = TodoView;
		this.store = TodoStore;

		this.bindEventHandlers();

		this.model.init();
		this.view.init();
		this.store.init();

		// Initial state from the URL
		this.set('state', this.view.getState());

	}
});
