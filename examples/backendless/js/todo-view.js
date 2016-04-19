/**
 * @class TodoView
 * @summary View of Todo item
 */
var TodoView = (function() {
  function TodoView(todo, todosList) {
    var todoView = this;

    this.data = todo;
    this.todosList = todosList;

    this.el = document.createElement('LI');
    this.el.innerHTML = this.template;

    this.toggler = this.el.querySelector('.toggle');
    this.destroyBtn = this.el.querySelector('.destroy');
    this.label = this.el.querySelector('label');
    this.editInput = this.el.querySelector('.edit');

    this.destroyBtn.addEventListener('click', function() {
      todoView.destroy();
    });

    this.toggler.addEventListener('change', function(e) {
      todoView.updateCompleted(e.currentTarget.checked);
    });

    this.label.addEventListener('dblclick', function() {
      todoView.enableEdit();
    });

    this.updateTitle(this.data.title);
    this.updateCompleted(this.data.completed);
  }

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
        todoView.editInput.blur();
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

    this.todosList.onTodoCompleteChange();
  };

  TodoView.prototype.destroy = function() {
    //delete todo item on the server, use Backendless.Async for asynchronous request
    TodoStorage.remove(this.data, new Backendless.Async());

    this.todosList.onTodoDestroy(this);
  };

  TodoView.prototype.toggle = function(filter) {
    var isHidden = this.data.completed ? this.todosList.filter === 'active' : this.todosList.filter === 'completed';

    toggleClass(this.el, 'hidden', isHidden);
  };

  return TodoView;
})();
