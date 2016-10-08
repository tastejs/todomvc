import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TodoStore } from './services/store';
import TodoApp from './app';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [ TodoApp ],
  providers: [ TodoStore ],
  bootstrap: [ TodoApp ]
})
export class AppModule { }
