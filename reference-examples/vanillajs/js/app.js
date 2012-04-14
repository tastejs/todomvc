var tasks = [];
var stat;
var ENTER_KEY = 13;


function Todo(title, completed) {
	this.id = uuid();
	this.title = title;
	this.completed = completed;
}

function Stat() {
	this.todoLeft = 0;
	this.todoCompleted = 0;
	this.totalTodo = 0;
}

/**************************/
/*    EVENT HANDLERS       /
/**************************/
function bodyLoadHandler() {
	loadTasks();
	refreshData();
}

function inputEditTodoKeyPressHandler(event) {
	var inputEditTodo = event.target;
	var trimmedText = inputEditTodo.value.trim();
	var taskId = event.target.id.slice(6);

	if (trimmedText) {
		if (event.keyCode === ENTER_KEY) {
			editTask(taskId, trimmedText);
		}
	}
	else {
		removeTaskById(taskId);
		refreshData();
	}
}

function inputEditTodoBlurHandler(event) {
	var inputEditTodo = event.target;
	var taskId = event.target.id.slice(6);
	editTask(taskId, inputEditTodo.value);
}

function newTodoKeyPressHandler(event) {
	if (event.keyCode === 13) {
		addTask(document.getElementById('new-todo').value);
	}
}

function toggleAllChangeHandler(event) {
	for (var i in tasks) {
		tasks[i].completed = event.target.checked;
	}
	refreshData();
}

function spanDeleteClickHandler(event) {
	removeTaskById(event.target.getAttribute('data-todo-id'));
	refreshData();
}

function hrefClearClickHandler() {
	removeTasksCompleted();
	refreshData();
	document.getElementById('toggle-all').checked = false;
}

function todoContentHandler(event) {
	var taskId = event.target.getAttribute('data-todo-id');

	var div = document.getElementById('li_'+taskId);
	div.className = 'editing';


	var inputEditTodo = document.getElementById('input_'+taskId);
	inputEditTodo.focus();
}

function checkboxChangeHandler(event) {
	var checkbox = event.target;

	var todo = getTodoById(checkbox.getAttribute('data-todo-id'));
	todo.completed = checkbox.checked;

	refreshData();
}

/**************************/
/*    ACTIONS              /
/**************************/
function loadTasks() {
	if (!localStorage.getItem('todos-vanillajs')) {
		localStorage.setItem('todos-vanillajs', JSON.stringify([]));
	}

	tasks = JSON.parse(localStorage.getItem('todos-vanillajs'));

}

function addTask(text) {
	var trimmedText = text.trim();
	if (trimmedText) {
		var todo = new Todo(trimmedText, false);
		tasks.push(todo);
		refreshData();
	}
}

function editTask(taskId, text) {
	for (var i=0; i < tasks.length; i++) {
		if (tasks[i].id === taskId) {
			tasks[i].title = text;
		}
	}
	refreshData();
}

function removeTaskById(id) {
   for (var i=0; i < tasks.length; i++) {
		if (tasks[i].id === id) {
			tasks.splice(i, 1);
		}
   }
}

function removeTasksCompleted() {
	for (var i=tasks.length-1; i >= 0; --i) {
		if (tasks[i].completed) {
			tasks.splice(i, 1);
		}
   }
}

function getTodoById(id) {
	for (var i=0; i < tasks.length; i++) {
		if (tasks[i].id === id) {
			return tasks[i];
		}
	}
}

function refreshData() {
	saveTasks();
	computeStats();
	redrawTasksUI();
	redrawStatsUI();
}

function saveTasks() {
	localStorage.setItem('todos-vanillajs', JSON.stringify(tasks));
}

function computeStats() {
	stat = new Stat();
	stat.totalTodo = tasks.length;
	for (var i=0; i < tasks.length; i++) {
		if (tasks[i].completed) {
			stat.todoCompleted += 1;
		}
	}
	stat.todoLeft = stat.totalTodo - stat.todoCompleted;
}


/**************************/
/*    DRAWING              /
/**************************/
function redrawTasksUI() {

	var ul = document.getElementById('todo-list');
	var todo;

	document.getElementById('main').style.display = tasks.length ? 'block' : 'none';

	removeChildren(ul);
	document.getElementById('new-todo').value = '';

	for (var i= 0; i < tasks.length; i++) {
		todo = tasks[i];

		//create checkbox
		var checkbox = document.createElement('input');
		checkbox.className = 'toggle';
		checkbox.setAttribute('data-todo-id', todo.id);
		checkbox.type = 'checkbox';
		checkbox.addEventListener('change', checkboxChangeHandler);

		//create div text
		var label = document.createElement('label');
		label.setAttribute('data-todo-id', todo.id);
		label.appendChild(document.createTextNode(todo.title));


		//create delete button
		var deleteLink = document.createElement('button');
		deleteLink.className = 'destroy';
		deleteLink.setAttribute('data-todo-id', todo.id);
		deleteLink.addEventListener('click', spanDeleteClickHandler);

		//create divDisplay
		var divDisplay = document.createElement('div');
		divDisplay.className = 'view';
		divDisplay.setAttribute('data-todo-id', todo.id);
		divDisplay.appendChild(checkbox);
		divDisplay.appendChild(label);
		divDisplay.appendChild(deleteLink);
		divDisplay.addEventListener('dblclick', todoContentHandler);


		//create todo input
		var inputEditTodo = document.createElement('input');
		inputEditTodo.id = 'input_' + todo.id;
		inputEditTodo.className = 'edit';
		inputEditTodo.value = todo.title;
		inputEditTodo.addEventListener('keypress', inputEditTodoKeyPressHandler);
		inputEditTodo.addEventListener('blur', inputEditTodoBlurHandler);


		//create li
		var li = document.createElement('li');
		li.id = 'li_' + todo.id;
		li.appendChild(divDisplay);
		li.appendChild(inputEditTodo);


		if (todo.completed)
		{
			li.className += 'complete';
			checkbox.checked = true;
		}

		ul.appendChild(li);
	}
}

function redrawStatsUI() {
	removeChildren(document.getElementsByTagName('footer')[0]);
	document.getElementById('footer').style.display = tasks.length ? 'block' : 'none';

	if (stat.todoCompleted > 0) {
		drawTodoClear();
	}

	if (stat.totalTodo > 0) {
		drawTodoCount();
	}
}

function drawTodoCount() {

	// Create remaining count
	var number = document.createElement('strong');
	number.innerHTML = stat.todoLeft;
	var theText = ' item';
	if (stat.todoLeft !== 1) {
		theText += 's';
	}
	theText += ' left';

	var remaining = document.createElement('span');
	remaining.id = 'todo-count';
	remaining.appendChild(number);
	remaining.appendChild(document.createTextNode(theText));

	document.getElementsByTagName('footer')[0].appendChild(remaining);
}

function drawTodoClear() {

	var buttonClear = document.createElement('button');
	buttonClear.id = 'clear-completed';
	buttonClear.addEventListener('click', hrefClearClickHandler);
	buttonClear.innerHTML = 'Clear completed ('+stat.todoCompleted+')';

	
	document.getElementsByTagName('footer')[0].appendChild(buttonClear);
}


function removeChildren(node) {
	while (node.hasChildNodes()) {
		node.removeChild(node.firstChild);
	}
}

/**************************/
/*    UTILS                /
/**************************/
function uuid() {
  var uuid = '', i, random;
  for (i = 0; i < 32; i++) {
	random = Math.random() * 16 | 0;

	if (i == 8 || i == 12 || i == 16 || i == 20) {
	  uuid += '-'
	}
	uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

//trim polyfill
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}