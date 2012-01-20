var tasks = [];
var stat;

/**************************/
/*    MODEL                /
/**************************/
function Todo(name, done) {
    this.id = uuid();
    this.name = name;
    this.done = done;
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
    var taskId = event.target.id.slice(6);

    if (event.keyCode === 13) {
        editTask(taskId, inputEditTodo.value);
    }
}

function inputEditTodoBlurHandler(event) {
    var inputEditTodo = event.target;
    var taskId = event.target.id.slice(6);
    editTask(taskId, inputEditTodo.value);
}

function newTodoKeyPressHandler(event) {
    if (event.keyCode === 13) {
        addTask(document.getElementById("new-todo").value);
    }
}

function toggleAllChangeHandler(event) {
    for (var i in tasks) {
        tasks[i].done = event.target.checked;
    }
    refreshData();
}

function spanDeleteClickHandler(event) {
    removeTaskById(event.target.getAttribute("data-todo-id"));
    refreshData();
}

function hrefClearClickHandler() {
    removeTasksDone();
    refreshData();
}

function todoContentHandler(event) {
    var taskId = event.target.getAttribute("data-todo-id");

    var div = document.getElementById("li_"+taskId);
    div.className = "editing";


    var inputEditTodo = document.getElementById("input_"+taskId);
    inputEditTodo.focus();
}

function checkboxChangeHandler(event) {
    var checkbox = event.target;

    var todo = getTodoById(checkbox.getAttribute('data-todo-id'));
    todo.done = checkbox.checked;

    refreshData();
}

/**************************/
/*    ACTIONS              /
/**************************/
function loadTasks() {
    if (!localStorage.todo) {
        localStorage.todo = JSON.stringify([]);
    }

    tasks = JSON.parse(localStorage['todo']);

}

function addTask(text) {
    var todo = new Todo(text, false);
    tasks.push(todo);
    refreshData();
}

function editTask(taskId, text) {
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            tasks[i].name = text;
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

function removeTasksDone() {
    for (var i=tasks.length-1; i >= 0; --i) {
        if (tasks[i].done) {
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
    localStorage['todo'] = JSON.stringify(tasks);
}

function computeStats() {
    stat = new Stat();
    stat.totalTodo = tasks.length;
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].done) {
            stat.todoCompleted += 1;
        }
    }
    stat.todoLeft = stat.totalTodo - stat.todoCompleted;
}


/**************************/
/*    DRAWING              /
/**************************/
function redrawTasksUI() {

    var ul = document.getElementById("todo-list");
    var todo;

    document.getElementById("main").style.display = tasks.length ? "block" : "none";

    removeChildren(ul);
    document.getElementById("new-todo").value = "";

    for (var i= 0; i < tasks.length; i++) {
        todo = tasks[i];

        //create checkbox
        var checkbox = document.createElement("input");
        checkbox.className = "toggle";
        checkbox.setAttribute("data-todo-id", todo.id);
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", checkboxChangeHandler);

        //create div text
        var label = document.createElement("label");
        label.setAttribute("data-todo-id", todo.id);
        label.appendChild(document.createTextNode(todo.name));
        label.addEventListener("dblclick", todoContentHandler);

        //create delete button
        var deleteLink = document.createElement("a");
        deleteLink.className = "destroy";
        deleteLink.setAttribute("data-todo-id", todo.id);
        deleteLink.addEventListener("click", spanDeleteClickHandler);

        //create divDisplay
        var divDisplay = document.createElement("div");
        divDisplay.className = "view";
        divDisplay.appendChild(checkbox);
        divDisplay.appendChild(label);
        divDisplay.appendChild(deleteLink);


        //create todo input
        var inputEditTodo = document.createElement("input");
        inputEditTodo.id = "input_" + todo.id;
        inputEditTodo.type = "text";
        inputEditTodo.className = "edit";
        inputEditTodo.value = todo.name;
        inputEditTodo.addEventListener("keypress", inputEditTodoKeyPressHandler);
        inputEditTodo.addEventListener("blur", inputEditTodoBlurHandler);


        //create li
        var li = document.createElement("li");
        li.id = "li_" + todo.id;
        li.appendChild(divDisplay);
        li.appendChild(inputEditTodo);


        if (todo.done)
        {
            li.className += "done";
            checkbox.checked = true;
        }

        ul.appendChild(li);
    }
}

function redrawStatsUI() {
    removeChildren(document.getElementsByTagName("footer")[0]);

    if (stat.todoCompleted > 0) {
        drawTodoClear();
    }

    if (stat.totalTodo > 0) {
        drawTodoCount();
    }
}

function drawTodoCount() {

    // Create remaining count
    var number = document.createElement("span");
    number.innerHTML = stat.todoLeft;
    var theText = " item";
    if (stat.todoLeft !== 1) {
        theText += "s";
    }
    theText += " left";

    var remaining = document.createElement("div");
    remaining.id = "todo-count";
    remaining.appendChild(number);
    remaining.appendChild(document.createTextNode(theText));

    document.getElementsByTagName("footer")[0].appendChild(remaining);
}

function drawTodoClear() {

    //create a href
    var hrefClear = document.createElement("a");
    hrefClear.id = "clear-completed";
    hrefClear.addEventListener("click", hrefClearClickHandler);
    hrefClear.innerHTML = "Clear ";

    //create span number done
    var spanNumberDone = document.createElement("span");
    spanNumberDone.innerHTML = stat.todoCompleted;

    hrefClear.appendChild(spanNumberDone);
    hrefClear.innerHTML += " completed item";
    if (stat.todoCompleted > 1) {
        hrefClear.innerHTML += "s";
    }

    document.getElementsByTagName("footer")[0].appendChild(hrefClear);
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
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}
