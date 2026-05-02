import { Injectable } from '@angular/core';

export interface Todo {
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
    todos: Todo[] = [];

    addItem(title: string): void {
      const todo: Todo = {
        title,
        completed: false,
      };
      this.todos.push(todo);
    }

    removeItem(todo: Todo): void {
      const index = this.todos.indexOf(todo);
      this.todos.splice(index, 1);
    }

    clearCompleted(): void {
      this.todos = this.todos.filter((todo) => !todo.completed);
    }

    toggleAll(completed: boolean): void {
      // Mutate in place so the rendered <li> elements aren't replaced.
      // Replacing the array with new todo objects would force Angular to
      // recreate every <app-todo-item>, which detaches DOM nodes that
      // tests (or external observers) may already hold references to.
      for (const todo of this.todos) {
        todo.completed = completed;
      }
    }

    getItems(type = 'all'): Todo[] {
      switch (type) {
        case 'active':
          return this.todos.filter((todo) => !todo.completed);
        case 'completed':
          return this.todos.filter((todo) => todo.completed);
      }

      return this.todos;
    }
}
