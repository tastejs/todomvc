/*global Backbone */

/**
 * @class Todos
 * @extend Backbone.Collection
 **/
var Todos = Backbone.Collection.extend({

	//this is Backendless Table name
	schemaName: 'Todo',

	//add default sorting for retrieve sorted items form the backendless server
	sortingBy: 'order asc',

	//by default backendless return the first 10 item, we extend it by 100
	itemsPerPage: 100,

	/**
	 * @class Todo
	 * @extend Backbone.Model
	 **/
	model: Backbone.Model.extend({
		defaults: function () {
			return {
				title: '',
				completed: false,
				order: new Date().getTime()
			};
		},

		toggle: function () {
			this.savePatch({completed: !this.get('completed')});
		},

		//we don't need to send to server all model data, instead we want to send only changed props
		savePatch: function (data) {
			this.save(data, {patch: true});
		}
	}),

	completed: function () {
		return this.where({completed: true});
	},

	remaining: function () {
		return this.where({completed: false});
	},

	setFilter: function (filterMode) {
		this.trigger('change:filterMode', this.filterMode = filterMode);
	}
});
