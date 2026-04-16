<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import TodoFooter from './TodoFooter.vue';
import TodoHeader from './TodoHeader.vue';
import TodoItem from './TodoItem.vue';

const TAGS = {
    all: { name: '全部', color: null, value: 'all' },
    personal: { name: '个人', color: '#2ecc71', value: 'personal' },
    work: { name: '工作', color: '#3498db', value: 'work' },
    urgent: { name: '紧急', color: '#e74c3c', value: 'urgent' }
};

const STORAGE_KEY = 'todos-vuejs';

const todos = ref([]);
const currentTag = ref('all');
const route = useRoute();

function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        todos.value = parsed.map(todo => ({
            ...todo,
            tag: todo.tag || 'personal'
        }));
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
}

onMounted(() => {
    loadTodos();
});

watch(todos, () => {
    saveTodos();
}, { deep: true });

const filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter((todo) => !todo.completed),
    completed: (todos) => todos.filter((todo) => todo.completed),
};

const activeTodos = computed(() => filters.active(todos.value));
const completedTodos = computed(() => filters.completed(todos.value));

const statusFilteredTodos = computed(() => {
    switch(route.name) {
        case "active":
            return activeTodos.value;
        case "completed":
            return completedTodos.value;
        default:
            return todos.value;
    }
});

const filteredTodos = computed(() => {
    if (currentTag.value === 'all') {
        return statusFilteredTodos.value;
    }
    return statusFilteredTodos.value.filter(todo => todo.tag === currentTag.value);
});

const toggleAllModel = computed({
    get() {
        return activeTodos.value.length === 0;
    },
    set(value) {
        todos.value.forEach((todo) => {
            todo.completed = value;
        });
    },
});

function uuid() {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        let random = (Math.random() * 16) | 0;

        if (i === 8 || i === 12 || i === 16 || i === 20)
            uuid += "-";

        uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
    }
    return uuid;
}

function addTodo(value, tag = 'personal') {
    todos.value.push({
        completed: false,
        title: value,
        id: uuid(),
        tag: tag
    });
}

function deleteTodo(todo) {
    todos.value = todos.value.filter((t) => t !== todo);
}

function toggleTodo(todo, value) {
    todo.completed = value;
}

function editTodo(todo, value) {
    todo.title = value;
}

function deleteCompleted() {
    todos.value = todos.value.filter(todo => !todo.completed);
}

function setCurrentTag(tag) {
    currentTag.value = tag;
}
</script>

<template>
    <TodoHeader @add-todo="addTodo" />
    <div class="tag-filter" v-show="todos.length > 0">
        <button 
            v-for="(tag, key) in TAGS" 
            :key="key"
            class="tag-button"
            :class="{ selected: currentTag === key }"
            :style="{ '--tag-color': tag.color }"
            @click="setCurrentTag(key)"
        >
            <span class="tag-dot" v-if="tag.color" :style="{ backgroundColor: tag.color }"></span>
            {{ tag.name }}
        </button>
    </div>
    <main class="main" v-show="filteredTodos.length > 0">
        <div class="toggle-all-container">
            <input type="checkbox" id="toggle-all-input" class="toggle-all" v-model="toggleAllModel" :disabled="filteredTodos.length === 0"/>
            <label class="toggle-all-label" for="toggle-all-input"> Toggle All Input </label>
        </div>
        <ul class="todo-list">
            <TodoItem v-for="(todo, index) in filteredTodos" :key="todo.id" :todo="todo" :index="index"
                @delete-todo="deleteTodo" @edit-todo="editTodo" @toggle-todo="toggleTodo" />
        </ul>
    </main>
    <TodoFooter :todos="todos" @delete-completed="deleteCompleted" />
</template>

<style scoped>
.tag-filter {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
    flex-wrap: wrap;
}

.tag-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    color: #4d4d4d;
    transition: all 0.2s ease;
}

.tag-button:hover {
    border-color: #cfcfcf;
    background: #fafafa;
}

.tag-button.selected {
    border-color: var(--tag-color, #b83f45);
    background: var(--tag-color, #b83f45);
    color: #fff;
}

.tag-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.tag-button.selected .tag-dot {
    background: #fff !important;
}
</style>
