import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TodosService } from "../todos.service";

@Component({
    selector: "app-todo-header",
    templateUrl: "./todo-header.component.html",
})
export class TodoHeaderComponent {
    constructor(private todosService: TodosService) {}

    titleFormControl = new FormControl("");

    addTodo() {
        const title = this.titleFormControl.getRawValue()?.trim();

        if (!title)
            return;

        this.todosService.addItem(title);
        this.titleFormControl.setValue("");
    }
}
