var todosLocal = [];
var todosLocalLength = 0;


var ENTER_KEY = 13;

// Listen out for new events coming from the server
ss.event.on('updateList', function(todos) {
  $("#todo-list").html('');
  updateList(todos);
});

ss.event.on('sendTodos', function(socketId) {
  ss.rpc('demo.AnswersOnSendTodos', todosLocal, socketId);
});


$('#new-todo').on('keyup', function(e) {
  if (e.keyCode == ENTER_KEY) {
    // Grab the text from the text box
    var text = $('#new-todo').val().trim();
    // Call the 'send' funtion to ensure it's valid before sending to the server
    var success = exports.send(text);

    if (success) {
      $('#new-todo').val('');
      return true;
    } else {
      return false;
    }
  }
});

exports.send = function(text) {
  if (valid(text)) {
    todo = {
      id: nextId(),
      title: text,
      completed: false,
      order: todosLocalLength + 1
    };
    todosLocal.push(todo);
    ss.rpc('demo.BroadcastTodos', todosLocal);
    return true;
  } else {
    return false;
  }
};

exports.update = function(todo, text) {
  if (valid(text)) {
    var index = getIndex(todo.id);
    todo.title = text;
    todosLocal[index] = todo;
    ss.rpc('demo.BroadcastTodos', todosLocal);
    return true;
  } else {
    return false;
  }
};


function valid(text) {
  return text && text.length > 0;
};


function updateList(todos) {
  todosLocal = todos;
  todosLocalLength = todosLocal.length;

  var statusUser = getStatusOfThisUser();

  var todosStatus = sortTodosWithStatus(statusUser);

  setFooter();

  if (todosStatus.length) {
    $("#main").show();
    $("#footer").show();

    $("#toggle-all").prop('checked', allmarkt());

    $.each(todosStatus, function(id, todo) {
      createToDo(todo);
    });
  };
  setListener();
}

function createToDo(todo) {
  var html = ss.tmpl['todo-todoPost'].render({
    id: todo.id,
    message: todo.title,
    order: todo.order,
    completed: todo.completed,
  });
  $(html).appendTo('#todo-list');
}

function deleteTodo(todo) {
  var index = getIndex(todo.id);
  todosLocal.splice(index, 1);
  ss.rpc('demo.BroadcastTodos', todosLocal);
}
//Use templating for the footer (#footer). This means the counter, and the Clear completed button.

function setFooter() {
  var count = setCountLeft();
  var s = true;
  var all = true;
  var active = false;
  var completed = false;

  if (count == 1) {
    s = false;
  }

  var url = window.location.hash;

  if (url == '#/active') {
    all = false;
    active = true;
    $("#footer").show();
  } else if (url == '#/completed') {
    all = false;
    completed = true;
    $("#footer").show();
  }

  var html = ss.tmpl['todo-footer'].render({
    countLeft: count,
    countComplete: todosLocalLength - count,
    s: s,
    all: all,
    active: active,
    completed: completed,
  });
  $("#footer").html('');
  $(html).appendTo('#footer');
}

function setCountLeft() {
  var count = 0;
  $.each(todosLocal, function(id, todo) {
    if (!todo.completed) {
      count++;
    }
  });
  return count;
}

function sortTodosWithStatus(status) {
  var todosStatus = [];

  if (status == null) {
    return todosLocal;
  } else {
    for (var i = 0; i < todosLocalLength; i++) {
      var todo = todosLocal[i];
      if (todo.completed == status) {
        todosStatus.push(todo);
      }
    }
  }
  return todosStatus;
}

function getStatusOfThisUser() {
  var url = window.location.hash;
  if (url == '#/active') {
    return false;
  } else if (url == '#/completed') {
    return true;
  }
  return null;
}

function toggleCompleted(todo) {
  //find and toggle done on todos or todo and push new todos
  if (todo == null) {
    if (allmarkt()) {
      setDoneOnAll(false);
    } else {
      setDoneOnAll(true);
    }
    ss.rpc('demo.BroadcastTodos', todosLocal)

  } else {
    toggleDone(todo);
    ss.rpc('demo.BroadcastTodos', todosLocal)
  }
}

function toggleDone(todo) {
  var index = getIndex(todo.id);
  var tempTodo = todosLocal[index];

  tempTodo.completed = !tempTodo.completed;
}

function setDoneOnAll(status) {
  for (var i = 0; i < todosLocalLength; i++) {
    var todo = todosLocal[i];
    todo.completed = status;
    todosLocal[i] = todo;
  }
}

function allmarkt() {
  var markt = true;

  if (todosLocalLength == 0) {
    markt = false;
  } else {
    for (var i = 0; i < todosLocalLength; i++) {
      var todo = todosLocal[i];
      if (!todo.completed) {
        markt = false;
      }
    }
  }
  return markt;
}

function getIndex(todo) {
  for (var i = 0; i < todosLocalLength; i++) {
    if (todosLocal[i].order == todo.order) {
      return i;
    }
  }
  return -1;
}

function setListener() {

  var todo;

  $(".destroy").on('click', function(event) {
    todo = getTodoOnId(event.target.name);
    if(todo !== null){
      deleteTodo(todo);
    };
  });

  $(".toggle").on('click', function(event) {
    todo = getTodoOnId(event.target.name);
    if(todo !== null){
      toggleCompleted(todo);
    };
  });

  $('.view').on('dblclick', function(event) {
    todo = getTodoOnId(event.target.title);
    if(todo !== null){
      $('.editing').removeClass('editing');
      $('#li' + todo.order).addClass('editing');
      $('#Edit' + todo.order).show().select();
    };
  });

  $(".edit").on('keyup blur', function(event) {
    todo = getTodoOnId(event.target.name);
    if(todo !== null){
      if (event.keyCode == ENTER_KEY || event.type == 'blur') {

        var text = $("#Edit" + todo.order).val().trim();

        var success = exports.update(todo, text);

        if (success) {
          return true;
        } else {
          deleteTodo(todo);
          return false;
        }
      }
    }
  });

  $("#clear-completed").on('click', function() {
    var tempTodos = todosLocal.slice();

    for (var x in tempTodos) {
      todo = tempTodos[x];
      if (todo.completed) {
        var i = getIndex(todo.id);
        todosLocal.splice(i, 1);
      }
    }
    ss.rpc('demo.BroadcastTodos', todosLocal);
  });
};

$("#toggle-all").on('click', function() {
  toggleCompleted();
});

function hashChange() {
  $("#todo-list").html('');
  updateList(todosLocal);
}

window.addEventListener("hashchange", hashChange, false);


function nextId() {
  if (!todosLocal.length) {
    return 1;
  } else {
    var id = todosLocal[todosLocalLength - 1].id;
    return id + 1;
  }
};

function getIndex(id) {
  for (var i = 0; i < todosLocalLength; i++) {
    var todo = todosLocal[i];
    if (todo.id == id) {
      return i;
    }
  };
  return null;
};

function getTodoOnId(id) {
  for (var i = 0; i < todosLocalLength; i++) {
    var todo = todosLocal[i];
    if (typeof todo === "undefined") {
      return null;
    }else if (todo.id == id) {
      return todo;
    }
  };
  return null;
};