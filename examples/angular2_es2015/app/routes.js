import { TodoListComponent } from './components/todo-list/todo-list.component';

export let routes = [
  { path: '', component: TodoListComponent, pathMatch: 'full' },
  { path: ':status', component: TodoListComponent }
];
