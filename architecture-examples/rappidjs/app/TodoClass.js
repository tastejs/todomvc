var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("app.TodoClass",
        ["js.core.Application", "js.core.I18n", "app.model.Todo", "app.collection.TodoList", "js.data.ListView"],
        function (Application, I18n, Todo, TodoList, ListView) {

            return Application.inherit({
                inject:{
                    i18n:I18n
                },
                /**
                 * Initializes the app
                 * In this method we set the initial models
                 */
                initialize:function () {

                    this.set("todoList", new TodoList());
                    this.set("filterList", new ListView({
                        list:this.get("todoList"),
                        filter:'all',
                        filterFnc:function (item) {
                            var f = this.$.filter;
                            if (f == "active") {
                                return !item.get("isDone");
                            } else if (f == "completed") {
                                return item.get("isDone");
                            } else {
                                return true;
                            }
                        }}));
                    this.set("newTodo", new Todo());
                    this.set("locales", ["en_EN", "de_DE"]);
                },
                /**
                 * Are triggered
                 */
                showAll:function () {
                    console.log("show all");
                    this.$.filterList.set("filter", 'all');
                },
                showActive:function () {
                    console.log("show active");
                    this.$.filterList.set("filter", "active");
                },
                showCompleted:function () {
                    console.log("show completed");
                    this.$.filterList.set("filter", "completed");
                },
                isStringEqual:function (route, filter) {
                    return route == filter;
                },
                /**
                 * The rest is just controller stuff
                 */
                addNewTodo:function (e) {
                    if (e.$.keyCode === 13) {
                        var tmp = this.get("newTodo");
                        if (tmp.hasContent()) {
                            var newTodo = new Todo({content:tmp.get("content")});
                            newTodo.setDone(false);
                            this.get("todoList").add(newTodo);
                            tmp.set("content", "");
                        }
                    }
                },
                markAllComplete:function (e, input) {
                    this.get("todoList").markAll(input.get("checked"));
                },
                clearCompleted:function (e) {
                    this.get("todoList").clearCompleted();
                },
                removeTodo:function (e, el) {
                    this.get("todoList").remove(e.$);
                },
                sort:function () {
                    this.get("todoList").sort(function (t1, t2) {
                        if (t1.get("isDone") && t2.get("isDone")) {
                            return 0;
                        } else if (t1.get("isDone") === true && !t2.get("isDone")) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                },
                /**
                 * Start the application and render it to the body ...
                 */
                start:function (parameter, callback) {
                    // false - disables autostart
                    this.callBase(parameter, false);

                    this.$.i18n.set("locale", "en_EN", {silent:true});
                    this.$.i18n.loadLocale("en_EN", callback);
                }
            });
        }
    );
});