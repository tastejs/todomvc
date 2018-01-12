import { Store, GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { ITodosState, ITodo } from '@types';
import { RootState } from './index';

export const state: ITodosState = {
  todos: [],
  visibility: 'all',
  count: 0
}

export const getters: GetterTree<ITodosState, RootState> = {
  all(state) {
    return state.todos;
  },
  active(state) {
    return state.todos.filter(todo => !todo.completed);
  },
  completed(state) {
    return state.todos.filter(todo => todo.completed);
  },
  remaining(state, getters) {
    return getters.active.length;
  },
  filteredTodos(state, getters) {
    return getters[state.visibility];
  },
}

export const mutations: MutationTree<ITodosState> = {
  addTodo(state, todo: ITodo) {
    state.todos.push(todo);
    state.count++;
  },
  setVisibility(state, payload: ITodosState["visibility"]) {
    state.visibility = payload;
  },
  removeCompleted(state, { getters }) {
    state.todos = state.todos.filter(todo => !todo.completed);
  },
  setAll(state, payload: boolean) {
    state.todos.map(item => {
      item.completed = payload;
    });
  },
  removeTodo(state, todo: ITodo) {
    state.todos.splice(state.todos.indexOf(todo), 1)
  },
  editTodoMutation(state, todo: ITodo) {
    todo = state.todos.find(item => todo.id == item.id);
    todo.title = todo.title.trim();
  }
}

export const actions: ActionTree<ITodosState, RootState> = {
  addTodoAction({ state, commit }, todoTitle: string) {
    let todo: ITodo = {
      completed: false,
      id: state.count,
      title: todoTitle
    };
    commit('addTodo', todo);
  },

  editTodoAction({ state, commit }, todo: ITodo) {
    commit('editTodoMutation', todo);
    if (!todo.title) {
      commit('removeTodo', todo);
    }
  },
  changeVisibility({state, commit, getters}, payload: ITodosState["visibility"]) {
    if (getters[payload]) {
      commit('setVisibility', payload);
    } else {
      window.location.hash = ''
      commit('setVisibility', 'all');
    }
  }
}

export const TodoModule: Module<ITodosState, RootState> = {
  state, getters, mutations, actions, namespaced: true
}


