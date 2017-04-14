module todoapp.models {
    'use strict';

    export class TodoFactory {
        static createTodo(title: string, completed: boolean, id?: string): ITodo {
            return {
                id: id || TodoFactory._utils.uniqueId('todo_'),
                title: title,
                completed: !!completed
            };
        }

        static getTodos() {
            var storedTodos = TodoFactory._todoRepository.getTodos();
            var length = storedTodos.length;
            var todos = [];
            var todo: ITodo;
            var create = TodoFactory.createTodo;

            for (var i = 0; i < length; ++i) {
                todo = storedTodos[i];
                todos.push(create(todo.title, todo.completed, todo.id));
            }

            return todos;
        }

        static setTodos(todos: Array<ITodo>) {
            TodoFactory._todoRepository.setTodos(todos);
        }

        private static _utils: plat.IUtils;
        private static _todoRepository: repositories.ITodoRepository;
    }

    /**
     * An ITodo defines the interface for a todo item.
     */
    export interface ITodo {
        /**
         * A unique id for a todo.
         */
        id: string;
        /**
         * The title of the todo.
         */
        title: string;
        /**
         * Whether or not the todo is completed.
         */
        completed: boolean;
    }

    export interface ITodoFactory {
        /**
         * Returns an ITodo with the given title and completed values.
         *
         * @param title The title of the todo.
         * @param completed Whether or not the todo is completed.
         */
        createTodo(title: string, completed: boolean): ITodo;

        /**
         * Returns the todos in use for the app.
         */
        getTodos(): Array<ITodo>;

        /**
         * Sets the todos for the app.
         *
         * @param todos The todos to set.
         */
        setTodos(todos: Array<ITodo>): void;
    }

    /**
     * This is the static constructor for the TodoFactory. TodoFactory is a 
     * static class, yet it has dependencies. We allow you to register injectables 
     * as "static" and specify a static constructor which will return the class.
     */
    export function TodoFactoryStatic(_todoRepository, _utils) {
        (<any>TodoFactory)._todoRepository = _todoRepository;
        (<any>TodoFactory)._utils = _utils;
        return TodoFactory;
    }

    /**
     * Injectables can be of type static. Here you see that the TodoFactoryStatic 
     * constructor is referenced. All STATIC injectables will be injected when the 
     * app starts, and used throughout the application lifetime.
     */
    plat.register.injectable('todoFactory', TodoFactoryStatic, [
        repositories.TodoRepository,
        plat.Utils
    ], plat.register.injectableType.STATIC);
}
