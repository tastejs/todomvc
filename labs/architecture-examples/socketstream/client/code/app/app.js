var todosLocal = [];

// Listen out for new events coming from the server
ss.event.on('updateList', function(todos) {
  $("#todo-list").html('');
  upDateList(todos);
});

ss.event.on('sendTodos', function(socketId) {
  ss.rpc('demo.AnswersOnSendTodos', todosLocal, socketId);
});


// Show the chat form and bind to the submit action
$('#todo').on('submit', function() {

  // Grab the message from the text box
  var text = $('#new-todo').val();

  // Call the 'send' funtion (below) to ensure it's valid before sending to the server
  return exports.send(text, function(success) {
    if (success) {
      return $('#new-todo').val('');
    } else {
      return alert('Oops! Unable to creat todo');
    }
  });
});

$('#completed').on('click', function() {
  $("#completed").addClass('selected');
  $("#active").removeClass('selected');
  $("#all").removeClass('selected');
  $("#todo-list").empty();

  upDateList(todosLocal, 3);
});

$("#active").on('click', function() {
  $("#active").addClass('selected');
  $("#completed").removeClass('selected');
  $("#all").removeClass('selected');
  $("#todo-list").empty();

  upDateList(todosLocal, 2);
});

$("#all").on('click', function() {
  $("#all").addClass('selected');
  $("#completed").removeClass('selected');
  $("#active").removeClass('selected');
  $("#todo-list").empty();

  upDateList(todosLocal, 1);
});

$("#toggle-all").on('click', function() {
  doneToggle();
});

$("#clear-completed").on('click', function() {
  var temopTodos = todosLocal.slice();

  for (x in temopTodos) {
    todo = temopTodos[x];
    if (todo.done) {
      var i = getIndex(todo);
      todosLocal.remove(i);
    }
  }
  ss.rpc('demo.BroadcastTodos', todosLocal);
});

// Demonstrates sharing code between modules by exporting function
exports.send = function(text, cb) {
  if (valid(text)) {
    todo = {
      title: text,
      done: false,
      order: todosLocal.length + 1
    };
    todosLocal.push(todo);
    ss.rpc('demo.BroadcastTodos', todosLocal);
    return cb(true);
  } else {
    return cb(false);
  }
};

exports.update = function(todo, text, cb) {
  if (valid(text)) {
    var index = getIndex(todo);
    todo.title = text;
    todosLocal[index] = todo;
    ss.rpc('demo.BroadcastTodos', todosLocal);
    return cb(true);
  } else {
    return cb(false);
  }
};


// Private functions
var valid = function(text) {
    return text && text.length > 0;
  };


function upDateList(todos, status) {
  todosLocal = todos;

  var statusUser

  switch (status) {
  case 1:
    statusUser = null;
    break;
  case 2:
    statusUser = false;
    break;
  case 3:
    statusUser = true;
    break;
  default:
    statusUser = getStatusOfThisUser();
  }

  var todosStatus = sortTodosWithStatus(statusUser);

  if (todosStatus.length > 0) {
    $("#main").show();
    $("#footer").show();
    setCountLeft();
    setCountComplete();
    if (allmarkt()) {
      $("#toggle-all").attr('checked', true);
    } else {
      $("#toggle-all").attr('checked', false);
    }

    $.each(todosStatus, function(id, todo) {
      createToDo(todo);
    });
  } else {
    if (statusUser == null) {
      $("#main").hide();
      $("#footer").hide();
      $("#all").addClass('selected');
      $("#completed").removeClass('selected');
      $("#active").removeClass('selected');
    } else if (statusUser) {
      $("#main").show();
      $("#footer").show();
      $("#completed").addClass('selected');
      $("#all").removeClass('selected');
      $("#active").removeClass('selected');
    } else if (!statusUser) {
      $("#main").show();
      $("#footer").show();
      $("#active").addClass('selected');
      $("#all").removeClass('selected');
      $("#completed").removeClass('selected');
    }

  }
}

function createToDo(todo) {
  var TempDone = '';
  var TempLiDone = '';

  if (todo.done) {
    TempDone = 'checked=checked'
    TempLiDone = 'class=done'
  };

  var html = ss.tmpl['todo-todoPost'].render({
    message: todo.title,
    order: todo.order,
    done: TempDone,
    lidone: TempLiDone
  });
  $(html).appendTo('#todo-list');

  $("#Delete" + todo.order).on('click', function() {
    deleteTodo(todo);
  });

  $("#Done" + todo.order).on('click', function() {
    doneToggle(todo);
  });

  $("#ClickEdit" + todo.order).on('dblclick', function() {
    $("#li" + todo.order).addClass('editing');
    $("#Edit" + todo.order).show();
  });

  $("#Edit" + todo.order).on('keyup', function(e) {
    if (e.keyCode == 13) {

      var text = $("#Edit" + todo.order).val();

      return exports.update(todo, text, function(success) {
        if (success) {

        } else {
          return alert('Oops! Unable to creat todo');
        }
      });
    }
  });
}

function deleteTodo(todo) {
  var index = getIndex(todo);
  todosLocal.remove(index);
  ss.rpc('demo.BroadcastTodos', todosLocal);
}

function setCountLeft() {
  var count = 0;
  $.each(todosLocal, function(id, todo) {
    if (!todo.done) {
      count++;
    }
  });

  $("#todo-count").html('<b>' + count + '<b> items left');
}

function setCountComplete() {
  var count = 0;
  $.each(todosLocal, function(id, todo) {
    if (todo.done) {
      count++;
    }
  });
  if (count == 0) {
    $("#clear-completed").hide();
  } else {
    $("#clear-completed").html('Clear completed (' + count + ')').show();
  }
}

function sortTodosWithStatus(status) {
  var todosStatus = [];

  if (status == null) {
    return todosLocal;
  } else {
    for (i = 0; i < todosLocal.length; i++) {
      var todo = todosLocal[i];
      if (todo.done == status) {
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

function doneToggle(todo) {
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
  var index = getIndex(todo);
  var tempTodo = todosLocal[index];

  if (tempTodo.done) {
    tempTodo.done = false;
  } else {
    tempTodo.done = true;
  }
  todosLocal[index] = tempTodo;
}

function setDoneOnAll(status) {
  for (i = 0; i < todosLocal.length; i++) {
    var todo = todosLocal[i];
    todo.done = status;
    todosLocal[i] = todo;
  }
}

function allmarkt() {
  var markt = true;

  if (todosLocal.length == 0) {
    markt = false;
  } else {
    for (i = 0; i < todosLocal.length; i++) {
      var todo = todosLocal[i];
      if (!todo.done) {
        markt = false;
      }
    }
  }
  return markt;
}

function getIndex(todo) {
  for (i = 0; i < todosLocal.length; i++) {
    if (todosLocal[i].order == todo.order) {
      return i;
    }
  }
  return -1;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};