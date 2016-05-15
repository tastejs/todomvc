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
	}
	else if(type === 'active') {
		TodosList.filter(todo => !todo.isCompleted);
	}
	else { // type = 'completed'
		TodosList.filter(todo => todo.isCompleted);
	}
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
const updateSize = () => {
	todosSize.textContent = TodosList.models().filter(todo => !todo.isCompleted).length;
} 