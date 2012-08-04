import localstorage
import list
import text

<head>
	<meta charset="utf-8" />
	<title>"Fun • TodoMVC"</title>
	<link rel="stylesheet" href="../../assets/base.css" />
	<link rel="stylesheet" href="css/app.css" />
</head>

tasks = []
localstorage.persist(tasks, 'todos-fun')

nextId = 1
localstorage.persist(nextId, 'todos-id')

displayTasks = tasks
displayFilter = 'all'

<section id="todoapp">
	<header id="header">
		<h1>"todos"</h1>
		newTaskName = ''
		<input id="new-todo" placeholder="What needs to be done?" autofocus=true data=newTaskName onkeypress=handler(event) {
			if (event.keyCode is 13) {
				trimmedName = text.trim(newTaskName.copy())
				id = nextId.copy()
				if trimmedName is ! '' {
					tasks push: { title:trimmedName, completed:false, id:id }
					newTaskName set: ''
				}
				nextId set: nextId.copy() + 1
			}
		}/>
	</header>

	if tasks.length {
		<section id="main">
			toggleAll = false
			<input id="toggle-all" type="checkbox" data=toggleAll onchange=handler() {
				for task in tasks {
					task.completed set: !toggleAll.copy()
				}
			} />
			<label for="toggle-all">"Mark all as complete"</label>
			<ul id="todo-list">
				for task in displayTasks {
					<li class=(task.completed ? "complete" : "")>
						<div class="view">
							<input class="toggle" type="checkbox" data=task.completed />
							<label>task.title</label>
							<button class="destroy"></button onclick=handler() {
								tasks set: list.filter(tasks.copy(), function(checkTask) { return checkTask.id is ! task.id })
							}>
						</div>
						// TODO Implement editing
						<input class="edit" data=task.title />
					</li>
				}
			</ul>
		</section>

		<footer id="footer">
			completedTasks = list.filter(tasks, function(task) { return task.completed })
			pluralize = function(num) { return num is > 1 ? "items" : "item" }
			<span id="todo-count">
				numTasksLeft = tasks.length - completedTasks.length
				<strong>numTasksLeft</strong>" "pluralize(numTasksLeft)" left"
			</span>
			<ul id="filters">
				<li><a href="#" class=(displayFilter is 'all' ? 'selected' : '')>"All"</a></li onclick=handler() {
					displayTasks set: tasks
					displayFilter set:'all'
				}>
				<li><a href="#" class=(displayFilter is 'active' ? 'selected' : '')>"Active"</a></li onclick=handler() {
					displayTasks set: list.filter(tasks, function(task) { return !task.completed })
					displayFilter set:'active'
				}>
				<li><a href="#" class=(displayFilter is 'completed' ? 'selected' : '')>"Completed"</a></li onclick=handler() {
					displayTasks set: list.filter(tasks, function(task) { return task.completed })
					displayFilter set:'completed'
				}>
			</ul>
			<button id="clear-completed">"Clear completed ("completedTasks.length")"</button onclick=handler() {
				remainingTasks = []
				for task in tasks {
					if !task.completed {
						remainingTasks push: task
					}
				}
				tasks set: remainingTasks
			}>
		</footer>
	}
</section>

<footer id="info">
	<p>"Double-click to edit a todo"</p>
	<p>"Created with "<a href="https://github.com/marcuswestin/fun">"Fun"</a>" by "<a href="http://marcuswest.in">"Marcus Westin"</a></p>
</footer>
