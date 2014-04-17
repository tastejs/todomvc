/*global describe, it, beforeEach, plat, todoapp, mock, expect*/
(function () {
	'use strict';   
    
    describe('Todo ViewControl Test', function() {
        mock.viewControl();
        var viewControl, todos;
        
        beforeEach(function() {
            mock.todoFactory();
            mock.state();
            viewControl = plat.acquire(todoapp.viewcontrols.TodoMainVC);
            todos = [
                JSON.parse(JSON.stringify(TODO_ITEM_ONE)),
                JSON.parse(JSON.stringify(TODO_ITEM_TWO)),
                JSON.parse(JSON.stringify(TODO_ITEM_THREE))
            ];
        });
        
        it('context', function() {
            expect(viewControl.context).toEqual({
                completedCount: 0,
                filterBy: 'all',
                allCompleted: false,
                newTodo: '',
                editedTodo: { title: 'not set', completed: false },
                todos: [],
                remainingCount: 0
            });
        });
        
        it('initialize', function() {
            viewControl.initialize();
            
            expect(viewControl.context.todos).toEqual(todos);
        });
        
        it('loaded', function() {
            viewControl.updateStatus = function() {};
            
            spyOn(viewControl, 'updateStatus');
            spyOn(viewControl, 'observeArray');
            
            viewControl.loaded();
            
            expect(viewControl.updateStatus).toHaveBeenCalled();
            expect(viewControl.observeArray).toHaveBeenCalledWith(
                viewControl.context,
                'todos',
                viewControl.updateStatus);
        });
        
        it('navigatedTo', function() {
            spyOn(viewControl, 'filter');
            spyOn(viewControl.utils, 'isNull').and.callThrough();
            
            viewControl.navigatedTo(null);
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith(null);
            expect(viewControl.filter).toHaveBeenCalledWith('all');
            expect(viewControl.filter.calls.count()).toBe(1);
            
            viewControl.navigatedTo({
                parameters: {}
            });
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith({
                parameters: {}
            });
            expect(viewControl.filter).toHaveBeenCalledWith('all');
            expect(viewControl.filter.calls.count()).toBe(2);
            
            viewControl.navigatedTo({
                parameters: {
                    status: 'active'
                }
            });
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith({
                parameters: {
                    status: 'active'
                }
            });
            expect(viewControl.filter).toHaveBeenCalledWith('active');
            expect(viewControl.filter.calls.count()).toBe(3);
        });
        
        it('updateStatus', function() {
            viewControl.context.todos = todos;
            
            spyOn(viewControl, 'storeTodos');
            spyOn(viewControl.utils, 'forEach').and.callThrough();
            
            viewControl.updateStatus();
            
            expect(viewControl.context.completedCount).toBe(0);
            expect(viewControl.context.remainingCount).toBe(3);
            expect(viewControl.context.allCompleted).toBe(false);
            expect(viewControl.storeTodos.calls.count()).toBe(1);
            expect(viewControl.utils.forEach.calls.mostRecent().args[0]).toEqual(todos);
            
            todos[0].completed = true;
            
            viewControl.updateStatus();
            
            expect(viewControl.context.completedCount).toBe(1);
            expect(viewControl.context.remainingCount).toBe(2);
            expect(viewControl.context.allCompleted).toBe(false);
            expect(viewControl.storeTodos.calls.count()).toBe(2);
            expect(viewControl.utils.forEach.calls.mostRecent().args[0]).toEqual(todos);
            
            todos[1].completed = true;
            
            viewControl.updateStatus();
            
            expect(viewControl.context.completedCount).toBe(2);
            expect(viewControl.context.remainingCount).toBe(1);
            expect(viewControl.context.allCompleted).toBe(false);
            expect(viewControl.storeTodos.calls.count()).toBe(3);
            expect(viewControl.utils.forEach.calls.mostRecent().args[0]).toEqual(todos);
            
            todos[2].completed = true;
            
            viewControl.updateStatus();
            
            expect(viewControl.context.completedCount).toBe(3);
            expect(viewControl.context.remainingCount).toBe(0);
            expect(viewControl.context.allCompleted).toBe(true);
            expect(viewControl.storeTodos.calls.count()).toBe(4);
            expect(viewControl.utils.forEach.calls.mostRecent().args[0]).toEqual(todos);
        });
        
        it('removeTodo', function() {
            todos[1].completed = true;
            
            viewControl.context.todos = todos;
            
            viewControl.removeTodo(1);
            
            expect(todos.length).toBe(2);
            expect(todos[1].completed).toBe(false);
        });
        
        it('storeTodos', function() {
            viewControl.context.todos = todos;
            spyOn(viewControl.todoFactory, 'setTodos');
            
            viewControl.storeTodos();
            
            expect(viewControl.todoFactory.setTodos).toHaveBeenCalledWith(todos);
        });
        
        it('addTodo', function() {
            viewControl.context.todos = todos;
            viewControl.context.newTodo = null;
            
            spyOn(viewControl.utils, 'isEmpty').and.callThrough();
            spyOn(viewControl.utils, 'isNull').and.callThrough();
            spyOn(viewControl.todoFactory, 'createTodo').and.callThrough();
            
            viewControl.addTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith(null);
            expect(viewControl.utils.isEmpty).not.toHaveBeenCalled();
            expect(viewControl.context.todos.length).toBe(3);
            expect(viewControl.todoFactory.createTodo).not.toHaveBeenCalled();
            expect(viewControl.context.newTodo).toBeNull();
            
            viewControl.context.newTodo = '';
            
            viewControl.addTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith('');
            expect(viewControl.utils.isEmpty).toHaveBeenCalledWith('');
            expect(viewControl.context.todos.length).toBe(3);
            expect(viewControl.todoFactory.createTodo).not.toHaveBeenCalled();
            expect(viewControl.context.newTodo).toBe('');
            
            viewControl.context.newTodo = 'New Todo';
            
            viewControl.addTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith('New Todo');
            expect(viewControl.utils.isEmpty).toHaveBeenCalledWith('New Todo');
            expect(viewControl.context.todos.length).toBe(4);
            expect(viewControl.todoFactory.createTodo).toHaveBeenCalledWith('New Todo', false);
            expect(viewControl.context.newTodo).toBe('');
            expect(viewControl.context.todos[3].title).toBe('New Todo');
            
            viewControl.context.newTodo = '   Trimmed Todo   ';
            
            viewControl.addTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith('   Trimmed Todo   ');
            expect(viewControl.utils.isEmpty).toHaveBeenCalledWith('Trimmed Todo');
            expect(viewControl.context.todos.length).toBe(5);
            expect(viewControl.todoFactory.createTodo).toHaveBeenCalledWith('Trimmed Todo', false);
            expect(viewControl.context.newTodo).toBe('');
            expect(viewControl.context.todos[4].title).toBe('Trimmed Todo');
        });
        
        it('toggleAll', function() {
            spyOn(viewControl.utils, 'forEach').and.callThrough();
            spyOn(viewControl, 'updateStatus');
            spyOn(viewControl, 'storeTodos');
            
            viewControl.context.todos = todos;
            
            viewControl.toggleAll();
            
            expect(viewControl.updateStatus).toHaveBeenCalled();
            expect(viewControl.storeTodos).toHaveBeenCalled();
            expect(viewControl.utils.forEach.calls.mostRecent().args[0]).toEqual(todos);
            expect(todos[0].completed).toBe(true);
            expect(todos[1].completed).toBe(true);
            expect(todos[2].completed).toBe(true);
            
            viewControl.context.allCompleted = true;
            
            viewControl.toggleAll();
            
            expect(viewControl.updateStatus).toHaveBeenCalled();
            expect(viewControl.storeTodos).toHaveBeenCalled();
            expect(viewControl.utils.forEach.calls.mostRecent().args[0]).toEqual(todos);
            expect(todos[0].completed).toBe(false);
            expect(todos[1].completed).toBe(false);
            expect(todos[2].completed).toBe(false);
        });
        
        it('filter', function() {
            spyOn(viewControl.state, 'setState');
            
            viewControl.filter('state');
            
            expect(viewControl.context.filterBy).toBe('state');
            expect(viewControl.state.setState).toHaveBeenCalledWith('state');
        });
        
        it('editTodo', function() {
            spyOn(viewControl.utils, 'deepExtend');
            var todo = { 
                id: '1', 
                title: 'New Todo',
                completed: false
            };
            
            viewControl.editTodo(todo);
            
            expect(viewControl.utils.deepExtend).toHaveBeenCalledWith({
                id: '-1',
                title: '',
                completed: false
            }, todo);
            expect(viewControl.context.editedTodo).toEqual(todo);
        });
        
        it('commitTodo', function() {
            spyOn(viewControl.utils, 'isNull').and.callThrough();
            spyOn(viewControl.utils, 'isEmpty').and.callThrough();
            spyOn(viewControl, 'removeTodo');
            spyOn(viewControl, 'storeTodos');
            
            viewControl.context.todos = todos;
            
            todos[1].title = '   Edited title   ';
            
            viewControl.context.editedTodo = todos[1];
            
            viewControl.commitTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith(todos[1]);
            expect(viewControl.utils.isEmpty).toHaveBeenCalledWith('   Edited title   ');
            expect(viewControl.context.editedTodo).toBeNull();
            expect(viewControl.removeTodo).not.toHaveBeenCalled();
            expect(viewControl.storeTodos).toHaveBeenCalled();
            
            viewControl.commitTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith(null);
            expect(viewControl.utils.isEmpty.calls.count()).toBe(1);
            expect(viewControl.context.editedTodo).toBeNull();
            expect(viewControl.removeTodo).not.toHaveBeenCalled();
            expect(viewControl.storeTodos.calls.count()).toBe(1);
            
            todos[1].title = '';
            
            viewControl.context.editedTodo = todos[1];
            
            viewControl.commitTodo();
            
            expect(viewControl.utils.isNull).toHaveBeenCalledWith(todos[1]);
            expect(viewControl.utils.isEmpty).toHaveBeenCalledWith('');
            expect(viewControl.context.editedTodo).toBeNull();
            expect(viewControl.removeTodo).toHaveBeenCalled();
            expect(viewControl.storeTodos.calls.count()).toBe(2);
        });
        
        it('revert', function() {
            viewControl.context.todos = todos;
            
            var editedTodo = todos[0];
            
            viewControl.context.editedTodo = editedTodo;
            
            viewControl.revert(editedTodo);
            
            expect(viewControl.context.editedTodo).toBeNull();
            expect(viewControl.context.todos[0]).toEqual({ 
                id: '-1', 
                title: '', 
                completed: false 
            });
        });
        
        it('clearCompletedTodos', function() {
            spyOn(viewControl, 'updateStatus');
            spyOn(viewControl.utils, 'where').and.callThrough();
            
            viewControl.context.todos = todos;
            
            viewControl.clearCompletedTodos();
            
            expect(viewControl.updateStatus.calls.count()).toBe(1);
            expect(viewControl.utils.where).toHaveBeenCalledWith(todos, { completed: false });
            expect(viewControl.context.todos).toEqual(todos);
            
            viewControl.context.todos = todos;
            
            todos[0].completed = true;
            todos[1].completed = true;
            todos[2].completed = true;
            
            viewControl.clearCompletedTodos();
            
            expect(viewControl.updateStatus.calls.count()).toBe(2);
            expect(viewControl.utils.where).toHaveBeenCalledWith(todos, { completed: false });
            expect(viewControl.context.todos.length).toBe(0);
        });
        
        mock.reset();
    });
})();
