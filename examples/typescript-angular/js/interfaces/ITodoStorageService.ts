/// <reference path='../_all.ts' />

namespace todos {

    export interface ITodoStorageService {
        get(): TodoItem[];
        put(todos: TodoItem[]): void;
    }

}
