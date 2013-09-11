var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        _super.apply(this, arguments);

    }
    Todo.prototype.defaults = function () {
        return {
            content: '',
            done: false
        };
    };
    Todo.prototype.initialize = function () {
        if(!this.get('content')) {
            this.set({
                'content': this.defaults().content
            });
        }
    };
    Todo.prototype.toggle = function () {
        this.save({
            done: !this.get('done')
        });
    };
    Todo.prototype.clear = function () {
        this.destroy();
    };
    return Todo;
})(Backbone.Model);
var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        _super.apply(this, arguments);

        this.model = Todo;
        this.localStorage = new Store('todos-typescript-backbone');
    }
    TodoList.prototype.done = function () {
        return this.filter(function (todo) {
            return todo.get('done');
        });
    };
    TodoList.prototype.remaining = function () {
        return this.without.apply(this, this.done());
    };
    TodoList.prototype.nextOrder = function () {
        if(!length) {
            return 1;
        }
        return this.last().get('order') + 1;
    };
    TodoList.prototype.comparator = function (todo) {
        return todo.get('order');
    };
    return TodoList;
})(Backbone.Collection);
var Todos = new TodoList();
var TodoView = (function (_super) {
    __extends(TodoView, _super);
    function TodoView(options) {
        this.tagName = 'li';
        this.events = {
            'click .check': 'toggleDone',
            'dblclick label.todo-content': 'edit',
            'click button.destroy': 'clear',
            'keypress .todo-input': 'updateOnEnter',
            'blur .todo-input': 'close'
        };
        _super.call(this, options);
        this.template = _.template($('#item-template').html());
        _.bindAll(this, 'render', 'close', 'remove');
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
    }
    TodoView.ENTER_KEY = 13;
    TodoView.prototype.render = function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.todo-input');
        return this;
    };
    TodoView.prototype.toggleDone = function () {
        this.model.toggle();
    };
    TodoView.prototype.edit = function () {
        this.$el.addClass('editing');
        this.input.focus();
    };
    TodoView.prototype.close = function () {
        this.model.save({
            content: this.input.val()
        });
        this.$el.removeClass('editing');
    };
    TodoView.prototype.updateOnEnter = function (e) {
        if(e.keyCode == TodoView.ENTER_KEY) {
            close();
        }
    };
    TodoView.prototype.clear = function () {
        this.model.clear();
    };
    return TodoView;
})(Backbone.View);
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView() {
        _super.call(this);
        this.events = {
            'keypress #new-todo': 'createOnEnter',
            'click .todo-clear button': 'clearCompleted',
            'click .mark-all-done': 'toggleAllComplete'
        };
        this.setElement($('#todoapp'), true);
        _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');
        this.input = this.$('#new-todo');
        this.allCheckbox = this.$('.mark-all-done')[0];
        this.mainElement = this.$('#main')[0];
        this.footerElement = this.$('#footer')[0];
        this.statsTemplate = _.template($('#stats-template').html());
        Todos.bind('add', this.addOne);
        Todos.bind('reset', this.addAll);
        Todos.bind('all', this.render);
        Todos.fetch();
    }
    AppView.prototype.render = function () {
        var done = Todos.done().length;
        var remaining = Todos.remaining().length;
        if(Todos.length) {
            this.mainElement.style.display = 'block';
            this.footerElement.style.display = 'block';
            this.$('#todo-stats').html(this.statsTemplate({
                total: Todos.length,
                done: done,
                remaining: remaining
            }));
        } else {
            this.mainElement.style.display = 'none';
            this.footerElement.style.display = 'none';
        }
        this.allCheckbox.checked = !remaining;
    };
    AppView.prototype.addOne = function (todo) {
        var view = new TodoView({
            model: todo
        });
        this.$('#todo-list').append(view.render().el);
    };
    AppView.prototype.addAll = function () {
        Todos.each(this.addOne);
    };
    AppView.prototype.newAttributes = function () {
        return {
            content: this.input.val(),
            order: Todos.nextOrder(),
            done: false
        };
    };
    AppView.prototype.createOnEnter = function (e) {
        if(e.keyCode != 13) {
            return;
        }
        Todos.create(this.newAttributes());
        this.input.val('');
    };
    AppView.prototype.clearCompleted = function () {
        _.each(Todos.done(), function (todo) {
            return todo.clear();
        });
        return false;
    };
    AppView.prototype.toggleAllComplete = function () {
        var done = this.allCheckbox.checked;
        Todos.each(function (todo) {
            return todo.save({
                'done': done
            });
        });
    };
    return AppView;
})(Backbone.View);
$(function () {
    new AppView();
});
