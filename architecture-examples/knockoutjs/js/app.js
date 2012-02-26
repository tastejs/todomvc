(function () {
    //trim polyfill
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    //a custom binding to handle the enter key (could go in a separate library)
    ko.bindingHandlers.enterKey = {
        init:function (element, valueAccessor, allBindingsAccessor, data) {
            var wrappedHandler, newValueAccessor;

            //wrap the handler with a check for the enter key
            wrappedHandler = function (data, event) {
                if (event.keyCode === 13) {
                    valueAccessor().call(this, data, event);
                }
            };

            //create a valueAccessor with the options that we would want to pass to the event binding
            newValueAccessor = function () {
                return { keyup:wrappedHandler };
            };

            //call the real event binding's init function
            ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
        }
    };

    //select text when element is focused
    ko.bindingHandlers.select = {
        init:function (element) {
            var handler = function () {
                element.select();
            };

            ko.utils.registerEventHandler(element, "focus", handler);
        }
    };

    //alternative to "visible" binding that will specifically set "block" to override what is in css
    ko.bindingHandlers.block = {
        update:function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            element.style.display = value ? "block" : "none";
        }
    };

    //alternative to "visible" binding that will specifically set "inline" to override what is in css
    ko.bindingHandlers.inline = {
        update:function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            element.style.display = value ? "inline" : "none";
        }
    };

    //represent a single todo item
    var Todo = function (content, done) {
        this.content = ko.observable(content);
        this.done = ko.observable(done);
        this.editing = ko.observable(false);
    };

    //can place methods on prototype, as there can be many todos
    ko.utils.extend(Todo.prototype, {
        edit:function () {
            this.editing(true);
        },
        stopEditing:function () {
            this.editing(false);
        }
    });

    //our main view model
    var ViewModel = function (todos) {
        var self = this;
        //map array of passed in todos to an observableArray of Todo objects
        self.todos = ko.observableArray(ko.utils.arrayMap(todos, function (todo) {
            return new Todo(todo.content, todo.done);
        }));

        //store the new todo value being entered
        self.current = ko.observable();

        //add a new todo, when enter key is pressed
        self.add = function (data, event) {
            var newTodo, current = self.current().trim();
            if (current) {
                newTodo = new Todo(current);
                self.todos.push(newTodo);
                self.current("");
            }
        };

        //remove a single todo
        self.remove = function (todo) {
            self.todos.remove(todo);
        };

        //remove all completed todos
        self.removeCompleted = function () {
            self.todos.remove(function (todo) {
                return todo.done();
            });
        };

        //count of all completed todos
        self.completedCount = ko.computed(function () {
            return ko.utils.arrayFilter(self.todos(),
                function (todo) {
                    return todo.done();
                }).length;
        });

        //count of todos that are not complete
        self.remainingCount = ko.computed(function () {
            return self.todos().length - self.completedCount();
        });

        //writeable computed observable to handle marking all complete/incomplete
        self.allCompleted = ko.computed({
            //always return true/false based on the done flag of all todos
            read:function () {
                return !self.remainingCount();
            },
            //set all todos to the written value (true/false)
            write:function (newValue) {
                ko.utils.arrayForEach(self.todos(), function (todo) {
                    //set even if value is the same, as subscribers are not notified in that case
                    todo.done(newValue);
                });
            }
        });

        //helper function to keep expressions out of markup
        self.getLabel = function (count) {
            return ko.utils.unwrapObservable(count) === 1 ? "item" : "items";
        };

        //internal computed observable that fires whenever anything changes in our todos
        ko.computed(
            function () {
                //get a clean copy of the todos, which also creates a dependency on the observableArray and all observables in each item
                var todos = ko.toJS(self.todos);

                //store to local storage
                amplify.store("todos-knockout", todos);
            }).extend({ throttle:1000 }); //save at most once per second
    };

    //check local storage for todos
    var todos = amplify.store("todos-knockout");

    //bind a new instance of our view model to the page
    ko.applyBindings(new ViewModel(todos || []));
})();
