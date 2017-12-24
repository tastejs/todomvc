import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodoListComponent } from './components/todo-list/todo-list.component';

export let routes = [
    { path: '', component: TodoListComponent, pathMatch: 'full' },
    { path: ':status', component: TodoListComponent }
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}