/*global plat*/
(function (global) {
	'use strict';
    
    global.TODO_ITEM_ONE = {
        id: '1',
        title: 'buy some cheese',
        completed: false
    };
    global.TODO_ITEM_TWO = {
        id: '1',
        title: 'feed the cat',
        completed: false
    };
    global.TODO_ITEM_THREE = {
        id: '1',
        title: 'book a doctors appointment',
        completed: false
    };
    
    global.STORAGE_ITEM = {
        value: 'test item'
    };
    
    global.SET_STORAGE_ITEM = {
        value: 'set test item'
    };
    
    global.mock = {
        reset: function() {
            plat.register.injectable('$localStorage', plat.storage.LocalStorage);
            plat.register.injectable('stateRepository', todoapp.repositories.StateRepository, [plat.storage.LocalStorage]);
            plat.register.injectable('todoRepository', todoapp.repositories.TodoRepository, [plat.storage.LocalStorage]);
            plat.register.injectable('stateModel', todoapp.models.State, [todoapp.repositories.StateRepository]);
            plat.register.injectable('todoFactory', todoapp.models.TodoFactoryStatic, [
                todoapp.repositories.TodoRepository,
                plat.Utils
            ], plat.register.injectableType.STATIC);
        },
        stateRepository: function() {
            plat.register.injectable('stateRepository', function() {
                return {
                    state: 'test state',
                    getState: function() {
                        return this.state;
                    },
                    setState: function() {
                        this.state = 'set test state';
                    }
                };
            });
        },
        todoRepository: function() {
            plat.register.injectable('todoRepository', function() {
                return {
                    todos: [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE],
                    getTodos: function() {
                        return this.todos;
                    },
                    setTodos: function() {
                        this.todos[0].title = 'foo';
                        this.todos[1].title = 'bar';
                        this.todos[2].title = 'baz';
                    }
                };
            });
        },
        todoFactory: function() {
            plat.register.injectable('todoFactory', function() {
                return {
                    todos: [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE],
                    getTodos: function() {
                        return this.todos;
                    },
                    setTodos: function() {
                        this.todos[0].title = 'foo';
                        this.todos[1].title = 'bar';
                        this.todos[2].title = 'baz';
                    },
                    createTodo: function(title, completed) {
                        return {
                            id: '1',
                            title: title,
                            completed: !!completed
                        };
                    }
                };
            });
        },
        state: function() {
            plat.register.injectable('stateModel', function() {
                return {
                    state: 'test state',
                    getState: function() {
                        return this.state;
                    },
                    setState: function() {
                        this.state = 'set test state';
                    }
                };
            });
        },
        $localStorage: function() {
            plat.register.injectable('$localStorage', function() {
                return {
                    item: JSON.stringify(STORAGE_ITEM),
                    getItem: function() {
                        return this.item;
                    },
                    setItem: function() {
                        this.item = JSON.stringify(SET_STORAGE_ITEM);
                    }
                };
            });
        },
        viewControl: function() {
            plat.register.injectable('main', todoapp.viewcontrols.TodoMainVC, [
                todoapp.models.TodoFactoryStatic,
                todoapp.models.State,
                plat.Utils,
                plat.ControlStatic
            ], plat.register.injectableType.MULTI);
        }
    };
})(window);
