/// <reference path="../node_modules/backendless/libs/backendless.d.ts" />
/// <reference path="./helpers.ts" />
/// <reference path="./app.ts" />
/// <reference path="./todo-model.ts" />
/// <reference path="./todos-list.ts" />
var todoItemTemplate = document.querySelector('#todo-item').innerHTML;
var TodoView = (function () {
    function TodoView(data, todosList) {
        this.data = data;
        this.todosList = todosList;
        this.template = todoItemTemplate;
        var self = this;
        this.el = document.createElement('LI');
        this.el.innerHTML = this.template;
        this.toggler = this.el.querySelector('.toggle');
        this.destroyBtn = this.el.querySelector('.destroy');
        this.label = this.el.querySelector('label');
        this.editInput = this.el.querySelector('.edit');
        this.destroyBtn.addEventListener('click', function () {
            self.destroy();
        });
        this.toggler.addEventListener('change', function (e) {
            self.updateCompleted(e.currentTarget.checked);
        });
        this.label.addEventListener('dblclick', function () {
            self.enableEdit();
        });
        this.updateTitle(this.data.title);
        this.updateCompleted(this.data.completed);
    }
    TodoView.prototype.enableEdit = function () {
        var self = this;
        addClass(self.el, 'editing');
        this.editInput.focus();
        this.editInput.addEventListener('blur', finishEditing);
        this.editInput.addEventListener('keypress', onEditInputKeyPress);
        this.editInput.addEventListener('keydown', onEditInputKeyDown);
        function finishEditing() {
            var title = self.editInput.value.trim();
            if (title) {
                self.updateTitle(title);
                self.save();
                disableEdit();
            }
            else {
                self.destroy();
            }
        }
        function onEditInputKeyPress(e) {
            if (e.which === ENTER_KEY) {
                self.editInput.blur();
            }
        }
        function onEditInputKeyDown(e) {
            if (e.which === ESC_KEY) {
                disableEdit();
            }
        }
        function disableEdit() {
            removeClass(self.el, 'editing');
            self.editInput.value = self.data.title;
            self.editInput.removeEventListener('blur', finishEditing);
            self.editInput.removeEventListener('keypress', onEditInputKeyPress);
            self.editInput.removeEventListener('keydown', onEditInputKeyDown);
        }
    };
    TodoView.prototype.updateCompleted = function (completed) {
        if (this.data.completed !== completed) {
            this.data.completed = completed;
            this.save();
        }
        this.toggler.checked = this.data.completed;
        toggleClass(this.el, 'completed', this.data.completed);
        this.toggle();
    };
    TodoView.prototype.updateTitle = function (title) {
        this.data.title = title;
        this.label.innerText = title;
        this.editInput.value = title;
    };
    TodoView.prototype.save = function () {
        //update todo item on the server, use Backendless.Async for asynchronous request
        TodoStorage.save(this.data, new Backendless.Async());
        this.todosList.onTodoCompleteChange();
    };
    TodoView.prototype.destroy = function () {
        //delete todo item on the server, use Backendless.Async for asynchronous request
        TodoStorage.remove(this.data, new Backendless.Async());
        this.todosList.onTodoDestroy(this);
    };
    TodoView.prototype.toggle = function () {
        var isHidden = this.data.completed ? this.todosList.filter === 'active' : this.todosList.filter === 'completed';
        toggleClass(this.el, 'hidden', isHidden);
    };
    return TodoView;
}());
