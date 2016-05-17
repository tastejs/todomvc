(function() {

// Remove Todo
window.removeTodo = (index) => {
	TodosList.remove(index);
}

// Toggle Todo
window.toggleTodo = (index) => {
	let isCompleted = !TodosList.get(index).isCompleted;
	TodosList.edit(index, { isCompleted }); // Edit todo
}

// Filter Todos
window.filterTodos = (type) => {
	if(type === 'all') {
		TodosList.filter(todo => true);
		styleFilter('all');
	}
	else if(type === 'active') {
		TodosList.filter(todo => !todo.isCompleted);
		styleFilter('active');
	}
	else { // type = 'completed'
		TodosList.filter(todo => todo.isCompleted);
		styleFilter('completed');
	}
	Skeleton.storage.save({ filter: type });
}

// Clear Completed
window.clearCompleted = () => {
	TodosList.forEach(todo => {
		if(todo.isCompleted) {
			window.removeTodo(todo.index);
		}
	});
}

// Remove All Todos
window.removeAll = () => {
	TodosList.removeAll();
}

// Update Size
var todosSize = document.getElementById('todos-size');
window.updateSize = () => {
	todosSize.textContent = TodosList.models().filter(todo => !todo.isCompleted).length;
} 

// Style on choosing filter
var filters = {
	all: document.getElementById('filter-all'),
	active: document.getElementById('filter-active'),
	completed: document.getElementById('filter-completed')
}

function styleFilter(filter) {
	Object.keys(filters).forEach(fltr => {
		if(fltr === filter) {
			return filters[fltr].style.fontStyle = 'italic';
		}
		return filters[fltr].style.fontStyle = 'normal';
	});
}

})();