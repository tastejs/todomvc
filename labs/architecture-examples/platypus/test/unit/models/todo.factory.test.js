/*global describe, it, beforeEach, plat, todoapp, mock, expect*/
(function () {
	'use strict';
    
    describe('Todo Factory Test', function() {
        mock.todoRepository();
        
        var Todos = plat.acquire(todoapp.models.TodoFactoryStatic);
        
        it('getTodos', function() {
            expect(Todos.getTodos()).toEqual([TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE]);
        });
        
        it('setTodos', function() {
            Todos.setTodos([]);
            var todos = [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE];
            todos[0].title = 'foo';
            todos[1].title = 'bar';
            todos[2].title = 'baz';
            expect(Todos.getTodos()).toEqual(todos);
        });
        
        mock.reset();
    });
})();
