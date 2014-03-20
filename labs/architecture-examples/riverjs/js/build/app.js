define("app", function(exports, require, module) {
  (function(window) {
    "use strict";
  })(window);
});

define("controller.todos", function(exports, require, module) {
  "use strict";
  var model = require("model.local"), todos = exports.todos = model.get();
  function calStatus() {
    exports.activenum = 0;
    exports.completednum = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
      if (todos[i].status === "active") {
        exports.activenum++;
      } else {
        exports.completednum++;
      }
    }
  }
  function save(todos) {
    calStatus();
    model.save(todos);
  }
  exports.save = save;
  calStatus();
  exports.add = function(value) {
    value = value.trim();
    if (!value) {
      return;
    }
    todos.push({
      desc: value,
      status: "active"
    });
    save(todos);
  };
  function remove(todo) {
    var index = todos.indexOf(todo);
    todos.splice(index, 1);
    save(todos);
  }
  exports.remove = remove;
  exports.update = function(todo, value) {
    value = value.trim();
    if (!value) {
      remove(todo);
    } else {
      todo.desc = value;
      save(todos);
    }
  };
  exports.toggleall = function() {
    todos.forEach(function(d) {
      if (exports.completednum >= 0 && exports.completednum < todos.length) {
        d.status = "completed";
      } else {
        d.status = "active";
      }
    });
    save(todos);
  };
  exports.toggleStatus = function(todo) {
    if (todo.status === "active") {
      todo.status = "completed";
    } else {
      todo.status = "active";
    }
    save(todos);
  };
  exports.removeCompleted = function() {
    exports.completednum = 0;
    todos = exports.todos = todos.filter(function(d) {
      if (d.status !== "completed") {
        return true;
      }
    });
    save(todos);
  };
});

define("model.local", function(exports, require, module) {
  "use strict";
  var STORAGE_ID = "todos-riverjs";
  exports.get = function() {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || "[]");
  };
  exports.save = function(todos) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
  };
});

define("util.route", function(exports, require, module) {
  "use strict";
  var pages = {};
  function route() {
    var addr = location.hash;
    if (pages[addr] && typeof pages[addr] === "function") {
      pages[addr]();
    }
  }
  window.addEventListener("hashchange", function() {
    route();
  });
  exports.nav = function() {
    route();
  };
  exports.when = function(id, fn) {
    pages[id] = fn;
    return this;
  };
});

define("river.grammer.footer", function(exports, require, module) {
  "use strict";
  var route = require("util.route"), active = "selected";
  function clear(btns) {
    for (var i = 0, len = btns.length; i < len; i++) {
      btns[i].className = "";
    }
  }
  function show(element, todos) {
    if (!todos.length) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
  function completnum(element, num) {
    var btn = element.querySelector("#clear-completed");
    if (num > 0) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }
  function activenum(element, len) {
    var todocont = element.querySelector("#todo-count");
    if (len > 1) {
      todocont.innerHTML = "<strong>" + len + "</strong> items left";
    } else if (len === 1) {
      todocont.innerHTML = "<strong>1</strong> item left";
    } else if (len === 0) {
      todocont.innerHTML = "<strong>0</strong> items left";
    }
  }
  function footer(str, scope, element) {
    show(element, scope.todos);
    completnum(element, scope.completednum, scope.todos.length);
    activenum(element, scope.activenum);
    scope.onchange("todos", function(todos) {
      show(element, todos);
    });
    scope.onchange("completednum", function(value) {
      completnum(element, value, scope.todos.length);
    });
    scope.onchange("activenum", function(value) {
      activenum(element, value);
    });
    route.when("#/", function() {
      var btns = element.querySelectorAll("#filters a");
      clear(btns);
      btns[0].className = active;
    }).when("#/active", function() {
      var btns = element.querySelectorAll("#filters a");
      clear(btns);
      btns[1].className = active;
    }).when("#/completed", function() {
      var btns = element.querySelectorAll("#filters a");
      clear(btns);
      btns[2].className = active;
    });
    route.nav();
  }
  exports = module.exports = footer;
});

define("river.grammer.header", function(exports, require, module) {
  "use strict";
  function header(str, scope, element) {
    var newtodo = element.querySelector("#new-todo");
    newtodo.onkeypress = function(event) {
      if (event.keyCode === 13) {
        scope.add(newtodo.value);
        scope.apply();
        newtodo.value = "";
      }
    };
  }
  exports = module.exports = header;
});

define("river.grammer.item", function(exports, require, module) {
  "use strict";
  var route = require("util.route");
  function status(scope) {
    return scope.todo.status;
  }
  function writeView(element) {
    var t = element.className;
    element.className = t + " editing";
    element.querySelector(".edit").focus();
  }
  function readView(element) {
    var t = element.className;
    element.className = t.replace(/\sediting/, "");
  }
  function todo(str, scope, element) {
    var editinput = element.querySelector(".edit");
    var label = element.querySelector("label");
    route.when("#/", function() {
      element.style.display = "block";
    }).when("#/active", function() {
      var sta = status(scope);
      if (sta === "active") {
        element.style.display = "block";
      } else if (sta === "completed") {
        element.style.display = "none";
      }
    }).when("#/completed", function() {
      var sta = status(scope);
      if (sta === "active") {
        element.style.display = "none";
      } else if (sta === "completed") {
        element.style.display = "block";
      }
    });
    route.nav();
    scope.onchange("status", function() {
      route.nav();
    });
    label.ondblclick = function() {
      editinput.value = scope.todo.desc;
      writeView(element);
    };
    var byEsc = false;
    var byEnter = false;
    editinput.onblur = function() {
      if (byEsc || byEnter) {
        return;
      }
      scope.update(scope.todo, editinput.value);
      scope.apply();
      readView(element);
    };
    editinput.onkeydown = function(event) {
      byEsc = false;
      byEnter = false;
      var enter = event.keyCode === 13 || false;
      var esc = event.keyCode === 27 || false;
      if (enter) {
        byEnter = true;
        scope.update(scope.todo, editinput.value);
        scope.apply();
        readView(element, scope);
      } else if (esc) {
        event.preventDefault();
        byEsc = true;
        readView(element, scope);
      }
    };
  }
  exports = module.exports = todo;
});

define("river.grammer.main", function(exports, require, module) {
  "use strict";
  function show(element, todos) {
    if (!todos.length) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
  function main(str, scope, element) {
    show(element, scope.todos);
    scope.onchange("todos", function(todos) {
      show(element, todos);
    });
  }
  exports = module.exports = main;
});