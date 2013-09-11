/*global goog, mvc, todomvc */
goog.provide('todomvc.listmodel');

goog.require('mvc.Collection');
goog.require('todomvc.listsync');
goog.require('todomvc.todomodel');


/**
 * @constructor
 * @extends {mvc.Collection}
 */
todomvc.listmodel = function () {

	var todosSchema = {
		// number of completed
		'completed': {
			get: function () {
				return this.getModels('completed').length;
			},
			models: true
		},
		'allDone': {
			get: function () {
				return this.getLength() === this.getModels('completed').length;
			},
			set: function (done) {
				goog.array.forEach(this.getModels('none'), function (model) {
					model.set('completed', done);
				});
			},
			models: true
		},
		// number of active models
		'active': {
			get: function () {
				return this.getLength() - this.getModels('completed').length;
			},
			models: true
		},
		// the total
		'total': {
			get: function () {
				return this.getLength();
			},
			models: true
		}
	};

	goog.base(this, {
		'id': 'todos-plastronjs',
		'sync': new todomvc.listsync(),
		'schema': todosSchema,
		'modelType': todomvc.todomodel
	});

	// fetch from localstorage
	this.fetch();

	// save on any changes
	this.anyModelChange(this.save);
};
goog.inherits(todomvc.listmodel, mvc.Collection);


todomvc.listmodel.Filter = {
	'none': function () {
		return true;
	},
	'active': function (model) {
		return !model.get('completed');
	},
	'completed': function (model) {
		return model.get('completed');
	}
};


/**
 * return models based on current filter or filter given
 *
 * @inheritDoc
 */
todomvc.listmodel.prototype.getModels = function (opt_filter) {
	return goog.base(this, 'getModels',
		todomvc.listmodel.Filter[opt_filter || this.get('filter')]);
};


/**
 * @return {Object} todos as json.
 */
todomvc.listmodel.prototype.toJson = function () {
	return goog.array.map(this.getModels('none'), function (mod) {
		return mod.toJson();
	});
};
