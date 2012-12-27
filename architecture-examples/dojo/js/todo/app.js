/**
* Original source from https://gist.github.com/880822
* Converted to AMD-baseless format
*/
define(["dojo/_base/declare",
        // Parent classes
        "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        // General application modules
        "dojo/_base/lang", "dojo/_base/event", "dojo/on", "dojo/dom-class", "dojo/dom-attr", "dojo/query", "dojo/string",
        "dijit/_base/manager", "dojo/keys", "dojox/mvc", "dojo/hash", "dojo/_base/connect", "todo/model/TodoModel",
        // Widget template
        "dojo/text!./app.html",
        // Template Widgets
        "todo/form/InlineEditBox", "todo/form/CheckBox", "dojox/mvc/Group", "dojox/mvc/Repeat", "dojox/mvc/Output"],
    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, _event, on, domClass, domAttr,
             query, str, manager, keys, mvc, hash, connect, TodoModel, template) {

    return declare("todo.app", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        /** Widget template HTML string */
        templateString: template,

        /** Hash state constants */
        ACTIVE: "/active",
        COMPLETED: "/completed",

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

            /** Connect to changes to the URI hash */
            connect.subscribe("/dojo/hashchange", this, "onHashChange");
        },

        /**
         * Listen for item remove events from the using event delegation,
         * we don't have to attach to each item. Also, ensure todo-stats
         * have the correct initial CSS classes given the starting model
         * contents.
         */
        postCreate: function () {
            on(this.domNode, ".destroy:click", lang.hitch(this, "onRemove"));
            on(this.domNode, ".view:dblclick", lang.hitch(this, "onEdit"));
            this.onItemStatusUpdate();
        },

        /**
         * Ensure application state reflects current
         * hash value after rendering model in the view.
         */
        startup: function () {
            this.inherited(arguments);
            this.onHashChange(hash());
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
                 if (this.model.todos[idx].completed.value) {
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
        addToModel: function (content, completed) {
            var insert = mvc.newStatefulModel({
                data: {title: content, completed: completed}
            });

            this.model.todos.add(this.model.todos.length, insert);
        },

        /**
         * Adjust CSS classes on todo-stats element based upon whether
         * we a number of completed and incomplete todo items.
         * Also verify state of the "Mark All" box.
         */
        onItemStatusUpdate: function () {
            var completed = this.model.complete.get("value"),
                length = this.model.todos.get("length");

            domClass.toggle(this.domNode, "todos_selected", completed > 0);
            domClass.toggle(this.domNode, "multiple", completed > 1);
            domClass.toggle(this.domNode, "todos_present", length);

            domAttr.set(this.mark_all, "checked", length && length === completed);

            setTimeout(lang.hitch(this, "onHashChange", hash()));
        },

        /**
         * Event fired when user selects the "Mark All" checkbox.
         * Update selection state of all the todos based upon current 
         * checked value.
         */
        onMarkAll: function () {
            var checked = this.mark_all.checked;

            for(var i = 0, len = this.model.todos.length; i < len; i++) {
                this.model.todos[i].completed.set("value", checked);
            }
        },

        /**
         * Handle key press events for the todo input
         * field. If user has pressed enter, add current
         * text value as new todo item in the model.
         */
        onKeyPress: function (event) {
            if (event.keyCode !== keys.ENTER ||
                !str.trim(event.target.value).length) {
                return;
            }

            this.addToModel(event.target.value, false);
            event.target.value = "";
			_event.stop(event);
        },

        /**
         * Event handler when user has clicked to
         * remove a todo item, just remove it from the
         * model using the item identifier.
         */
        onRemove: function (event) {
            this.model.todos.remove(domAttr.get(event.target, "data-model-id"));
        },

        /**
         * Whenever the user double clicks the item label,
         * set inline edit box to true.
         */
        onEdit: function (event) {
            query(".inline_edit", event.target).forEach(function (inline_edit) {
                manager.byNode(inline_edit).edit();
            });
        },

        /**
         * When the URI's hash value changes, modify the
         * displayed list items to show either completed,
         * remaining or all tasks.
         * Also highlight currently selected link value.
         */
        onHashChange: function (hash) {
            var showIfDone = (hash === this.COMPLETED ? false :
                (hash === this.ACTIVE? true : null));

            query("#todo-list > li").forEach(lang.hitch(this, function (item, idx) {
                var done = this.model.todos[idx].completed.get("value");
                domClass.toggle(item, "hidden", done === showIfDone);
            }));

            /** Normalise hash value to match link hrefs */
            hash = "#" + (showIfDone !== null ? hash : "/");

            query("#filters a").forEach(lang.hitch(this, function (link) {
                domClass.toggle(link, "selected", domAttr.get(link, "href") === hash);
            }));
        }
    });
});
