import Route from 'ember-route-template';
import TodoList from 'todomvc/components/todo-list';

export default Route(
  <template>
    {{page-title "Active"}}

    <TodoList @todos={{@model}} />
  </template>
)

