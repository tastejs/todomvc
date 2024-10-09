import Route from 'ember-route-template';
import TodoList from 'todomvc/components/todo-list';

export default Route(
	<template>
		{{#if @model.todos.length}}
			<TodoList @todos={{@model.todos}} />
		{{/if}}
	</template>,
);
