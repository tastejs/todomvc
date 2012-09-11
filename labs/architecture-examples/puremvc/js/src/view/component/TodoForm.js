/**
 * @author Mike Britton, Cliff Hall
 *
 * @class TodoForm
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define(
    // CLASS INFO
    {
        name : 'todomvc.view.component.TodoForm',
        constructor : function(event) {
            // data
            this.todos  = [];
            this.stats  = {};
            this.filter = '';
            
            // Fixed DOM elements managed by this view component
            this.todoApp           = document.querySelector( '#todoapp' );
            this.main               = this.todoApp.querySelector( '#main' );
            this.toggleAllCheckbox  = this.todoApp.querySelector( '#toggle-all' );
            this.newTodoField       = this.todoApp.querySelector( '#new-todo' );
            this.todoList           = this.todoApp.querySelector( '#todo-list' );
            this.footer             = this.todoApp.querySelector( '#footer' );
            this.todoCount          = this.todoApp.querySelector( '#todo-count' );
            this.clearButton        = this.todoApp.querySelector( '#clear-completed' );
            this.filters            = this.todoApp.querySelector( '#filters' );
            this.filterAll          = this.filters.querySelector( '#filterAll' );
            this.filterActive       = this.filters.querySelector( '#filterActive' );
            this.filterCompleted    = this.filters.querySelector( '#filterCompleted' );
               
            // Event listeners for fixed UI elements
            this.newTodoField.component = this;
            this.newTodoField.addEventListener( 'keypress', function( event ) {
                if ( event.keyCode === this.component.ENTER_KEY && this.value ) {
                    this.component.dispatchAddTodo( event );
                }
            });
            
            this.clearButton.component = this;
            this.clearButton.addEventListener( 'click', function( event ) {
                this.component.dispatchClearCompleted( event );
            });

               
            this.toggleAllCheckbox.component = this;
            this.toggleAllCheckbox.addEventListener( 'change', function( event ) {
                this.component.dispatchToggleCompleteAll( event.target.checked );
            });
        }
    },
               
    // INSTANCE MEMBERS
    {
            ENTER_KEY : 13,
            
            addEventListener: function ( type, listener, useCapture ){
                this.todoApp.addEventListener( type, listener, useCapture );
            },       
               
            createEvent: function( eventName ) {
               return todomvc.view.event.AppEvents.createEvent( eventName );
            },
               
            dispatchEvent: function( event ) {
               todomvc.view.event.AppEvents.dispatchEvent( this.todoApp, event );
            },
            
            dispatchToggleComplete: function( event ) {
                var todo = this.getTodoById( event.target.getAttribute( 'data-todo-id' ) );
                todo.id = event.target.getAttribute( 'data-todo-id' );
                todo.completed = event.target.checked;
                
                var toggleItemCompleteEvent = this.createEvent( todomvc.view.event.AppEvents.TOGGLE_COMPLETE );
                toggleItemCompleteEvent.todo = todo;
                this.dispatchEvent( toggleItemCompleteEvent );                
            },         
               
            dispatchToggleCompleteAll: function(checked) {
                var toggleCompleteAllEvent = this.createEvent( todomvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL );
                toggleCompleteAllEvent.doToggleComplete = checked;
                this.dispatchEvent( toggleCompleteAllEvent );
            },      
               
            dispatchClearCompleted: function() {
                var clearCompleteEvent = this.createEvent( todomvc.view.event.AppEvents.CLEAR_COMPLETED );
                this.dispatchEvent( clearCompleteEvent );
            },   
               
            dispatchDelete: function( id ) {
                var deleteItemEvent= this.createEvent( todomvc.view.event.AppEvents.DELETE_ITEM );
                deleteItemEvent.todoId = id;
                this.dispatchEvent( deleteItemEvent );
            },
               
            dispatchAddTodo: function( event ) {
                var todo = {};
                todo.completed = false;
                todo.title = this.newTodoField.value.trim();
                if (todo.title === '') return;
                var addItemEvent = this.createEvent( todomvc.view.event.AppEvents.ADD_ITEM );                
                addItemEvent.todo = todo;
                this.dispatchEvent( addItemEvent );
            },
               
            dispatchUpdateTodo: function(event) {
                var todo = {};
                todo.id = event.target.id.slice(6);
                todo.title = event.target.value.trim();
                var updateItemEvent = this.createEvent( todomvc.view.event.AppEvents.UPDATE_ITEM );
                updateItemEvent.todo = todo;
                this.dispatchEvent( updateItemEvent );
            },
               
            setFilteredTodoList: function( dataStruct ) {
                // Update instance data
                this.todos  = dataStruct.todos;
                this.stats  = dataStruct.stats;
                this.filter = dataStruct.filter;
                
                // Hide main section if no todos
                this.main.style.display = this.stats.totalTodo ? 'block' : 'none';

                // Create Todo list
                this.todoList.innerHTML = '';
                this.newTodoField.value = '';                                
                var todo, checkbox, label, deleteLink, divDisplay, inputEditTodo, li;
                for ( var i=0; i < this.todos.length; i++ ) {
            
                    todo = this.todos[i];
            
                    // Create checkbox
                    checkbox = document.createElement('input');
                    checkbox.className = 'toggle';
                    checkbox.setAttribute('data-todo-id', todo.id);
                    checkbox.type = 'checkbox';
                    checkbox.component = this;            
                    checkbox.addEventListener('change', function(event) {
                        this.component.dispatchToggleComplete(event);
                    });
            
                    // Create div text
                    label = document.createElement('label');
                    label.setAttribute('data-todo-id', todo.id);
                    label.appendChild(document.createTextNode(todo.title));
            
                    // Create delete button
                    deleteLink = document.createElement('button');
                    deleteLink.className = 'destroy';
                    deleteLink.setAttribute('data-todo-id', todo.id);
                    deleteLink.component = this;
                    deleteLink.addEventListener('click', function(event) {
                        this.component.dispatchDelete(event.target.getAttribute('data-todo-id'));
                    });
            
                    // Create divDisplay
                    divDisplay = document.createElement('div');
                    divDisplay.className = 'view';
                    divDisplay.setAttribute('data-todo-id', todo.id);
                    divDisplay.appendChild(checkbox);
                    divDisplay.appendChild(label);
                    divDisplay.appendChild(deleteLink);
                    divDisplay.addEventListener('dblclick', function() {
                        var todoId = this.getAttribute('data-todo-id');
                        var div = document.getElementById('li_' + todoId);
                        var inputEditTodo = document.getElementById('input_' + todoId);
                        div.className = 'editing';
                        inputEditTodo.focus();
                        
                    });
            
                    // Create todo input
                    inputEditTodo = document.createElement('input');
                    inputEditTodo.id = 'input_' + todo.id;
                    inputEditTodo.className = 'edit';
                    inputEditTodo.value = todo.title;
                    inputEditTodo.component = this;            
                    inputEditTodo.addEventListener('keypress', function( event ) {
                        if (event.keyCode === this.component.ENTER_KEY) {
                            this.component.dispatchUpdateTodo( event );
                        }
                    });            
                    inputEditTodo.addEventListener('blur', function(event) {
                        this.component.dispatchUpdateTodo(event);
                    });
                    
                    // Create Todo ListItem and add to list
                    li = document.createElement('li');
                    li.id = 'li_' + todo.id;
                    li.appendChild( divDisplay );
                    li.appendChild( inputEditTodo );            
                    if ( todo.completed ) {
                        li.className += 'complete';
                        checkbox.checked = true;
                    }            
                    this.todoList.appendChild(li);
                } 
                
                // Update Stats UI
                this.footer.style.display = this.stats.totalTodo ? 'block' : 'none';
                this.updateClearButton();
                this.updateTodoCount();
                this.updateFilter();
                
            },
               
            getTodoById: function( id ) {
                for ( i = 0; i < this.todos.length; i++) {
                    if (this.todos[i].id === id) {
                        return this.todos[i];
                    }
                }                
            },
               
            updateFilter: function() {
                this.filterAll.className        = ( this.filter === todomvc.AppConstants.FILTER_ALL ) ? 'selected' : '';
                this.filterActive.className     = ( this.filter === todomvc.AppConstants.FILTER_ACTIVE ) ? 'selected' : '';
                this.filterCompleted.className  = ( this.filter === todomvc.AppConstants.FILTER_COMPLETED ) ? 'selected' : '';
            
            },
               
            updateClearButton: function() {
                this.clearButton.style.display = ( this.stats.todoCompleted === 0 ) ? 'none' : 'block';
                this.clearButton.innerHTML = 'Clear completed (' + this.stats.todoCompleted + ')';
            },
               
            updateTodoCount: function() {
                var number = document.createElement('strong');
                var text = ' ' + (this.stats.todoLeft === 1 ? 'item' : 'items' ) + ' left';            
                number.innerHTML = this.stats.todoLeft;
                this.todoCount.innerHTML = null;
                this.todoCount.appendChild(number);
                this.todoCount.appendChild(document.createTextNode(text));
            }
    },
               
    // STATIC MEMBERS   
    {
        NAME: 'TodoForm',
    }
);
