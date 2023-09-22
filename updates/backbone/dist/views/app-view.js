/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
var app = app || {};

(function ($) {
    "use strict";

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    app.AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: ".todoapp",

        // Our template for the line of statistics at the bottom of the app.
        statsTemplate: _.template($("#stats-template").html()),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress .new-todo": "createOnEnter",
            "click .clear-completed": "clearCompleted",
            "click .toggle-all": "toggleAllComplete",
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function () {
            this.allCheckbox = this.$(".toggle-all")[0];
            this.$input = this.$(".new-todo");
            this.$footer = this.$(".footer");
            this.$main = this.$(".main");
            this.$list = $(".todo-list");

            this.listenTo(app.todos, "add", this.addOne);
            this.listenTo(app.todos, "reset", this.addAll);
            this.listenTo(app.todos, "change:completed", this.filterOne);
            this.listenTo(app.todos, "filter", this.filterAll);
            this.listenTo(app.todos, "all", _.debounce(this.render, 0));

            // initially hide main and footer section
            this.$main.hide();
            this.$footer.hide();

            // Suppresses 'add' events with {reset: true} and prevents the app view
            // from being re-rendered for every model. Only renders when the 'reset'
            // event is triggered at the end of the fetch.
            app.todos.fetch({ reset: true });
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function () {
            const completed = app.todos.completed().length;
            const remaining = app.todos.remaining().length;

            if (app.todos.length) {
                this.$main.show();
                this.$footer.show();

                this.$footer.html(
                    this.statsTemplate({
                        completed: completed,
                        remaining: remaining,
                    })
                );

                this.$(".filters li a")
                    .removeClass("selected")
                    .filter(`[href="#/${app.TodoFilter || ""}"]`)
                    .addClass("selected");
            } else {
                this.$main.hide();
                this.$footer.hide();
            }

            this.allCheckbox.checked = !remaining;
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function (todo) {
            const view = new app.TodoView({ model: todo });
            const $el = view.render().$el;
            this.$list.append($el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function () {
            this.$list.html("");
            app.todos.each(this.addOne, this);
        },

        filterOne: function (todo) {
            todo.trigger("visible");
        },

        filterAll: function () {
            app.todos.each(this.filterOne, this);
        },

        // Generate the attributes for a new Todo item.
        newAttributes: function () {
            return {
                title: this.$input.val().trim(),
                order: app.todos.nextOrder(),
                completed: false,
            };
        },

        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *memory*.
        createOnEnter: function (e) {
            if (e.which === ENTER_KEY && this.$input.val().trim()) {
                app.todos.create(this.newAttributes());
                this.$input.val("");
            }
        },

        // Clear all completed todo items, destroying their models.
        clearCompleted: function () {
            _.invoke(app.todos.completed(), "destroy");
            return false;
        },

        toggleAllComplete: function () {
            const completed = this.allCheckbox.checked;

            app.todos.each(function (todo) {
                todo.save({
                    completed: completed,
                });
            });
        },
    });
})(jQuery);
