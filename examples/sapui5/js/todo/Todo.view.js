/*global jQuery, sap, todo, $ */
/*jshint unused:false */

/*
 * Does all UI-related things like creating controls, data binding configuration,
 * setting up callbacks, etc. Does not perform any business logic.
 */
(function () {
	'use strict';

	jQuery.sap.require('todo.SmartTextField');
	jQuery.sap.require('todo.formatters');

	sap.ui.jsview('todo.Todo', {

		getControllerName: function () {
			return 'todo.Todo';
		},

		controls: [],

		repeater: false,

		createContent: function (oController) {
			var toggleAll, newTodo, todosRepeater, completedDataTemplate, todoTemplate, todoCount,
				todosSelection, clearCompleted, todosFooter;

			// Toggle button to mark all todos as completed / open
			toggleAll = new sap.ui.commons.CheckBox({
				id: 'toggle-all',
				checked: {
					path: '/todos/',
					formatter: todo.formatters.allCompletedTodosFormatter
				},
				visible: {
					path: '/todos/',
					formatter: todo.formatters.isArrayNonEmptyFormatter
				}
			}).attachChange(function () {
				oController.toggleAll();
			});
			this.controls.push(toggleAll);

			// Text field for entering a new todo
			newTodo = new todo.SmartTextField('new-todo', {
				placeholder: 'What needs to be done?',
				autofocus: true
			}).attachChange(function () {
				oController.createTodo(this.getProperty('value'));
				this.setValue('');
			}).addStyleClass('create-todo');

			this.controls.push(newTodo);

			// Row repeater that will hold our todos
			todosRepeater = new sap.ui.commons.RowRepeater('todo-list', {
				design: sap.ui.commons.RowRepeaterDesign.Transparent,
				numberOfRows: 100
			});
			this.repeater = todosRepeater;

			// Completed flag that is later bound to the done status of a todo
			// We attach this to each text field and write it to the DOM as a data-*
			// attribute; this way, we can refer to it in our stylesheet
			completedDataTemplate = new sap.ui.core.CustomData({
				key: 'completed',
				value: {
					path: 'done',
					formatter: todo.formatters.booleanToStringFormatter
				},
				writeToDom: true
			});

			// A template used by the row repeater to render a todo
			todoTemplate = new sap.ui.commons.layout.HorizontalLayout({
				content: [new sap.ui.commons.CheckBox({
					checked: '{done}'
				}).attachChange(function () {
					oController.todoToggled(this.getBindingContext());
				}), new todo.SmartTextField({
					value: '{text}',
					strongediting: true
				}).attachBrowserEvent('dblclick', function (e) {
					$('.destroy').css('display', 'none');
				}).attachChange(function () {
					oController.todoRenamed(this.getBindingContext());
				}).addStyleClass('todo').addCustomData(completedDataTemplate),
				new sap.ui.commons.Button({
					lite: true,
					text: ''
				}).addStyleClass('destroy').attachPress(function () {
					oController.clearTodo(this.getBindingContext());
				})]
			});

			// Helper function to rebind the aggregation with different filters
			todosRepeater.rebindAggregation = function (filters) {
				this.unbindRows();
				this.bindRows('/todos/', todoTemplate, null, filters);
			};

			// Initially, we don't filter any todos
			todosRepeater.rebindAggregation([]);

			this.controls.push(todosRepeater);

			// Counts open todos
			todoCount = new sap.ui.commons.TextView('todo-count', {
				text: {
					path: '/todos/',
					formatter: todo.formatters.openTodoCountFormatter
				}
			});

			// Allows selecting what todos to show
			todosSelection = new sap.ui.commons.SegmentedButton('filters', {

				id: 'TodosSelection',
				buttons: [new sap.ui.commons.Button({
					id: 'AllTodos',
					lite: true,
					text: 'All'
				}), new sap.ui.commons.Button({
					id: 'ActiveTodos',
					lite: true,
					text: 'Active'
				}), new sap.ui.commons.Button({
					id: 'CompletedTodos',
					lite: true,
					text: 'Completed'
				})]
			}).attachSelect(function (e) {
				oController.todosSelected(e.getParameters().selectedButtonId);
			});
			todosSelection.setSelectedButton('AllTodos');

			// Button to clear all completed todos
			clearCompleted = new sap.ui.commons.Button({
				id: 'clear-completed',
				lite: true,
				text: 'Clear Completed',
				visible: {
					path: '/todos/',
					formatter: todo.formatters.hasCompletedTodosFormatter
				}
			}).attachPress(function () {
				oController.clearCompletedTodos();
			});

			todosFooter = new sap.ui.commons.layout.HorizontalLayout('footer', {
				content: [todoCount, todosSelection, clearCompleted],
				visible: {
					path: '/todos/',
					formatter: todo.formatters.isArrayNonEmptyFormatter
				}
			});

			this.controls.push(todosFooter);

			return this.controls;
		},

		changeSelection: function (filters) {
			this.repeater.rebindAggregation(filters);
		}

	});
})();
