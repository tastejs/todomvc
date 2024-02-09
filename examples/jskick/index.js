// Import stylesheets
import "todomvc-common/base.css";
import "todomvc-app-css/index.css";
import "./style.css";
import kick from "jskick";

var vm = {
  current: "",
  todos: [],
  filteredTodos: [],
  hasTodos: false,
  allCompleted: false,
  remainingCount: 0,
  completedCount: 0,
  showFooter: false,
  mode: "all",
  showMode(mode) {
    return mode === vm.mode;
  },
  setMode(mode) {
    vm.mode = mode;
    vm.filter();
    return false;
  },
  count() {
    vm.filter();
    return vm.remainingCount;
  },
  add() {
    if (vm.current.length) {
      vm.todos.push({
        title: vm.current,
        completed: false
      });
      vm.current = "";
      vm.filter();
      vm.hasTodos = vm.todos.length > 0;
    }
  },
  editItem(todo) {
    vm.oldTitle = todo.title;
    todo.editing = true;
  },
  saveEditing(todo) {
    todo.editing = false;
  },
  cancelEditing(todo) {
    todo.title = vm.oldTitle;
    todo.editing = false;
  },
  remove(todo) {
    let idx = vm.todos.indexOf(todo);
    if (idx > -1) {
      vm.todos.splice(idx, 1);
    }
    vm.hasTodos = vm.todos.length > 0;
    vm.filter();
  },
  filter(todo) {
    vm.filteredTodos = vm.todos.filter(x => {
      switch (vm.mode) {
        case "active":
          return !x.completed;
        case "completed":
          return x.completed;
        default:
          return true;
      }
    });
    vm.completedCount = vm.todos.filter(x => x.completed).length;
    vm.remainingCount = vm.todos.length - vm.completedCount;

    vm.showFooter = vm.completedCount > 0 || vm.remainingCount > 0;
  },
  removeCompleted() {
    vm.todos = vm.todos.filter(x => !x.completed);
    vm.filter();
  },
  markCompleted() {
    if (vm.allCompleted) {
      vm.todos.forEach(x => {
        x.completed = true;
      });
      vm.filter();
      vm.allCompleted = false;
    }
  },
  getLabel(count) {
    return count === 1 ? "item" : "items";
  }
};

kick.keyUpBinder = function(key) {
  kick.binders["^#" + key.toLowerCase()] = {
    bind: function(el) {
      var view = this;
      view.keyEvHandler =
        view.keyEvHandler ||
        (ev => {
          if (ev.key === key) {
            let processedArgs = view.parseFormatterArguments(
              view.fnArgs,
              0,
              null,
              view.view.models
            );
            let handler = view.observer.value();
            handler && handler.apply(view, processedArgs);
          }
        });
      if (!view.keyEv) {
        view.keyEv = el.addEventListener("keyup", event =>
          view.keyEvHandler(event)
        );
      }
    },
    unbind: function(el) {
      this.keyEv && el.removeEventListener("keyup", this.keyEv);
    },
    function: true
  };
};

const ENTER_KEY = "Enter";
const ESCAPE_KEY = "Escape";
kick.keyUpBinder(ENTER_KEY);
kick.keyUpBinder(ESCAPE_KEY);

// you may say '[kick-app] or '#kickApp' or 'body' or ...
kick.bind("", vm);
