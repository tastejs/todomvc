/**
* Original source from https://gist.github.com/880822
* Converted to AMD-baseless format
*/
define(["dojo/_base/declare",
        // Parent classes
        "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        // General application modules
        "dojo/_base/lang", "dojo/_base/event", "dojo/on", "dojo/dom-class", "dojo/dom-attr", "dojox/mvc", "todo/model/TodoModel",
        // Widget template
        "dojo/text!./app.html",
        // Template Widgets
        "dijit/InlineEditBox", "todo/form/CheckBox", "dojox/mvc/Group", "dojox/mvc/Repeat", "dojox/mvc/Output"],
    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, _event, on, domClass, domAttr, mvc, TodoModel, template) {

    return declare("todo.app", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,

        constructor: function () {
            /**
             * Create new application Model class, this will be used to bind
             * the UI elements to the data store items. Pre-populate model with
             * items from localStorage if they exist...
             */
            this.model = new TodoModel();

            /**
             * The method below set up a function binding to the composite (complete & incomplete)
             * model attributes. These values are used to append CSS classes to dynamically show & hide
             * the "stats" elements when the model is non-empty and has some completed items. Whenever
             * the values below are updated, the function will be executed.
             */
            mvc.bindInputs([this.model.complete, this.model.incomplete], lang.hitch(this, "onItemStatusUpdate"));

            /**
             * Hook into unload event to trigger persisting
             * of the current model contents into the localStorage
             * backed data store.
             */
            window.onbeforeunload = lang.hitch(this, function () {
                this.model.commit();
            });
        },

        /**
         * Listen for item remove events from the using event delegation,
         * we don't have to attach to each item. Also, ensure todo-stats
         * have the correct initial CSS classes given the starting model
         * contents.
         */
        postCreate: function () {
            on(this.domNode, ".todo-destroy:click", lang.hitch(this, "onRemove"));
            this.onItemStatusUpdate();
        },

        /**
         * Remove all items that have been completed from
         * model. We have to individually check each todo
         * item, removing if true.
         */
        removeCompletedItems: function () {
            var len = this.model.todos.length, idx = 0;

            /**
             * Removing array indices from a Dojo MVC Model
             * array left-shifts the remaining items. When
             * we find an item to remove, don't increment the
             * index and, instead, decrement the total item count.
             */
             while (idx < len) {
                 if (this.model.todos[idx].isDone.value) {
                     this.model.todos.remove(idx);
                     len--;
                     continue;
                 }
                 idx++;
             }
        },

        /**
         * Add new a new todo item as the last element
         * in the parent model.
         */
        addToModel: function (content, isDone) {
            var insert = mvc.newStatefulModel({
                data: {todo_text: content, isDone: isDone}
            });

            this.model.todos.add(this.model.todos.length, insert);
        },

        /**
         * Adjust CSS classes on todo-stats element based upon whether
         * we a number of completed and incomplete todo items.
         */
        onItemStatusUpdate: function () {
            domClass.toggle(this.todo_stats, "items_selected", this.model.complete.value > 0);
            domClass.toggle(this.todo_stats, "items_present", this.model.todos.get("length"));
        },

        /**
         * Handle key press events for the todo input
         * field. If user has pressed enter, add current
         * text value as new todo item in the model.
         */
        onKeyPress: function (event) {
            if (event.keyCode !== 13) return;

            this.addToModel(event.target.value, false);
            event.target.value = "";
			_event.stop(event);
        },

        /**
         * Event handler when user has clicked to
         * remove a todo item, just remove it from the
         * model using the item identifier.
         **/
        onRemove: function (event) {
            this.model.todos.remove(domAttr.get(event.target, "data-model-id"));
        }
    });
});
