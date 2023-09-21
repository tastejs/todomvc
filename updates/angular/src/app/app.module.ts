import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TodoHeaderComponent } from "./todo-header/todo-header.component";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoFooterComponent } from "./todo-footer/todo-footer.component";
import { TodoItemComponent } from "./todo-item/todo-item.component";

@NgModule({
    declarations: [AppComponent, TodoHeaderComponent, TodoListComponent, TodoFooterComponent, TodoItemComponent],
    imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
