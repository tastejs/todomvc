module todoapp.repositories {
    'use strict';

    export class TodoRepository implements ITodoRepository {
        private id = 'todos-platypits';

        /**
         * Injectables can inject other injectables!
         */
        constructor(private storage: plat.storage.ILocalStorage) { }

        getTodos(): Array<models.ITodo> {
            return JSON.parse(this.storage.getItem(this.id) || '[]');
        }

        setTodos(todos: Array<models.ITodo>) {
            this.storage.setItem(this.id, JSON.stringify(todos));
        }
    }

    export interface ITodoRepository {
        /**
         * Returns the todo list from storage.
         */
        getTodos(): Array<models.ITodo>;

        /**
         * Puts a new todo list into storage.
         */
        setTodos(todos: Array<models.ITodo>): void;
    }

    /**
     * Here is how you register an injectable. This injectable is registered as 
     * 'storage' and depends on 'plat.localStorage'. If another component wants to 
     * use this injectable, it simply adds 'storage' to its dependencies array.
     */
    plat.register.injectable('todoRepository', TodoRepository, [plat.storage.LocalStorage]);
}
