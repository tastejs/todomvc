/*jshint strict: false */
/*global maria, checkit */

maria.SetModel.subclass(checkit, 'TodosModel', {
	properties: {
		_mode: 'all',
		getPossibleModes: function() {
			return ['all', 'incompleted', 'completed'];
		},
		getMode: function() {
			return this._mode;
		},
		setMode: function(mode) {
			if (this.getPossibleModes().some(function(m) {return m === mode;})) {
				if (this._mode !== mode) {
					this._mode = mode;
					this.dispatchEvent({type: 'change'});
				}
			}
			else {
				throw new Error('checkit.TodosModel.prototype.setMode: unsupported mode "'+mode+'".');
			}
		},
		getCompleted: function() {
			return this.filter(function(todo) {
				return todo.isCompleted();
			});
		},
		getIncompleted: function() {
			return this.filter(function(todo) {
				return !todo.isCompleted();
			});
		},
		isAllCompleted: function() {
			return (this.length > 0) && (this.getCompleted().length === this.length);
		},
		markAllCompleted: function() {
			this.forEach(function(todo) {
				todo.setCompleted(true);
			});
		},
		markAllIncompleted: function() {
			this.forEach(function(todo) {
				todo.setCompleted(false);
			});
		},
		deleteCompleted: function() {
			this['delete'].apply(this, this.getCompleted());
		},
		toJSON: function() {
			return this.map(function(todo) {
				return todo.toJSON();
			});
		}
	}
});

checkit.TodosModel.fromJSON = function(todosJSON) {
	var model = new checkit.TodosModel();
	for (var i = 0, ilen = todosJSON.length; i < ilen; i++) {
		model.add(checkit.TodoModel.fromJSON(todosJSON[i]));
	}
	return model;
};
