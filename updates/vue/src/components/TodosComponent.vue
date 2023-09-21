<template>
    <TodoHeader @add-todo="addTodo" />
    <main class="main" v-show="todos.length" v-cloak>
        <div class="toggle-all-container">
            <input type="checkbox" id="toggle-all-input" class="toggle-all" v-model="toggleAllModel" />
            <label class="toggle-all-label" htmlFor="toggle-all-input"> Toggle All Input </label>
        </div>
        <ul class="todo-list">
            <TodoItem v-for="(todo, index) in filteredTodos" :key="todo.id" :todo="todo" :index="index" @delete-todo="deleteTodo" @edit-todo="editTodo" @toggle-todo="toggleTodo" />
        </ul>
    </main>
    <TodoFooter :todos="todos" @delete-completed="deleteCompleted" :remaining="activeTodos.length" :completed="completedTodos.length" :route="route" />
</template>

<script>
import TodoHeader from "./TodoHeader.vue";
import TodoFooter from "./TodoFooter.vue";
import TodoItem from "./TodoItem.vue";

function uuid() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        let random = (Math.random() * 16) | 0;
        // prettier-ignore
        if (i === 8 || i === 12 || i === 16 || i === 20)
            uuid += "-";

        uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
    }
    return uuid;
}

const filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter((todo) => !todo.completed),
    completed: (todos) => todos.filter((todo) => todo.completed),
};

export default {
    components: {
        TodoHeader,
        TodoFooter,
        TodoItem,
    },
    data() {
        return {
            todos: [],
        };
    },
    methods: {
        addTodo(value) {
            this.todos.push({
                completed: false,
                title: value,
                id: uuid(),
            });
        },
        toggleTodo(todo, value) {
            todo.completed = value;
        },
        deleteTodo(todo) {
            this.todos = this.todos.filter((t) => t !== todo);
        },
        editTodo(todo, value) {
            // prettier-ignore
            if (todo)
                todo.title = value;
        },
        deleteCompleted() {
            this.todos = this.activeTodos;
        },
    },
    computed: {
        activeTodos() {
            return filters.active(this.todos);
        },
        completedTodos() {
            return filters.completed(this.todos);
        },
        filteredTodos() {
            switch (this.$route.name) {
                case "active":
                    return this.activeTodos;
                case "completed":
                    return this.completedTodos;
            }
            return this.todos;
        },
        route() {
            return this.$route.name;
        },
        toggleAllModel: {
            get() {
                return this.activeTodos.length === 0;
            },
            set(value) {
                this.todos.forEach((todo) => {
                    todo.completed = value;
                });
            },
        },
    },
};
</script>

<style src="./todos-component.css"></style>
<style src="../../node_modules/todomvc-common/base.css"></style>
<style src="../../node_modules/todomvc-app-css/index.css"></style>
