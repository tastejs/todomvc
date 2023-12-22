<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

const props = defineProps(['todos']);
const route = useRoute();
const remaining = computed(() => props.todos.filter(todo => !todo.completed).length);
</script>

<template>
    <footer class="footer" v-show="todos.length > 0">
        <span class="todo-count">
            <strong>{{ remaining }}</strong> {{ remaining === 1 ? "item" : "items" }} left
        </span>
        <ul class="filters">
            <li><RouterLink to="/" :class="{ selected: route.name == 'all' }">All</RouterLink></li>
            <li><RouterLink to="/active" :class="{ selected: route.name == 'active' }">Active</RouterLink></li>
            <li><RouterLink to="/completed" :class="{ selected: route.name == 'completed' }">Completed</RouterLink></li>
        </ul>
        <button class="clear-completed" v-show="todos.some(todo => todo.completed)" @click="$emit('delete-completed')">Clear Completed</button>
    </footer>
</template>