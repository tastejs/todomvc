<script setup>
import { RouterLink } from 'vue-router';

const emit = defineEmits(['add-todo']);

function onEnter(event) {
    const text = event.target.value.trim();
    if (text.length === 0) return;
    emit('add-todo', text);
    event.target.value = '';
}
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
            @keyup.enter="onEnter"
        />
    </header>
</template>
