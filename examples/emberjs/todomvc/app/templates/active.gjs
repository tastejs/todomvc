import title from 'ember-page-title/helpers/page-title';
import Route from 'ember-route-template';
import TodoList from 'todomvc/components/todo-list';

export default Route(
	<template>
		{{title "Active"}}

		<TodoList @todos={{@model.todos}} />
	</template>,
);
