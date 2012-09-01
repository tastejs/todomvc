/**
 * @author Mike Britton
 *
 * @class TodoForm
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 *
 */

puremvc.define(
    // CLASS INFO
    {
        name : 'todomvc.view.component.TodoForm',
        constructor : function(event) {
            this.todos = [];
            this.stat = {};
            this.todoForm = document.querySelector('#todoapp');
            this.toggleAllCheckbox = this.todoForm.querySelector('#toggle-all');
            this.newTodoField = this.todoForm.querySelector('#new-todo');
    
            this.newTodoField.addEventListener('keypress', this, false);
            this.toggleAllCheckbox.addEventListener('change', this, false);
        }
    },
    // INSTANCE MEMBERS
    {
            ENTER_KEY : 13,
               
            // EVENT HANDLING
            addEventListener: function ( type, listener, useCapture )
            {
                // delegate to #todoForm
                this.todoForm.addEventListener( type, listener, useCapture );
            },            
            handleEvent: function(event) {
                switch(event.type) {
                    // Text input field for new todo
                    case 'keypress':
                        if (event.keyCode === this.ENTER_KEY && this.newTodoField.value) {
                            this.dispatchAddTodo(event);
                        }
                        break;
                    // Toggle All Complete checkbox
                    case 'change':
                        // ?? domEvent.preventDefault();
                        this.dispatchToggleCompleteAll(event.target.checked);
                        break;
                    // Delete checkbox
                    case 'click':
                        if (!event.target.type == 'submit') {
                            this.dispatchDelete(event.target.getAttribute('data-todo-id'));
                        } else {
                            this.dispatchClearCompleted();    
                        }                        
                        break;
                    // Individual todo items
                    case 'dblclick':
                        var todoId = this.getAttribute('data-todo-id');
                        var div = document.getElementById('li_' + todoId);
                        var inputEditTodo = document.getElementById('input_' + todoId);
                        div.className = 'editing';
                        inputEditTodo.focus();                        
                        break;
                    // Individual todo items
                    case 'blur':
                        this.dispatchUpdateTodo(event);
                        break;
                    default:
                        alert('TodoForm\'s event handler received an unsupported event.');
                        break;
                    
                }
            },
            dispatchToggleComplete: function(event) {
                var todo = this.getTodoById(event.target.getAttribute('data-todo-id'));
                todo.id = event.target.getAttribute('data-todo-id')
                todo.completed = event.target.checked;
                
                var toggleItemCompleteEvent = document.createEvent( 'Events' ); // TODO: createEventObject for IE??
                toggleItemCompleteEvent.initEvent(this.constructor.TOGGLE_COMPLETE, false, false);
                toggleItemCompleteEvent.todo = todo;
                
                this.todoForm.dispatchEvent( toggleItemCompleteEvent );                
            },            
            dispatchToggleCompleteAll: function(checked) {
                var toggleCompleteAllEvent = document.createEvent( 'Events' ); // TODO: createEventObject for IE??
                toggleCompleteAllEvent.initEvent(this.constructor.TOGGLE_COMPLETE_ALL, false, false);
                toggleCompleteAllEvent.doToggleComplete = checked;
                
                this.todoForm.dispatchEvent( toggleCompleteAllEvent );
            },        
            dispatchClearCompleted: function() {
                var clearCompleteEvent = document.createEvent( 'Events' ); // TODO: createEventObject for IE??
                clearCompleteEvent.initEvent(this.constructor.CLEAR_COMPLETED, false, false);
                
                this.todoForm.dispatchEvent( clearCompleteEvent );
            },        
            dispatchDelete: function(id) {
                var deleteItemEvent= document.createEvent( 'Events' ); // TODO: createEventObject for IE??
                deleteItemEvent.todoid = id;
                deleteItemEvent.initEvent(this.constructor.DELETE_ITEM, false, false);
                
                this.todoForm.dispatchEvent( deleteItemEvent );
            },
            dispatchAddTodo: function(event) {
                var val = this.newTodoField.value;
                var addItemEvent = document.createEvent( 'Events' );
                addItemEvent.initEvent(this.constructor.ADD_ITEM, false, false);
                
                var todo = {};
                todo.completed = false;
                todo.title = val;
                addItemEvent.todo = todo;
                
                this.todoForm.dispatchEvent( addItemEvent );
            },
            dispatchUpdateTodo: function(event) {
                var todo = {};
                todo.id = event.target.id.slice(6);
                todo.title = event.target.value.trim();
                
                // use W3C compliant synthetic events dispatch api (SORRY, NO IE SUPPORT)
                var updateItemEvent = document.createEvent( 'Events' ); // createEventObject for IE??
                updateItemEvent.initEvent(this.constructor.UPDATE_ITEM, false, false);
                updateItemEvent.todo = todo;
                
                this.todoForm.dispatchEvent( updateItemEvent );
            },
            // UTILITY FUNCTIONS  
            redraw: function( dataStruct ) {
                var todo, checkbox, label, deleteLink, divDisplay, inputEditTodo, li;
                var ul = document.getElementById('todo-list');
                
                this.todos = dataStruct.todos;
                this.stat = dataStruct.stat;
                
                document.getElementById('main').style.display = this.todos.length ? 'block' : 'none';

                ul.innerHTML = '';
                document.getElementById('new-todo').value = '';                
                
                for (var i=0; i < this.todos.length; i++) {
            
                    todo = this.todos[i];
            
                    // Create checkbox
                    checkbox = document.createElement('input');
                    checkbox.className = 'toggle';
                    checkbox.setAttribute('data-todo-id', todo.id);
                    checkbox.type = 'checkbox';
                    // Associate with ContentMediator for scope
                    checkbox.mediator = this;
            
                    checkbox.addEventListener('change', function(event) {
                        this.mediator.dispatchToggleComplete(event);
                    });
            
                    // Create div text
                    label = document.createElement('label');
                    label.setAttribute('data-todo-id', todo.id);
                    label.appendChild(document.createTextNode(todo.title));
            
                    // Create delete button
                    deleteLink = document.createElement('button');
                    deleteLink.className = 'destroy';
                    deleteLink.setAttribute('data-todo-id', todo.id);
                    deleteLink.mediator = this;
            
                    deleteLink.addEventListener('click', function(event) {
                        this.mediator.dispatchDelete(event.target.getAttribute('data-todo-id'));
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
                    inputEditTodo.mediator = this;
            
                    inputEditTodo.addEventListener('keypress', function(event) {
                        if (event.keyCode === this.ENTER_KEY) {
                            this.mediator.dispatchUpdateTodo(event);
                        }
                    });
            
                    inputEditTodo.addEventListener('blur', this);
            
                    li = document.createElement('li');
                    li.id = 'li_' + todo.id;
                    li.appendChild(divDisplay);
                    li.appendChild(inputEditTodo);
            
                    if (todo.completed) {
                        li.className += 'complete';
                        checkbox.checked = true;
                    }
            
                    ul.appendChild(li);
                } 
                
                // Stats UI
                this.removeChildren(document.getElementsByTagName('footer')[0]);
            
                document.getElementById('footer').style.display = this.todos.length ? 'block' : 'none';
            
                if (this.stat.todoCompleted) {
                    this.drawTodoClear();
                }
            
                if (this.stat.todoLeft) {
                    this.drawTodoCount();
                }                               
                
            },
            getTodoById: function( id ) {
                for ( i = 0; i < this.todos.length; i++) {
                    if (this.todos[i].id === id) {
                        return this.todos[i];
                    }
                }                
            },
            drawTodoClear: function() {
                var buttonClear = document.createElement('button');
            
                buttonClear.id = 'clear-completed';
                buttonClear.mediator = this;
                buttonClear.addEventListener('click', this);
                buttonClear.innerHTML = 'Clear completed (' + this.stat.todoCompleted + ')';
            
                document.getElementsByTagName('footer')[0].appendChild(buttonClear);
            },
            drawTodoCount: function() {
                var number = document.createElement('strong');
                var remaining = document.createElement('span');
                var text = ' ' + (this.stat.todoLeft === 1 ? 'item' : 'items' ) + ' left';
            
                // Create remaining count
                number.innerHTML = this.stat.todoLeft;
            
                remaining.id = 'todo-count';
                remaining.appendChild(number);
                remaining.appendChild(document.createTextNode(text));
            
                document.getElementsByTagName('footer')[0].appendChild(remaining);
            },
            removeChildren: function(node) {
                node.innerHTML = '';
            }                        
                   
    },
    // STATIC MEMBERS   
    {
        /**
         * @static
         * @type {string}
         */
        NAME: 'TodoForm',
        TOGGLE_COMPLETE_ALL: 'toggle_complete_all',
        TOGGLE_COMPLETE: 'toggle_complete',
        CLEAR_COMPLETED: 'clear_completed',
        DELETE_ITEM: 'delete_item',
        UPDATE_ITEM: 'update_item',
        ADD_ITEM: 'add_item',
    });
