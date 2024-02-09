<template>
   <footer class="footer" v-show="TodoState.todos.length" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
      </span>
      <ul class="filters">
        <li><a href="#/all" :class="{ selected: TodoState.visibility == 'all' }">All</a></li>
        <li><a href="#/active" :class="{ selected: TodoState.visibility == 'active' }">Active</a></li>
        <li><a href="#/completed" :class="{ selected: TodoState.visibility == 'completed' }">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="TodoState.todos.length > remaining">
        Clear completed
      </button>
    </footer>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Getter, Mutation, namespace } from "vuex-class";

const TodoGetter = namespace("TodoModule", Getter);
const TodoMutation = namespace("TodoModule", Mutation);

@Component({
  filters: {
    pluralize(n) {
      return n === 1 ? "item" : "items";
    }
  }
})
export default class Footer extends Vue {
  @State("TodoModule") TodoState;
  @TodoGetter remaining;
  @TodoMutation removeCompleted;
}
</script>