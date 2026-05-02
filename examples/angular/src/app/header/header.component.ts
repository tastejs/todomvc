import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../todos.service';

@Component({
  standalone: true,
  selector: 'app-todo-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private todosService = inject(TodosService);

  title = '';

  addTodo() {
    const text = this.title.trim();
    if (text.length === 0) return;
    this.todosService.addItem(text);
    // Reset title to clear input field.
    this.title = '';
  }
}
