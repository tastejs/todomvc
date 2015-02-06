define([], function() {
	var todos = avalon.define("todos", function(vm) {
		vm.todos = []
		vm.newTodo = ""
		vm.status = ""
		vm.remainingCount = 0
		vm.completedCount = 0
		vm.allChecked = []
		vm.editedTodo = null
		vm.statusFilter = null
		vm.saveEvent = null
		vm.reverted = null

		vm.filter = function(todo) {
			if(vm.status == "active") return todo.completed.length == 0
			if(vm.status == "completed") return todo.completed.length
			return true
		}

		vm.addTodo = function(e) {
			e && e.preventDefault()
			var newTodo = {
				title: vm.newTodo.trim(),
				completed: []
			}

			if (!newTodo.title) {
				return
			}

			vm.saving = true
			vm.todos.push(newTodo)
			vm.newTodo = ''
			vm.saving = false
		}

		vm.getClass = function(todo) {
			// {completed: todo.completed, editing: todo == editedTodo}
			var className1 = todo.completed[0] == "on" && "completed" || "",
				className2 = todo === vm.editedTodo && "editing" || ""
			return [className1, className2].join(" ")
		}

		vm.editTodo = function (todo) {
			vm.editedTodo = todo
			vm.originalTodo = avalon.mix({}, todo)
		}

		vm.saveEdits = function(todo, type, e) {
			e && e.preventDefault()
			if (event === 'blur' && vm.saveEvent === 'submit') {
				vm.saveEvent = null
				return
			}

			vm.saveEvent = event

			if (vm.reverted) {
				vm.reverted = null
				return
			}

			todo.title = todo.title.trim()

			if (todo.title === vm.originalTodo.title) {
				return
			}
			vm.editedTodo = null
		}

		vm.revertEdits = function (todo, e) {
			if(e && e.keyCode != 27) return
			vm.todos[vm.todos.indexOf(todo)] = vm.originalTodo
			vm.editedTodo = null
			vm.originalTodo = null
			vm.reverted = true
		}

		vm.removeTodo = function (todo) {
			vm.todos.remove(todo)
		}

		vm.toggleCompleted = function (todo, completed) {
			if (completed != void 0) {
				todo.completed = completed
			}
		}

		vm.clearCompletedTodos = function () {
			avalon.each(vm.todos, function(i, todo) {
				if(todo.completed.length) vm.todos.remove(todo)
			})
		}

		vm.markAll = function (completed) {
			vm.todos.forEach(function (todo) {
				if (todo.completed[0] !== completed[0]) {
					vm.toggleCompleted(todo, completed)
				}
			})
		}
		vm.checkAll = function(len) {
			var all = todos.todos,
				remainingCount = !len.preventDefault ? len : all.length
			avalon.each(all, function(i, todo) {
				if(todo.completed.length) remainingCount--
			})
			todos.remainingCount = remainingCount
			todos.completedCount = len - remainingCount
			todos.allChecked = remainingCount ? [] : ["on"]
		}
	})

	todos.todos.$watch("length", todos.checkAll)
})