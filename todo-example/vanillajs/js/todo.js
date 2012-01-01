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

function newTodoKeyPressHandler(event) {
    if (event.keyCode === 13) {
        addTask(document.getElementById("new-todo").value);
    }
}

function spanDeleteClickHandler(event) {
    removeTaskById(event.target.id);
    refreshData();
}

function hrefClearClickHandler() {
    removeTasksDone();
    refreshData();
}

function todoContentHandler(event) {
    var taskId = event.target.id;

    var div = document.getElementById("li_"+taskId);
    div.className = "editing";


    var inputEditTodo = document.getElementById("input_"+taskId);
    inputEditTodo.focus();
}

function checkboxChangeHandler(event) {
    var checkbox = event.target;

    var todo = getTodoById(checkbox.id);
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

    removeChildren(ul);
    document.getElementById("new-todo").value = "";

    for (var i= 0; i < tasks.length; i++) {
        todo = tasks[i];

        //create checkbox
        var checkbox = document.createElement("input");
        checkbox.className = "check";
        checkbox.id = todo.id;
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", checkboxChangeHandler);

        //create div text
        var divText = document.createElement("div");
        divText.className = "todo-content";
        divText.id = todo.id;
        divText.appendChild(document.createTextNode(todo.name));
        divText.addEventListener("dblclick", todoContentHandler);

        //create delete button
        var spanDelete = document.createElement("span");
        spanDelete.className = "todo-destroy";
        spanDelete.id = todo.id;
        spanDelete.addEventListener("click", spanDeleteClickHandler);

        //create divDisplay
        var divDisplay = document.createElement("div");
        divDisplay.className = "display";
        divDisplay.appendChild(checkbox);
        divDisplay.appendChild(divText);
        divDisplay.appendChild(spanDelete);


        //create div todo
        var divTodo = document.createElement("div");
        divTodo.className = "todo ";
        divTodo.appendChild(divDisplay);


        //create todo input
        var inputEditTodo = document.createElement("input");
        inputEditTodo.id = "input_" + todo.id;
        inputEditTodo.type = "text";
        inputEditTodo.className = "todo-input";
        inputEditTodo.value = todo.name;
        inputEditTodo.addEventListener("keypress", inputEditTodoKeyPressHandler);

        //create div edit
        var divEdit = document.createElement("div");
        divEdit.className = "edit";
        divEdit.appendChild(inputEditTodo);


        //create li
        var li = document.createElement("li");
        li.id = "li_" + todo.id;
        li.appendChild(divTodo);
        li.appendChild(divEdit);


        if (todo.done)
        {
            divTodo.className += "done";
            checkbox.checked = true;
        }

        ul.appendChild(li);
    }
}

function redrawStatsUI() {
    removeChildren(document.getElementById("todo-stats"))

    if (stat.totalTodo > 0) {
        drawTodoCount();
    }

    if (stat.todoCompleted > 0) {
        drawTodoClear();
    }
}

function drawTodoCount() {
    
    //create span number
    var spanNumber = document.createElement("span");
    spanNumber.className = "number";
    spanNumber.innerHTML = stat.todoLeft;

    //create span word
    var spanWord = document.createElement("span");
    spanWord.className = "word";
    spanWord.innerHTML = " item";
    
    if (stat.todoLeft > 1) {
        spanWord.innerHTML += "s";
    }

    var spanTodoCount = document.createElement("span");
    spanTodoCount.className = "todo-count";
    spanTodoCount.appendChild(spanNumber);
    spanTodoCount.appendChild(spanWord);
    spanTodoCount.innerHTML += " left.";

    document.getElementById("todo-stats").appendChild(spanTodoCount);
}

function drawTodoClear() {

    //create a href
    var hrefClear = document.createElement("a");
    hrefClear.href = "#";
    hrefClear.addEventListener("click", hrefClearClickHandler);
    hrefClear.innerHTML = "Clear ";


    //create span number done
    var spanNumberDone = document.createElement("span");
    spanNumberDone.className = "number-done";
    spanNumberDone.innerHTML = stat.todoCompleted;
    hrefClear.appendChild(spanNumberDone);
    hrefClear.innerHTML += " completed ";

    //create span word
    var spanWordDone = document.createElement("span");
    spanWordDone.className = "word-done";
    spanWordDone.innerHTML = " item";

    if (stat.todoCompleted > 1) {
        spanWordDone.innerHTML += "s";
    }

    hrefClear.appendChild(spanWordDone);

    var spanTodoClear = document.createElement("span");
    spanTodoClear.className = "todo-clear";
    spanTodoClear.appendChild(hrefClear);


    document.getElementById("todo-stats").appendChild(spanTodoClear);
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