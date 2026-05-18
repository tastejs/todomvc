<script>
export default {
  props: {
    todo: Object
  },
  data() {
    return {
      editing: false,
      editText: this.todo.title
    }
  },
  methods: {
    startEdit() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.editInput.focus();
      });
    },
    commitEdit() {
      this.editing = false;
      this.editText = this.editText.trim();

			if (!this.editText) {
				this.$emit('delete-todo', this.todo);
			} else {
				this.$emit('update-todo', { ...this.todo, title: this.editText });
			}
		},
		cancelEdit() {
			this.editing = false;
			this.editText = this.todo.title;
		},
	},
};
</script>

<template>
  <li :class="[{ completed: todo.completed }, { editing }]">
    <div class="view">
      <input type="checkbox" class="toggle" v-model="todo.completed">
      <label @dblclick="startEdit">{{ todo.title }}</label>
      <button class="destroy" @click.prevent="$emit('delete-todo', todo)"></button>
    </div>
    <input
      v-if="editing"
      ref="editInput"
      type="text"
      class="edit"
      v-model="editText"
      @keyup.enter="commitEdit"
      @keyup.esc="cancelEdit"
      @blur="commitEdit"
    />
  </li>
</template>
