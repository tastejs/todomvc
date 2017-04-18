import { Component, Inject } from 'angular2/core';
import { TodoActions } from './todoActions';
import { StatusFilterPipe } from './statusFilterPipe';

@Component({
    selector: 'todo-app',
    templateUrl: 'app.html',
    pipes: [StatusFilterPipe]
})
export class App {
    todos: any[];
    currentFilter: string;
    newTodoText: string;
    unsubscribe: any;

    constructor(
        @Inject('AppStore') private appStore: AppStore,
        private todoActions: TodoActions
    ) {
        this.todos = [];
        this.currentFilter = 'SHOW_ALL';
        this.newTodoText = '';

        this.unsubscribe = this.appStore.subscribe(() => {
            let state = this.appStore.getState();
            this.todos = state.todos;
            this.currentFilter = state.currentFilter;
        });
    }

    private add() {
        if (this.newTodoText) {
            this.appStore.dispatch(this.todoActions.add(this.newTodoText));
            this.newTodoText = '';
        }
    }

    private toggleEdit(todo) {
        this.appStore.dispatch(this.todoActions.toggleEdit(todo.id));
    }

    private update(todo, newText) {
        this.appStore.dispatch(this.todoActions.update(todo, newText));
    }

    private remove(todo) {
        this.appStore.dispatch(this.todoActions.remove(todo.id));
    }

    private removeCompleted() {
        this.appStore.dispatch(this.todoActions.removeCompleted());
    }

    private toggleAllStatus(filter) {
        this.appStore.dispatch(this.todoActions.toggleAllStatus(filter));
    }

    private toggleStatus(todo) {
        this.appStore.dispatch(this.todoActions.toggleStatus(todo.id));
    }

    private setFilter(filter) {
        this.appStore.dispatch(this.todoActions.setFilter(filter));
    }

    private isAllCompleted() {
        return this.todos.every(function (todo) {
            return todo.completed;
        });
    }

    private activeCount() {
        return this.todos.filter(function (todo) {
            return !todo.completed;
        }).length;
    }

    private completedCount() {
        return this.todos.filter(function (todo) {
            return todo.completed;
        }).length;
    }
}
