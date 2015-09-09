class window.TodoCollection extends Backbone.Collection
	localStorage: new Store('todos-knockback') # Save all of the todos under the "todos-knockback" namespace.
