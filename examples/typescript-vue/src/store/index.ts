import Vuex from 'vuex';
import Vue from 'vue';

import { ITodosState } from '@types';
import { TodoModule } from './TodoStore';

Vue.use(Vuex);

export interface RootState {
  LoginModule: ITodosState,
}

export const store = new Vuex.Store({
  modules: { 
    TodoModule
  }
})