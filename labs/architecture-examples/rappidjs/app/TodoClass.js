var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("app.TodoClass",
        ["js.core.Application", "js.core.I18n", "app.model.Todo", "app.collection.TodoList"],
        function (Application, I18n, Todo, TodoList) {

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
                    this.set("newTodo", new Todo());
                    this.set("locales",["en_EN","de_DE"]);
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
                        this.get("hint").set("visible", false);
                    } else {
                        // some hint stuff
                        var hint = this.get("hint");
                        if (!hint.get("visible")) {
                            setTimeout(function () {
                                hint.set("visible", true);

                                setTimeout(function () {
                                    hint.set("visible", false);
                                }, 2000);
                            }, 400);
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

                    this.$.i18n.set("locale","en_EN",{silent: true});
                    this.$.i18n.loadLocale("en_EN", callback);
                }
            });
        }
    );
});