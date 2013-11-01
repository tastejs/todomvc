/*global define */

define(function (require) {
	'use strict';

	var CollectionView = require('app/ui/views/CollectionView');
	var TodoItemView = require('app/ui/views/TodoItemView');
	var $ = require('$');

	/**
	 * Todos view type
	 * @class app.ui.views.TodosCollectionView
	 * @super app/ui/views/CollectionView
	 */
	var TodosCollectionView = CollectionView.extend(function TodosCollectionView() {
		CollectionView.apply(this, arguments);
		this.mapChildViewEvent('removeView', this.onRemoveView.bind(this), this.TView);

		this.render();
	}, {
		/**
		 * A class name added to the view container
		 * @property className
		 * @type String
		 */
		className: 'todos-collection-view',

		/**
		 * A function that should return a jQuery element that will be used as the
		 * `el` for a particular item in the collection. The function is passed two
		 * parameters, the model and the index.
		 * @property itemEl
		 * @type jQuery
		 */
		itemEl: function () {
			return $('<li/>');
		},

		/**
		 * The view type used for each item view
		 * @property itemEl
		 * @type lavaca.mvc.View
		 */
		TView: TodoItemView,

		/**
		 * Executes when the template renders successfully
		 * @method onRenderSuccess
		 *
		 * @param {Event} e  The render event. This object should have a string
		 *                   property named "html" that contains the template's
		 *                   rendered HTML output.
		 */
		onRenderSuccess: function (e) {
			this.el.html(e.html);
			this.bindMappedEvents();
			this.applyEvents();
			this.createWidgets();
			this.el.data('view', this);
			this.el.attr('data-view-id', this.id);
			this.hasRendered = true;
		},

		/**
		 * The filter to run against the collection
		 * @method modelFilter
		 * @param {Number} [i] the index
		 * @param {Object} [model] the model
		 */
		modelFilter: function (i, model) {
			var filter = this.model.get('filter');
			var shouldBeComplete = filter === 'completed';

			if (filter === 'all' || model.get('completed') === shouldBeComplete) {
				return true;
			}
		},

		/**
		 * Removes a view when removeView event it triggered
		 * @method swapViews
		 * @param {Obejct} [viewA] a view
		 * @param {Obejct} [viewB] another view
		 */
		onRemoveView: function (e) {
			this.model.remove(e.model);
		}
	});

	return TodosCollectionView;
});
