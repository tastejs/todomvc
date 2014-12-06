/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Backbone */
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';

	// An example generic Mixin that you can add to any component that should
	// react to changes in a Backbone component. The use cases we've identified
	// thus far are for Collections -- since they trigger a change event whenever
	// any of their constituent items are changed there's no need to reconcile for
	// regular models. One caveat: this relies on getBackboneCollections() to
	// always return the same collection instances throughout the lifecycle of the
	// component. If you're using this mixin correctly (it should be near the top
	// of your component hierarchy) this should not be an issue.
	var BackboneMixin = {
		componentDidMount: function () {
			// Whenever there may be a change in the Backbone data, trigger a
			// reconcile.
			this.getBackboneCollections().forEach(function (collection) {
				// explicitly bind `null` to `forceUpdate`, as it demands a callback and
				// React validates that it's a function. `collection` events passes
				// additional arguments that are not functions
				collection.on('add remove change destroy', this.forceUpdate.bind(this, null));
			}, this);
		},

		componentWillUnmount: function () {
			// Ensure that we clean up any dangling references when the component is
			// destroyed.
			this.getBackboneCollections().forEach(function (collection) {
				collection.off(null, null, this);
			}, this);
		}
	};

	var ToggleAllCheckbox = app.ToggleAllCheckbox;
	var NewTodoInput = app.NewTodoInput;
	var TodoList = app.TodoList;
	var TodosLeftCount = app.TodosLeftCount;
	var Filters = app.Filters;
	var ClearButton = app.ClearButton;

	var TodoApp = React.createClass({
		mixins: [BackboneMixin],
		getBackboneCollections: function () {
			return [this.props.todos];
		},

		getInitialState: function () {
			return {nowShowing: app.ALL_TODOS};
		},

		componentDidMount: function () {
			var Router = Backbone.Router.extend({
				routes: {
					'': 'all',
					active: 'active',
					completed: 'completed'
				},
				all: this.setState.bind(this, {nowShowing: app.ALL_TODOS}),
				active: this.setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				completed: this.setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});

			new Router();
			Backbone.history.start();

      // fetch the todos when the
			this.props.todos.fetch();
		},

		render: function () {
			var header;
			var main;
			var footer;
			var todos = this.props.todos;

			var activeTodoCount = todos.activeTodoCount();
			var completedCount = todos.length - activeTodoCount;
			var shownTodos = this.props.todos.filterByShowing(this.state.nowShowing);

			// always show the header
			header =
				<header id="header">
					<h1>todos</h1>
					<NewTodoInput todos={todos} />
				</header>;

			// only show the main list items if there are items to show
			if(shownTodos.length > 0)
				main =
					<section id="main">
						<ToggleAllCheckbox
							todos={todos}
							activeTodoCount={activeTodoCount} />
						<TodoList
							shownTodos={shownTodos} />
					</section>;

			// only show the footer if there are any todos
			if(todos.length > 0)
				footer =
					<footer id="footer">
						<TodosLeftCount count={activeTodoCount} />
						<Filters nowShowing={this.state.nowShowing} />
						<ClearButton todos={todos} completedCount={completedCount} />
					</footer>;

			return (
				<div>
					{header}
					{main}
					{footer}
				</div>
			);
		}
	});

	React.renderComponent(
		<TodoApp todos={app.todos} />,
		document.getElementById('todoapp')
	);
})();
