<template>
  <footer class="footer">
    <span class="todo-count"><strong>{{remaining.length}}</strong> {{pluralize "item" remaining.length}} left</span>
    <ul class="filters">
      <li>{{#link-to "index" activeClass="selected"}}All{{/link-to}}</li>
      <li>{{#link-to "active" activeClass="selected"}}Active{{/link-to}}</li>
      <li>{{#link-to "completed" activeClass="selected"}}Completed{{/link-to}}</li>
    </ul>
    {{#if completed.length}}
      <button class="clear-completed" onclick={{action "clearCompleted"}}>Clear completed</button>
    {{/if}}
  </footer>
</template>
