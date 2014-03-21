define("app", function(exports, require, module) {
  (function(window) {
    "use strict";
  })(window);
});

define("controller.todo", function(exports, require, module) {
  "use strict";
  var route = require("util.route"), model = require("model.todo");
  route.look(exports).when("#/active", function() {
    var todos = model.get();
    exports.todos = todos.filter(function(d) {
      if (!d.completed) {
        return d;
      }
    });
  }).when("#/completed", function() {
    var todos = model.get();
    exports.todos = todos.filter(function(d) {
      if (d.completed) {
        return d;
      }
    });
  }).others(function() {
    exports.todos = model.get();
  });
  route.nav();
  exports.add = function(title) {
    title = title.trim();
    if (!title) {
      return;
    }
    model.add(title);
    route.nav();
  };
  exports.remove = function(todo) {
    model.remove(todo);
    route.nav();
  };
  exports.update = function(todo) {
    todo.title = todo.title.trim();
    if (!todo.title) {
      exports.remove(todo);
    } else {
      model.update(todo);
      route.nav();
    }
  };
  exports.get = function() {
    return model.get();
  };
});

define("model.todo", function(exports, require, module) {
  "use strict";
  var tool = require("river.core.tools");
  var STORAGE_ID = "todos-riverjs";
  exports.get = function() {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || "[]");
  };
  function save(todos) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  }
  exports.add = function(title) {
    var newTodo = {
      id: tool.guid(),
      title: title,
      completed: false
    };
    var todos = exports.get();
    todos.push(newTodo);
    save(todos);
  };
  exports.remove = function(todo) {
    var todos = exports.get();
    todos = todos.filter(function(d) {
      if (d.id !== todo.id) {
        return d;
      }
    });
    save(todos);
  };
  exports.update = function(todo) {
    var todos = exports.get();
    for (var i = 0, len = todos.length; i < len; i++) {
      if (todo.id === todos[i].id) {
        todos[i].title = todo.title;
        todos[i].completed = todo.completed;
        break;
      }
    }
    save(todos);
  };
});

define("util.route", function(exports, require, module) {
  "use strict";
  var scope, pages = {};
  function route() {
    var addr = location.hash;
    if (pages[addr] && typeof pages[addr] === "function") {
      pages[addr]();
    } else if (pages.__defaults && typeof pages.__defaults === "function") {
      pages.__defaults();
    }
  }
  window.addEventListener("hashchange", function() {
    route();
    if (scope) {
      scope.apply();
    }
  });
  exports.nav = function() {
    route();
  };
  exports.when = function(id, fn) {
    pages[id] = fn;
    return this;
  };
  exports.others = function(fn) {
    pages.__defaults = fn;
    return this;
  };
  exports.look = function(s) {
    scope = s;
    return this;
  };
});

define("river.grammer.footer", function(exports, require, module) {
  "use strict";
  var route = require("util.route");
  function label(filters, index) {
    for (var i = 0, len = filters.length; i < len; i++) {
      if (i === index) {
        filters[i].className = "selected";
      } else {
        filters[i].className = "";
      }
    }
  }
  function todoCount(element, todos) {
    var count = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
      if (!todos[i].completed) {
        count++;
      }
    }
    if (count === 0) {
      element.innerHTML = "<strong>0</strong> items left";
    } else if (count === 1) {
      element.innerHTML = "<strong>1</strong> item left";
    } else {
      element.innerHTML = "<strong>" + count + "</strong> items left";
    }
  }
  function completeCount(element, todos) {
    var count = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
      if (todos[i].completed) {
        count++;
      }
    }
    element.innerHTML = "Clear completed (" + count + ")";
    if (count === 0) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
  function footer(str, scope, element) {
    route.when("#/active", function() {
      label(element.querySelectorAll("#filters li a"), 1);
    }).when("#/completed", function() {
      label(element.querySelectorAll("#filters li a"), 2);
    }).others(function() {
      label(element.querySelectorAll("#filters li a"), 0);
    });
    route.nav();
    scope.onchange("todos", function() {
      todoCount(element.querySelector("#todo-count"), scope.get());
      completeCount(element.querySelector("#clear-completed"), scope.get());
    });
    todoCount(element.querySelector("#todo-count"), scope.get());
    completeCount(element.querySelector("#clear-completed"), scope.get());
  }
  exports = module.exports = footer;
});

define("river.grammer.header", function(exports, require, module) {
  "use strict";
  function header(str, scope, element) {
    var newTodo = element.querySelector("#new-todo");
    newTodo.onkeydown = function(event) {
      if (event.keyCode === 13) {
        scope.add(newTodo.value);
        scope.apply();
        newTodo.value = "";
      }
    };
  }
  exports = module.exports = header;
});

define("river.grammer.item", function(exports, require, module) {
  "use strict";
  function item(str, scope, element) {
    var cbx = element.querySelector(".toggle"), edit = element.querySelector(".edit"), byEnter = false, byEsc = false;
    cbx.onclick = function() {
      scope.todo.completed = !scope.todo.completed;
      scope.update(scope.todo);
      scope.apply();
    };
    element.ondblclick = function() {
      element.className = element.className + " editing";
      edit.value = scope.todo.title;
      edit.focus();
    };
    edit.onblur = function() {
      element.className = element.className.replace(/\sediting/, "");
      if (byEsc) {
        return;
      }
      scope.todo.title = this.value;
      scope.update(scope.todo);
      scope.apply();
    };
    edit.onkeydown = function(event) {
      byEnter = event.keyCode === 13;
      byEsc = event.keyCode === 27;
      if (byEnter || byEsc) {
        element.className = element.className.replace(/\sediting/, "");
      }
    };
    var isCompleted = scope.todo.completed;
    element.className = isCompleted ? "completed" : "";
    cbx.checked = isCompleted ? true : false;
  }
  exports = module.exports = item;
});

define("river.grammer.main", function(exports, require, module) {
  "use strict";
  function main(str, scope, element) {
    scope.onchange("todos", function(todos) {
      if (!todos.length) {
        element.style.display = "none";
      } else {
        element.style.display = "block";
      }
    });
  }
  exports = module.exports = main;
});