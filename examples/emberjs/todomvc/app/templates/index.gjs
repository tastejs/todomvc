import Route from 'ember-route-template';
import TodoList from 'todomvc/components/todo-list';

export default Route(
  <template>
    {{#if @model.length}}
      <TodoList @todos={{@model}} />
    {{/if}}
  </template>
)
