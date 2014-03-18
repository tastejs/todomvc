define("app", function(exports, require, module) {
  (function(window) {
    "use strict";
  })(window);
});

define("controller.todos", function(exports, require, module) {
  "use strict";
  var model = require("model.local"), todos = exports.todos = model.get();
  exports.newtodo = "";
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
  exports.add = function(event) {
    if (event.keyCode === 13 && exports.newtodo) {
      todos.unshift({
        desc: exports.newtodo,
        status: "active"
      });
      exports.newtodo = "";
      save(todos);
    }
  };
  exports.remove = function(todo) {
    var index = todos.indexOf(todo);
    todos.splice(index, 1);
    save(todos);
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
  function footer(str, scope, element) {
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

define("river.grammer.todo", function(exports, require, module) {
  "use strict";
  var route = require("util.route"), ctrl = require("controller.todos");
  function status(scope) {
    return scope.todo.status;
  }
  function writeView(element) {
    var t = element.className;
    element.className = t + " editing";
    element.querySelector(".edit").focus();
  }
  function readView(element, scope) {
    var t = element.className;
    element.className = t.replace(/\sediting/, "");
    ctrl.save(scope.todos);
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
      writeView(element);
    };
    editinput.addEventListener("blur", function() {
      readView(element, scope);
    });
    editinput.onkeydown = function(event) {
      var enter = event.keyCode === 13 || false;
      var esc = event.keyCode === 27 || false;
      if (enter || esc) {
        readView(element, scope);
      }
    };
  }
  exports = module.exports = todo;
});