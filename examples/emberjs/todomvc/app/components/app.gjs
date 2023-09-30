import Footer from './footer';

function hasTodos(todos) {
  return todos.length > 0;
}

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        onkeydown={{action "createTodo"}}
        placeholder="What needs to be done?"
        autofocus
      >
    </header>

    {{yield}}

    {{#if (hasTodos @model)}}
      <Footer />
    {{/if}}
  </section>


</template>
