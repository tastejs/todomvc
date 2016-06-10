/// <reference path='../_all.ts' />

module todos {
	export interface ITodoStorage {
		get (): TodoItem[];
		put(todos: TodoItem[]);
	}
}