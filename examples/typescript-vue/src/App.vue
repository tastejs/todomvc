<template>
  <div id='app'>
    <section class="todoapp">
      <Header/>
      <TodoList />
      <Footer/>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Written by <a href="https://github.com/victorgarciaesgi">Victor Garcia</a></p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { store } from "@store";
import { Header, TodoList, Footer } from "@components";
import { State, Getter, Mutation, Action, namespace } from "vuex-class";

const TodoAction = namespace("TodoModule", Action);

@Component({
  components: {
    Header,
    TodoList,
    Footer
  },
  store
})
export default class App extends Vue {
  @TodoAction changeVisibility;

  mounted() {
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
  }

  onHashChange() {
    let visibility = window.location.hash.replace(/#\/?/, "");
    this.changeVisibility(visibility);
  }
}
</script>
