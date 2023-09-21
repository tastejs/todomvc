<template>
    <footer class="footer" v-show="todos.length > 0">
        <span class="todo-count">
            <strong>{{ remaining }}</strong> {{ pluralizedWord }} left
        </span>
        <ul class="filters">
            <li><router-link to="/" :class="{ selected: route == 'all' }">All</router-link></li>
            <li><router-link to="/active" :class="{ selected: route == 'active' }">Active</router-link></li>
            <li><router-link to="/completed" :class="{ selected: route == 'completed' }">Completed</router-link></li>
        </ul>
        <button class="clear-completed" v-show="completed" @click="$emit('delete-completed')">Clear Completed</button>
    </footer>
</template>

<script>
export default {
    name: "TodoFooter",
    props: {
        todos: Array,
        remaining: Number,
        route: String,
        completed: Number,
    },
    computed: {
        pluralizedWord() {
            return this.remaining === 1 ? "item" : "items";
        },
    },
    emits: ["delete-completed"],
};
</script>
