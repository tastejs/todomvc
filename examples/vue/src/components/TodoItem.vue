<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps(['todo']);
const emit = defineEmits(['delete-todo', 'edit-todo', 'toggle-todo']);

const editing = ref(false);
const editInput = ref(null);
const draft = ref('');

function onToggle(event) {
    emit('toggle-todo', props.todo, event.target.checked);
}

function startEdit() {
    draft.value = props.todo.title;
    editing.value = true;
    nextTick(() => editInput.value?.focus());
}

function commitEdit() {
    if (!editing.value) return;
    editing.value = false;
    const text = draft.value.trim();
    if (text.length === 0) emit('delete-todo', props.todo);
    else emit('edit-todo', props.todo, text);
}

function cancelEdit() {
    editing.value = false;
    draft.value = props.todo.title;
}

function deleteTodo() {
    emit('delete-todo', props.todo);
}
</script>

<template>
    <li :class="{ completed: todo.completed, editing }">
        <div class="view">
            <input type="checkbox" class="toggle" :checked="todo.completed" @change="onToggle" />
            <label @dblclick="startEdit">{{ todo.title }}</label>
            <button class="destroy" @click.prevent="deleteTodo"></button>
        </div>
        <input
            v-if="editing"
            ref="editInput"
            type="text"
            class="edit"
            aria-label="Edit todo"
            v-model="draft"
            @keyup.enter="commitEdit"
            @keyup.escape="cancelEdit"
            @blur="commitEdit"
        />
    </li>
</template>
