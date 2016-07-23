import {bootstrap} from 'angular2/platform/browser';
import TodoApp from './app'
import {TodoStore} from './services/store';

bootstrap(TodoApp, [TodoStore]);
