<script setup>
import { ref, nextTick, computed } from 'vue'

const TAG_COLORS = {
    personal: '#2ecc71',
    work: '#3498db',
    urgent: '#e74c3c'
};

const props = defineProps(['todo', 'index']);
const emit = defineEmits(['delete-todo', 'edit-todo']);

const editing = ref(false);
const editInput = ref(null);
const editText = ref("");

const tagColor = computed(() => {
    return TAG_COLORS[props.todo.tag] || TAG_COLORS.personal;
});

const editModel = computed({
    get() {
        return props.todo.title;
    },
    set(value) {
        editText.value = value;
    },
});

const toggleModel = computed({
    get() {
        return props.todo.completed;
    },
    set(value) {
        emit("toggle-todo", props.todo, value);
    },
});

function startEdit() {
    editing.value = true;
    nextTick(() => {
        editInput.value.focus();
    });
}

function finishEdit() {
    editing.value = false;
     if (editText.value.trim().length === 0)
        deleteTodo();
    else
        updateTodo();
}

function cancelEdit() {
    editing.value = false;
}

function deleteTodo() {
    emit("delete-todo", props.todo);
}

function updateTodo() {
    emit("edit-todo", props.todo, editText.value);
    editText.value = "";
}
</script>

<template>
    <li
        :class="{
            completed: todo.completed,
            editing: editing,
        }"
    >
        <div class="view">
            <span class="tag-dot" :style="{ backgroundColor: tagColor }" :title="todo.tag === 'personal' ? '个人' : todo.tag === 'work' ? '工作' : '紧急'"></span>
            <input type="checkbox" class="toggle" v-model="toggleModel" />
            <label @dblclick="startEdit">{{ todo.title }}</label>
            <button class="destroy" @click.prevent="deleteTodo"></button>
        </div>
        <div class="input-container">
            <input id="edit-todo-input" ref="editInput" type="text" class="edit" v-model="editModel" @keyup.enter="finishEdit" @blur="cancelEdit"/>
            <label class="visually-hidden" for="edit-todo-input">Edit Todo Input</label>
        </div>
    </li>
</template>

<style scoped>
.view {
    display: flex;
    align-items: center;
}

.tag-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 8px 0 12px;
    flex-shrink: 0;
    cursor: default;
}

.toggle {
    margin: 0 !important;
}
</style>
