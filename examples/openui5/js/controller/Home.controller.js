/* global sap, jQuery */

sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'../control/ToDoControl'
], function (Controller, ToDoControl) {
	'use strict';

	// load SAPUI5 localStorage wrapper
	jQuery.sap.require('jquery.sap.storage');

	return Controller.extend('ToDoMVC.controller.Home', {

		onInit: function () {
			// enable routing for filter mode
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// handle filter mode
			oRouter.getRoute('appHomeFilter').attachPatternMatched(this._onObjectMatched, this);
			// handle unfiltered mode
			oRouter.getRoute('appHome').attachPatternMatched(this._onObjectMatched, this);

			// initiate GUID storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			if (!localStorage.getItem('0')) {
				localStorage.setItem('0', 0);
			}

			//Create Model
			var oModel = new sap.ui.model.json.JSONModel({
				allToDos: [],
				filterMode: 'all'
			});
			this.getView().setModel(oModel);

			if (oStorage.get('todos-openui5')) {
				oModel.setData(oStorage.get('todos-openui5'));
			} else {
				oStorage.put('todos-openui5', oModel.getData());
			}

			// instantiate new custom control
			var newControl = new ToDoControl({

				toDosObject: '{/allToDos}',

				filter: '{/filterMode}',

				addToDoPressed: function (oEvent) {
					// generate new ID
					localStorage.setItem('0', +localStorage.getItem('0') + 1);

					// add new todo to localStorage
					oModel.getProperty('/allToDos').push({
						id: +localStorage.getItem('0'),
						title: oEvent.getParameter('title'),
						completed: false
					});

					oStorage.put('todos-openui5', oModel.getData());
					oModel.refresh(true);
				},

				deleteToDoPressed: function (oEvent) {
					var allStillExistingToDos = oModel.getProperty('/allToDos');

					// remove todo from localStorage
					allStillExistingToDos.some(function (value, i) {
						if (value.id === +oEvent.getParameter('toDoId')) {
							allStillExistingToDos.splice(i, 1);
							return true;
						}
					}, this);

					oStorage.put('todos-openui5', oModel.getData());
					oModel.refresh(true);
				},

				deleteAllCompletedToDosPressed: function (oEvent) {
					var allStillExistingToDos = oModel.getProperty('/allToDos');
					var elems = oEvent.getParameter('toDoIds');
					var removeIthElement = function (value, i) {
						if (+elems[0] === value.id) {
							allStillExistingToDos.splice(i, 1);
							elems.splice(0, 1);
							return true;
						}
					};

					// remove completed todos from localStorage
					while (elems.length > 0) {
						allStillExistingToDos.some(removeIthElement, this);
					}

					oStorage.put('todos-openui5', oModel.getData());
					oModel.refresh(true);
				},

				completedToDoPressed: function (oEvent) {
					var allStillExistingToDos = oModel.getProperty('/allToDos');

					// update todo within localStorage
					allStillExistingToDos.some(function (value) {
						if (value.id === +oEvent.getParameter('toDoId')) {
							value.completed = oEvent.getParameter('completed');
							// short circuit the loop
							return true;
						}
					}, this);

					oStorage.put('todos-openui5', oModel.getData());
					oModel.refresh(true);
				},

				toDoChangedPressed: function (oEvent) {
					var allStillExistingToDos = oModel.getProperty('/allToDos');

					// update todo within localStorage
					allStillExistingToDos.some(function (value) {
						if (value.id === +oEvent.getParameter('toDoId')) {
							value.title = oEvent.getParameter('title');
							return true;
						}
					}, this);

					oStorage.put('todos-openui5', oModel.getData());
					oModel.refresh(true);
				}
			});

			// add new control to page on app view
			this.getView().getContent()[0].addContent(newControl);
		},

		_onObjectMatched: function (oEvent) {
			if (oEvent.getParameter('arguments').filter) {
				// use regex to escape chars and trim whitespaces. Only underscores allowed.
				var filter = oEvent.getParameter('arguments').filter.replace(/[^\w]/gi, '');

				if (filter === 'active' || filter === 'completed') {
					this.getView().getModel().setProperty('/filterMode', filter);
				}
			} else {
				this.getView().getModel().setProperty('/filterMode', 'all');
			}

			jQuery.sap.storage(jQuery.sap.storage.Type.local).put('todos-openui5', this.getView().getModel().getData());
			this.getView().getModel().refresh(true);
		}
	});

});
