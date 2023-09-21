<template>
    <li
        :class="{
            completed: this.todo.completed,
            editing: this.editing,
        }"
    >
        <div class="item-container">
            <input type="checkbox" class="toggle" v-model="toggleModel" />
            <label @dblclick="startEdit">{{ todo.title }}</label>
            <button class="destroy" @click.prevent="deleteTodo"></button>
        </div>
        <div class="input-container">
            <input id="edit-todo-input" ref="editInputRef" type="text" class="edit" v-model="editModel" @keyup.enter="finishEdit" @blur="cancelEdit" />
            <label class="visually-hidden" for="edit-todo-input">Edit Todo Input</label>
        </div>
    </li>
</template>

<script>
import { nextTick } from "vue";
export default {
    name: "TodoItem",
    props: {
        todo: {
            title: String,
            completed: Boolean,
            id: Number,
        },
        index: Number,
    },
    data() {
        return {
            editText: "",
            editing: false,
        };
    },
    methods: {
        startEdit() {
            this.editing = true;
            nextTick(() => {
                this.focusEditInput();
            });
        },
        finishEdit() {
            this.editing = false;
            // prettier-ignore
            if (this.editText.trim().length === 0)
                this.deleteTodo();
            else
                this.updateTodo();
        },
        cancelEdit() {
            this.editing = false;
        },
        focusEditInput() {
            this.$refs.editInputRef.focus();
        },
        deleteTodo() {
            this.$emit("delete-todo", this.todo);
        },
        updateTodo() {
            this.$emit("edit-todo", this.todo, this.editText);
            this.editText = "";
        },
    },
    computed: {
        toggleModel: {
            get() {
                return this.todo.completed;
            },
            set(value) {
                this.$emit("toggle-todo", this.todo, value);
            },
        },
        editModel: {
            get() {
                return this.todo.title;
            },
            set(value) {
                this.editText = value;
            },
        },
    },
    emits: ["edit-todo", "delete-todo", "toggle-todo"],
};
</script>
