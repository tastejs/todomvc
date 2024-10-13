<template>
   <header class="header">
      <h1>todos</h1>
      <input class="new-todo"
        autofocus autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="add">
    </header>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State, Mutation, Action, namespace } from "vuex-class";
import { ITodosState } from "@types";

const TodoAction = namespace("TodoModule", Action);

@Component({})
export default class Header extends Vue {
  @TodoAction addTodoAction;
  public newTodo: string = "";

  add() {
    if (this.newTodo.length) {
      this.addTodoAction(this.newTodo.trim());
      this.newTodo = "";
    }
  }
}
</script> 
