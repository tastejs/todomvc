/**
 * @author Mike Britton, Cliff Hall
 *
 * @class TodoForm
 * @link https://github.com/PureMVC/puremvc-js-demo-todomvc.git
 */
puremvc.define({
		name: 'todomvc.view.component.TodoForm',
		constructor: function(event) {
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
			todomvc.view.event.AppEvents.addEventListener( this.newTodoField, 'keypress', function( event ) {
					if ( event.keyCode === this.component.ENTER_KEY && this.value ) {
						this.component.dispatchAddTodo( event );
					}
			});

			this.clearButton.component = this;
			todomvc.view.event.AppEvents.addEventListener( this.clearButton, 'click', function( event ) {
					this.component.dispatchClearCompleted( event );
			});


			this.toggleAllCheckbox.component = this;
			todomvc.view.event.AppEvents.addEventListener( this.toggleAllCheckbox, 'change', function( event ) {
					this.component.dispatchToggleCompleteAll( event.target.checked );
			});
		}
	},

	// INSTANCE MEMBERS
	{
			ENTER_KEY: 13,

			addEventListener: function ( type, listener, useCapture ){
				todomvc.view.event.AppEvents.addEventListener ( this.todoApp, type, listener, useCapture );
			},

			createEvent: function( eventName ) {
			   return todomvc.view.event.AppEvents.createEvent( eventName );
			},

			dispatchEvent: function( event ) {
			   todomvc.view.event.AppEvents.dispatchEvent( this.todoApp, event );
			},

			dispatchToggleComplete: function( event ) {
			   var todo, toggleItemCompleteEvent;
			   todo = this.getTodoById( event.target.getAttribute( 'data-todo-id' ) );
			   todo.id = event.target.getAttribute( 'data-todo-id' );
			   todo.completed = event.target.checked;
			   toggleItemCompleteEvent = this.createEvent( todomvc.view.event.AppEvents.TOGGLE_COMPLETE );
			   toggleItemCompleteEvent.todo = todo;
			   this.dispatchEvent( toggleItemCompleteEvent );
			},

			dispatchToggleCompleteAll: function( checked ) {
				var toggleCompleteAllEvent = this.createEvent( todomvc.view.event.AppEvents.TOGGLE_COMPLETE_ALL );
				toggleCompleteAllEvent.doToggleComplete = checked;
				this.dispatchEvent( toggleCompleteAllEvent );
			},

			dispatchClearCompleted: function() {
				var clearCompleteEvent = this.createEvent( todomvc.view.event.AppEvents.CLEAR_COMPLETED );
				this.dispatchEvent( clearCompleteEvent );
			},

			dispatchDelete: function( id ) {
				var deleteItemEvent = this.createEvent( todomvc.view.event.AppEvents.DELETE_ITEM );
				deleteItemEvent.todoId = id;
				this.dispatchEvent( deleteItemEvent );
			},

			dispatchAddTodo: function( event ) {
				var addItemEvent, todo = {};
				todo.completed = false;
				todo.title = this.newTodoField.value.trim();
				if ( todo.title === '' ) return;
				addItemEvent = this.createEvent( todomvc.view.event.AppEvents.ADD_ITEM );
				addItemEvent.todo = todo;
				this.dispatchEvent( addItemEvent );
			},

			dispatchUpdateTodo: function(event) {
				var eventType, updateItemEvent, todo = {};
				todo.id = event.target.id.slice(6);
				todo.title = event.target.value.trim();
				todo.completed = event.target.completed;
				eventType = ( todo.title === "" ) ?
					todomvc.view.event.AppEvents.DELETE_ITEM : todomvc.view.event.AppEvents.UPDATE_ITEM;
				updateItemEvent = this.createEvent( eventType );
				updateItemEvent.todo = todo;
				updateItemEvent.todoId = todo.id;
				this.dispatchEvent( updateItemEvent );
			},

			setFilteredTodoList: function( data ) {
				var todo, checkbox, label, deleteLink, divDisplay,
					inputEditTodo, li, i, todoId, div, inputEditTodo;

				// Update instance data
				this.todos  = data.todos;
				this.stats  = data.stats;
				this.filter = data.filter;

				// Hide main section if no todos
				this.main.style.display = this.stats.totalTodo ? 'block' : 'none';

				// Create Todo list
				this.todoList.innerHTML = '';
				this.newTodoField.value = '';
				for ( i=0; i < this.todos.length; i++ ) {

					todo = this.todos[i];

					// Create checkbox
					checkbox = document.createElement( 'input' );
					checkbox.className = 'toggle';
					checkbox.setAttribute( 'data-todo-id', todo.id );
					checkbox.type = 'checkbox';
					checkbox.component = this;
					todomvc.view.event.AppEvents.addEventListener( checkbox, 'change', function( event ) {
						this.component.dispatchToggleComplete( event );
					});

					// Create div text
					label = document.createElement( 'label' );
					label.setAttribute( 'data-todo-id', todo.id );
					label.appendChild( document.createTextNode( todo.title ) );

					// Create delete button
					deleteLink = document.createElement( 'button' );
					deleteLink.className = 'destroy';
					deleteLink.setAttribute( 'data-todo-id', todo.id );
					deleteLink.component = this;
					todomvc.view.event.AppEvents.addEventListener( deleteLink, 'click', function( event ) {
						this.component.dispatchDelete( event.target.getAttribute( 'data-todo-id' ) );
					});

					// Create divDisplay
					divDisplay = document.createElement( 'div' );
					divDisplay.className = 'view';
					divDisplay.setAttribute( 'data-todo-id', todo.id );
					divDisplay.appendChild( checkbox );
					divDisplay.appendChild( label );
					divDisplay.appendChild( deleteLink );
					todomvc.view.event.AppEvents.addEventListener( divDisplay, 'dblclick', function() {
						todoId = this.getAttribute( 'data-todo-id' );
						div = document.getElementById( 'li_' + todoId );
						inputEditTodo = document.getElementById( 'input_' + todoId );
						div.className = 'editing';
						inputEditTodo.focus();

					});

					// Create todo input
					inputEditTodo = document.createElement( 'input' );
					inputEditTodo.id = 'input_' + todo.id;
					inputEditTodo.className = 'edit';
					inputEditTodo.value = todo.title;
					inputEditTodo.completed = todo.completed;
					inputEditTodo.component = this;
					todomvc.view.event.AppEvents.addEventListener( inputEditTodo, 'keypress', function( event ) {
						if ( event.keyCode === this.component.ENTER_KEY ) {
							this.component.dispatchUpdateTodo( event );
						}
					});
					todomvc.view.event.AppEvents.addEventListener( inputEditTodo, 'blur', function( event ) {
						this.component.dispatchUpdateTodo( event );
					});

					// Create Todo ListItem and add to list
					li = document.createElement( 'li' );
					li.id = 'li_' + todo.id;
					li.appendChild( divDisplay );
					li.appendChild( inputEditTodo );
					if ( todo.completed ) {
						li.className += 'completed';
						checkbox.checked = true;
					}
					this.todoList.appendChild( li );
				}

				// Update UI
				this.footer.style.display = this.stats.totalTodo ? 'block' : 'none';
				this.updateToggleAllCheckbox();
				this.updateClearButton();
				this.updateTodoCount();
				this.updateFilter();

			},

			getTodoById: function( id ) {
			   var i;
				for ( i = 0; i < this.todos.length; i++ ) {
					if ( this.todos[ i ].id === id ) {
						return this.todos[i];
					}
				}
			},

			updateFilter: function() {
				this.filterAll.className        = ( this.filter === todomvc.AppConstants.FILTER_ALL ) ? 'selected' : '';
				this.filterActive.className     = ( this.filter === todomvc.AppConstants.FILTER_ACTIVE ) ? 'selected' : '';
				this.filterCompleted.className  = ( this.filter === todomvc.AppConstants.FILTER_COMPLETED ) ? 'selected' : '';

			},

			updateToggleAllCheckbox: function() {
				var i, checked = ( this.todos.length > 0 );
				for ( i = 0; i < this.todos.length; i++ ) {
					if ( this.todos[ i ].completed === false ) {
						checked = false;
						break;
					}
				}
				this.toggleAllCheckbox.checked = checked;
			},

			updateClearButton: function() {
				this.clearButton.style.display = ( this.stats.todoCompleted === 0 ) ? 'none' : 'block';
				this.clearButton.innerHTML = 'Clear completed (' + this.stats.todoCompleted + ')';
			},

			updateTodoCount: function() {
				var number = document.createElement( 'strong' ),
					text   = ' ' + (this.stats.todoLeft === 1 ? 'item' : 'items' ) + ' left';
				number.innerHTML = this.stats.todoLeft;
				this.todoCount.innerHTML = null;
				this.todoCount.appendChild( number );
				this.todoCount.appendChild( document.createTextNode( text ) );
			}
	},

	// STATIC MEMBERS
	{
		NAME: 'TodoForm',
	}
);
