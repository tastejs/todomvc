/// <reference path='../_all.ts' />

namespace todos {

    angular
        .module('todomvc')
        .service('todoStorage', [() => new TodoStorageService()]);

    export class TodoStorageService implements ITodoStorageService {

        STORAGE_ID = 'todos-angularjs-typescript';

        get (): TodoItem[] {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        }

        put(todos: TodoItem[]) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        }

    }
}
