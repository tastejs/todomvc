<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
  <header class="header">
    <RouterLink to="/"><h1>todos</h1></RouterLink>
    <input
            type="text"
            class="new-todo"
            autofocus
            autocomplete="off"
            placeholder="What needs to be done?"
            @keyup.enter="
                // @ts-ignore
                $emit('add-todo', $event.target.value);
                // @ts-ignore
                $event.target.value = '';
            "
      />
  </header>
</template>