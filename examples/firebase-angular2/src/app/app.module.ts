import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoFooterComponent } from './components/todo-footer/todo-footer.component';

import { TodoStoreService } from './services/todo-store.service';

import { TrimPipe } from './pipes/trim.pipe';


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoHeaderComponent,
    TodoFooterComponent,
    TrimPipe,
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [AngularFireDatabase, TodoStoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
