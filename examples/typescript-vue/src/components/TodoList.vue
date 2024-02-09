<template>
  <section class="main" v-show="TodoState.todos.length" v-cloak>
    <input class="toggle-all" type="checkbox" v-model="allDone">
    <ul class="todo-list">
      <TodoItem v-for="todo in filteredTodos" 
        :key='todo.id' 
        :todo='todo'/>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Getter, Mutation, namespace } from "vuex-class";
import { TodoItem } from "@components";

const TodoGetter = namespace("TodoModule", Getter);
const TodoMutation = namespace("TodoModule", Mutation);

@Component({
  components: { TodoItem }
})
export default class TodoList extends Vue {
  @State("TodoModule") TodoState;
  @TodoGetter filteredTodos;
  @TodoGetter remaining;
  @TodoMutation setAll;

  get allDone() {
    return this.remaining === 0;
  }

  set allDone(value) {
    this.setAll(value);
  }
}
</script> 

