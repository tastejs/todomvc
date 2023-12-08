<script setup>
import { ref, nextTick, computed } from 'vue'

const props = defineProps(['todo', 'index']);
const emit = defineEmits(['delete-todo', 'edit-todo']);

const editing = ref(false);
const editInput = ref(null);
const editText = ref("");

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