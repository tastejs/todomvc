<<<<<<< HEAD
define(["js/core/Application", "js/core/I18n", "app/model/Todo", "app/collection/TodoList", "js/data/FilterDataView", "js/data/LocalStorageDataSource"],
    function (Application, I18n, Todo, TodoList, FilterDataView, DataSource) {
=======
define(["js/core/Application", "js/core/I18n", "app/model/Todo", "app/collection/TodoList", "js/data/ListView"],
    function (Application, I18n, Todo, TodoList, ListView) {
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36

        var ENTER_KEY = 13;

        return Application.inherit("app.TodoClass", {
<<<<<<< HEAD
=======
            inject: {
                i18n: I18n
            },
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
            /**
             * Initializes the app
             * In this method we set the initial models
             */
            initialize: function () {
<<<<<<< HEAD
                this.set("todoList", null);
                this.set("filterList", null);
                this.callBase();
=======

                this.set("todoList", new TodoList());
                this.set("filterList", new ListView({
                    list: this.get("todoList"),
                    filter: 'all',
                    filterFnc: function (item) {
                        var filter = this.$.filter;
                        if (filter == "active") {
                            return !item.isCompleted();
                        } else if (filter == "completed") {
                            return item.isCompleted();
                        } else {
                            return true;
                        }
                    }}));
                this.set("newTodo", new Todo());
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
            },
            /**
             * Are triggered
             */
            showAll: function () {
                this.$.filterList.set("filter", 'all');
            },
            showActive: function () {
                this.$.filterList.set("filter", "active");
            },
            showCompleted: function () {
                this.$.filterList.set("filter", "completed");
            },
<<<<<<< HEAD
            /**
             * The rest is just controller stuff
             */
            addNewTodo: function (e, input) {
                if (e.$.keyCode === ENTER_KEY) {
                    var title = input.get("value").trim();
                    if (title) {
                        var newTodo = this.$.dataSource.createEntity(Todo);
                        newTodo.set({title: title, completed: false});
                        this.get("todoList").add(newTodo);

                        // save the new item
                        newTodo.save();

                        input.set('value','');
=======
            isStringEqual: function (route, filter) {
                return route == filter;
            },
            /**
             * The rest is just controller stuff
             */
            addNewTodo: function (e) {
                if (e.$.keyCode === ENTER_KEY) {
                    var tmp = this.get("newTodo");
                    if (tmp.hasTitle()) {
                        var newTodo = new Todo({title: tmp.get("title")});
                        newTodo.setCompleted(false);
                        this.get("todoList").add(newTodo);
                        tmp.set("title", "");
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
                    }
                }
            },
            markAllComplete: function (e, input) {
<<<<<<< HEAD
                this.get("todoList").markAll(input.$el.checked);
=======
                this.get("todoList").markAll(input.get("checked"));
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
            },
            clearCompleted: function () {
                this.get("todoList").clearCompleted();
            },
            removeTodo: function (e) {
<<<<<<< HEAD
                var todo = e.$, self = this;
                todo.remove(null, function(err){
                    if(!err){
                        self.get("todoList").remove(todo);
                    }
                });
=======
                this.get("todoList").remove(e.$);
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
            },
            /**
             * Start the application and render it to the body ...
             */
            start: function (parameter, callback) {
<<<<<<< HEAD
                this.set('todoList', this.$.dataSource.createCollection(TodoList));

                // fetch all todos, can be done sync because we use localStorage
                this.$.todoList.fetch();

                this.set('filterList', new FilterDataView({
                    baseList: this.get("todoList"),
                    filter: 'all',
                    filterFnc: function (item) {
                        var filter = this.$.filter;
                        if (filter == "active") {
                            return !item.isCompleted();
                        } else if (filter == "completed") {
                            return item.isCompleted();
                        } else {
                            return true;
                        }
                    }}));

                // false - disables autostart
                this.callBase(parameter, false);

                // load locale and start by calling callback
                this.$.i18n.loadLocale("en_EN", callback);
            },
            // compares 2 strings
            isStringEqual: function (str1, str2) {
                return str1 == str2;
=======
                // false - disables autostart
                this.callBase(parameter, false);

                this.$.i18n.set("locale", "en_EN", {silent: true});
                this.$.i18n.loadLocale("en_EN", callback);
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
            }
        });
    });