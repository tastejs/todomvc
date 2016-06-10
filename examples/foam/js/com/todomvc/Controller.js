(function () {
	'use strict';
	// Necessary JSHint options. CLASS is not a constructor, just a global function.
	/* jshint newcap: false */
	// These are provided by FOAM (up through EasyDAO) or defined in this file.
	/* global CLASS, TRUE, SET, GROUP_BY, COUNT */

	CLASS({
		package: 'com.todomvc',
		name: 'Controller',
		traits: ['foam.ui.CSSLoaderTrait'],
		requires: ['foam.ui.TextFieldView', 'foam.ui.DAOListView', 'foam.dao.EasyDAO', 'foam.memento.WindowHashValue',
				'com.todomvc.Todo', 'com.todomvc.TodoDAO', 'com.todomvc.TodoFilterView'],
		properties: [
			{
				name: 'input',
				setter: function (text) {
					// This is a fake property that adds the todo when its value gets saved.
					if (text) {
						this.dao.put(this.Todo.create({text: text}));
						this.propertyChange('input', text, '');
					}
				},
				view: { factory_: 'foam.ui.TextFieldView', placeholder: 'What needs to be done?' }
			},
			{ name: 'dao' },
			{ name: 'filteredDAO',    model_: 'foam.core.types.DAOProperty', view: 'foam.ui.DAOListView' },
			{ name: 'completedCount', model_: 'IntProperty' },
			{ name: 'activeCount',    model_: 'IntProperty', postSet: function (_, c) { this.toggle = !c; }},
			{ name: 'toggle',         model_: 'BooleanProperty', postSet: function (_, n) {
				if (n === this.activeCount > 0) {
					this.dao.update(SET(this.Todo.COMPLETED, n));
				}
			}},
			{
				name: 'query',
				postSet: function (_, q) { this.filteredDAO = this.dao.where(q); },
				defaultValue: TRUE,
				view: 'com.todomvc.TodoFilterView'
			},
			{
				name: 'memento',
				factory: function () { return this.WindowHashValue.create(); }
			}
		],
		actions: [
			{
				name: 'clear',
				label: 'Clear completed',
				isEnabled: function () { return this.completedCount; },
				action: function () { this.dao.where(this.Todo.COMPLETED).removeAll(); }
			}
		],
		listeners: [
			{
				name: 'onDAOUpdate',
				isFramed: true,
				code: function () {
					this.dao.select(GROUP_BY(this.Todo.COMPLETED, COUNT()))(function (q) {
						this.completedCount = q.groups[true];
						this.activeCount = q.groups[false];
					}.bind(this));
				}
			}
		],
		methods: {
			init: function () {
				this.SUPER();
				this.filteredDAO = this.dao = this.TodoDAO.create({
					delegate: this.EasyDAO.create({model: this.Todo, seqNo: true, daoType: 'LOCAL', name: 'todos-foam'}) });
				this.dao.listen(this.onDAOUpdate);
				this.onDAOUpdate();
			}
		},
		templates: [
			function CSS() {/*
				#filters .selected { font-weight: bold; }
				#filters li { margin: 4px; }
				.actionButton-clear:disabled { display: none; }
			*/},
			function toDetailHTML() {/*
			<section id="todoapp">
				<header id="header"><h1>todos</h1>$$input{id: 'new-todo'}</header>
				<section id="main">
					$$toggle{id: 'toggle-all', showLabel: false}
					$$filteredDAO{tagName: 'ul', id: 'todo-list'}
				</section>
				<footer id="footer">
					<span id="todo-count">
						<strong>$$activeCount{mode: 'read-only'}</strong> item<%# this.data.activeCount == 1 ? '' : 's' %> left
					</span>
					$$query{id: 'filters'}
					$$clear{id: 'clear-completed'}
				</footer>
			</section>
			<footer id="info">
				<p>Double-click to edit a todo</p>
				<p>Created by <a href="mailto:kgr@chromium.org">Kevin Greer</a></p>
				<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
			</footer>
			<%
				var f = function () { return this.completedCount + this.activeCount == 0; }.bind(this.data);
				this.setClass('hidden', f, 'main');
				this.setClass('hidden', f, 'footer');
				Events.relate(this.data.memento, this.queryView.text$,
						function (memento) {
							var s = memento && memento.substring(1);
							var t = s ? s.capitalize() : 'All';
							return t;
						},
						function (label) { return '/' + label.toLowerCase(); });
				this.addInitializer(function () {
					X.$('new-todo').focus();
				});
			%>
			*/}
		]
	});
})();
