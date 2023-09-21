import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { Todo } from "../todo";
import { TodosService } from "../todos.service";

@Component({
    selector: "app-todo-footer",
    templateUrl: "./todo-footer.component.html",
})
export class TodoFooterComponent {
    constructor(private todosService: TodosService, private location: Location) {}

    get todos(): Todo[] {
        return this.todosService.getItems();
    }

    get activeTodos(): Todo[] {
        return this.todosService.getItems("active");
    }

    get completedTodos(): Todo[] {
        return this.todosService.getItems("completed");
    }

    get filter(): string {
        return this.location.path().split("/")[1] || "all";
    }

    clearCompleted() {
        this.todosService.clearCompleted();
    }
}
