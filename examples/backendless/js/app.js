(function() {
  const ENTER_KEY = 13;
  const ESC_KEY = 27;

  /**
   * @constructor
   * @class Todo
   * @summary class of todo model
   *
   * @defaults:
   *  - @title {String} = '';
   *  - @completed {Boolean} = false;
   */
  function Todo(args) {
    this.title = args && args.title || '';
    this.completed = args && args.completed || false;
  }

  /**
   * @instance of {@class Backendless.DataStore}
   * @summary interface for manipulation with  data, create/update/save/delete todo items on the Backendless server
   */
  var TodoStorage = Backendless.Persistence.of(Todo);

  /**
   * @class TodoView
   * @summary View of Todo item
   */
  var TodoView = (function() {
    function TodoView(todo) {
      var todoView = this;

      this.data = todo;

      this.el = document.createElement('LI');
      this.el.innerHTML = this.template;

      this.toggler = this.el.querySelector('.toggle');
      this.destroyBtn = this.el.querySelector('.destroy');
      this.label = this.el.querySelector('label');
      this.editInput = this.el.querySelector('.edit');

      this.destroyBtn.addEventListener('click', this.destroy.bind(this));

      this.toggler.addEventListener('change', function(e) {
        todoView.updateCompleted(e.currentTarget.checked);
      });

      this.label.addEventListener('dblclick', this.enableEdit.bind(this));

      this.updateTitle(this.data.title);
      this.updateCompleted(this.data.completed);
    };

    TodoView.prototype.template = document.querySelector('#todo-item').innerHTML;

    TodoView.prototype.enableEdit = function() {
      var todoView = this;

      addClass(todoView.el, 'editing');

      this.editInput.focus();
      this.editInput.addEventListener('blur', finishEditing);
      this.editInput.addEventListener('keypress', onEditInputKeyPress);
      this.editInput.addEventListener('keydown', onEditInputKeyDown);

      function finishEditing() {
        var title = todoView.editInput.value.trim();

        if (title) {
          todoView.updateTitle(title);
          todoView.save();

          disableEdit();

        } else {
          todoView.destroy();
        }
      }

      function onEditInputKeyPress(e) {
        if (e.which === ENTER_KEY) {
          finishEditing()
        }
      }

      function onEditInputKeyDown(e) {
        if (e.which === ESC_KEY) {
          disableEdit();
        }
      }

      function disableEdit() {
        removeClass(todoView.el, 'editing');

        todoView.editInput.value = todoView.data.title;
        todoView.editInput.removeEventListener('blur', finishEditing);
        todoView.editInput.removeEventListener('keypress', onEditInputKeyPress);
        todoView.editInput.removeEventListener('keydown', onEditInputKeyDown);
      }
    };

    TodoView.prototype.updateCompleted = function(completed) {
      if (this.data.completed !== completed) {
        this.data.completed = completed
        this.save();
      }

      this.toggler.checked = this.data.completed;

      toggleClass(this.el, 'completed', this.data.completed);

      this.toggle();
    };

    TodoView.prototype.updateTitle = function(title) {
      this.data.title = title;
      this.label.innerText = title;
      this.editInput.value = title;
    };

    TodoView.prototype.save = function() {
      //update todo item on the server, use Backendless.Async for asynchronous request
      TodoStorage.save(this.data, new Backendless.Async());

      TodosList.onTodoCompleteChange();
    };

    TodoView.prototype.destroy = function() {
      //delete todo item on the server, use Backendless.Async for asynchronous request
      TodoStorage.remove(this.data, new Backendless.Async());

      TodosList.onTodoDestroy(this);
    };

    TodoView.prototype.toggle = function(filter) {
      var isHidden = this.data.completed ? TodosList.filter === 'active' : TodosList.filter === 'completed';

      toggleClass(this.el, 'hidden', isHidden);
    };

    return TodoView;
  })();

  /**
   * @namespace TodosList
   * @summary List of todos views
   */
  var TodosList = {
    el: document.querySelector('.todo-list'),

    todosViews: [],

    filter: null,

    init: function() {
      //retrieve todo items from the backendless server
      //code below load only todo item of current logged user
      //by default backendless server return only 10 item, we pass "options.pageSize:100" for retrieve the firest 100 items
      //also we pass "properties" for retrieve only needed fields of todo item
      var result = TodoStorage.find({
        properties: ['objectId', 'title', 'completed'],
        options   : {pageSize: 100, sortBy: 'created asc'}
      });

      for (var i = 0; i < result.data.length; i++) {
        this.renderItem(result.data[i]);
      }
    },

    createItem: function(todo) {
      this.renderItem(TodoStorage.save(new Todo(todo)));
    },

    renderItem: function(todoData) {
      var todoView = new TodoView(todoData);

      this.todosViews.push(todoView);
      this.el.appendChild(todoView.el);
    },

    removeItem: function(todoView) {
      this.el.removeChild(todoView.el);
      this.todosViews.splice(this.todosViews.indexOf(todoView), 1);
    },

    removeCompleted: function() {
      var toRemove = [];

      for (var i = 0; i < this.todosViews.length; i++) {
        if (this.todosViews[i].data.completed) {
          toRemove.push(this.todosViews[i]);
        }
      }

      for (var j = 0; j < toRemove.length; j++) {
        toRemove[j].destroy();
      }
    },

    getCounts: function() {
      var total = this.todosViews.length;
      var remains = 0;

      for (var i = 0; i < this.todosViews.length; i++) {
        if (!this.todosViews[i].data.completed) {
          remains++;
        }
      }

      return {total: total, remains: remains}
    },

    setFilter: function(filter) {
      this.filter = filter;

      for (var j = 0; j < this.todosViews.length; j++) {
        this.todosViews[j].toggle();
      }
    },

    toggleAll: function(completed) {
      for (var i = 0; i < this.todosViews.length; i++) {
        this.todosViews[i].updateCompleted(completed);
      }
    },

    onTodoCompleteChange: function() {
      App.updateState();
    },

    onTodoDestroy: function(todoView) {
      this.removeItem(todoView);

      App.updateState();
    }
  };

  /**
   * @namespace App
   * @summary main application object
   */
  var App = {
    mainEl          : document.querySelector('.main'),
    footerEl        : document.querySelector('.footer'),
    inputEl         : document.querySelector('.new-todo'),
    todoCountEl     : document.querySelector('.todo-count'),
    clearCompletedEl: document.querySelector('.clear-completed'),
    toggleAllBtn    : document.querySelector('.toggle-all'),
    routerButtons   : document.querySelectorAll('.filters a'),

    filter: null,

    start: function() {
      this.updateState();

      new Router({'/:filter': this.onRouterChange}).init('/all');

      //load exists items from the server and render them into DOM
      TodosList.init();

      this.updateState();

      this.inputEl.addEventListener('keypress', this.onInputKeyPress);
      this.toggleAllBtn.addEventListener('click', this.onTogglerAllBtnClick);
      this.clearCompletedEl.addEventListener('click', this.onClearCompletedClick);
    },

    updateState: function() {
      var todosCounts = TodosList.getCounts();
      var totalItems = todosCounts.total;
      var remainsItems = todosCounts.remains;

      this.mainEl.style.display = totalItems ? '' : 'none';
      this.footerEl.style.display = totalItems ? '' : 'none';
      this.clearCompletedEl.style.display = (totalItems - remainsItems) ? '' : 'none';

      this.toggleAllBtn.checked = !!totalItems && !remainsItems;

      this.todoCountEl.innerHTML = '<strong> ' + remainsItems + ' </strong>' + (remainsItems === 1 ? ' item' : ' items') + ' left';
    },

    onRouterChange: function(filter) {
      for (var i = 0; i < App.routerButtons.length; i++) {
        toggleClass(App.routerButtons[i], 'selected', (App.routerButtons[i].hash === '#/' + filter));
      }

      TodosList.setFilter(filter);
    },

    onInputKeyPress: function(e) {
      var title = App.inputEl.value.trim();

      if (e.which === ENTER_KEY && title) {
        TodosList.createItem({title: title});

        App.updateState();
        App.inputEl.value = '';
      }
    },

    onTogglerAllBtnClick: function(e) {
      TodosList.toggleAll(e.currentTarget.checked);
    },

    onClearCompletedClick: function() {
      TodosList.removeCompleted();
    }

  };

  App.start();

  /**
   * @type Function
   * @summary add class to DOM element
   *
   * @param el {HTMLElement}
   * @param className {String}
   */
  function addClass(el, className) {
    var classes = el.className.split(' ');

    if (classes.indexOf(className) === -1) {
      el.className = classes.concat([className]).join(' ');
    }
  }

  /**
   * @type Function
   * @summary add class to DOM element
   *
   * @param el {HTMLElement}
   * @param className {String}
   */
  function removeClass(el, className) {
    var classes = el.className.split(' ');

    if (classes.indexOf(className) !== -1) {
      classes.splice(classes.indexOf(className), 1);

      el.className = classes.join(' ');
    }
  }

  /**
   * @type Function
   * @summary toggle class for DOM element
   *
   * @param el {HTMLElement}
   * @param className {String}
   * @param add {Boolean}
   */
  function toggleClass(el, className, add) {
    if (add) {
      addClass(el, className);
    } else {
      removeClass(el, className);
    }
  }

})();