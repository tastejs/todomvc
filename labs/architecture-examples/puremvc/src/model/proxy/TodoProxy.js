/**
 * @author Mike Britton
 *
 * @class TodoProxy
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 *
 */
puremvc.define
(
    // CLASS INFO
    {
        name : 'todomvc.model.proxy.TodoProxy',
        parent : puremvc.Proxy
    },
    
    // INSTANCE MEMBERS    
    {
        todos : [],
        stat : {},
        LOCAL_STORAGE:'TodoMVC-PureMVC', 
 
        onRegister:function() {
            localStorage.clear();
        },
        
        computeStats : function() {
            this.stat.totalTodo = this.todos.length;
            this.stat.todoCompleted = this.getCompleted();
            this.stat.todoLeft = this.stat.totalTodo - this.stat.todoCompleted;
        },
        
        saveTodos: function() {
            localStorage.setItem(this.LOCAL_STORAGE, JSON.stringify(this.todos));
        },
        
        loadTodos: function() {
            if (!localStorage.getItem(this.LOCAL_STORAGE)) {
                localStorage.setItem(this.LOCAL_STORAGE, JSON.stringify([]));
            }
            this.todos = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE));
            this.sendNotification(todomvc.AppConstants.TODOS_RETURNED, {todos:this.todos,stat:this.stat});                
        },
        
        removeTodosCompleted: function() {
            var i = this.todos.length;

            while (i--) {
                if (this.todos[i].completed) {
                    this.todos.splice(i, 1);
                }
            }
        }, 
        
        deleteTodo: function(id) {
            var i = this.todos.length;

            while (i--) {
                if (this.todos[i].id === id) {
                    this.todos.splice(i, 1);
                }
            }
        },
        
        toggleCompleteStatus: function(status) {
            for (var i = 0; i < this.todos.length; i++) {
                this.todos[i].completed = status;
            }
        },
        
        updateTodo: function(todo) {
            for (var i = 0; i < this.todos.length; i++) {
                if (this.todos[i].id === todo.id) {
                    this.todos[i].title = todo.title;
                    this.todos[i].completed = todo.completed;
                }
            }
        },
        
        addTodo: function(todoarg) {
            todoarg.id = this.getUuid();
            this.todos.push(todoarg);
        },
        
        getCompleted: function() {
            var completed = 0;
            
            for (var i = 0; i < this.todos.length; i++) {
                if (this.todos[i].completed) {
                    completed++;
                }
            }
            return completed;
        },
        
        getUuid: function() {
            var i, random, uuid = '';
        
            for ( i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random) ).toString(16);
            }
            return uuid;
        }                                                                                                   
    },
 
    // CLASS MEMBERS
    {
        /**
         * @static
         * @type {string}
         */        
        NAME: 'TodoProxy'
    }    
);
