/*global describe, it, beforeEach, plat, todoapp, mock, expect*/
(function () {
	'use strict';
    
    describe('Todo Repository Test', function() {
        mock.$localStorage();
        
        var TodoRepository = plat.acquire(todoapp.repositories.TodoRepository);

        it('getTodos', function() {
            expect(TodoRepository.getTodos('id')).toEqual(STORAGE_ITEM);
        });
        
        it('setTodos', function() {
            TodoRepository.setTodos('id', 'foo');
            
            expect(TodoRepository.getTodos('id')).toEqual(SET_STORAGE_ITEM);
        });
        
        mock.reset();
    });
    
})();
