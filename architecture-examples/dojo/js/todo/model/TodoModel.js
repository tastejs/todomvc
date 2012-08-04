define(["dojo/_base/declare", "dojox/mvc/StatefulModel", "todo/store/LocalStorage", "dojox/mvc", "dojo/_base/lang", "dojo/_base/array"],
    function(declare, StatefulModel, LocalStorage, mvc, lang, array) {

    return declare([StatefulModel], {
        /**
         * Default model structure, overriden by any
         * items found in localStorage.
         */
        data: {
            id: "todos-dojo",
            todos : [],
            incomplete: 0,
            complete: 0
        },

        /**
         * Initialise our custom dojo store, backed by localStorage. This will be
         * used to read the initial items, if available, and persist the current items
         * when the application finishes.
         */
        store: new LocalStorage(),

        constructor: function () {
            /**
             * Attempt to read todo items from localStorage,
             * returning default value the first time the application
             * is loaded... The "id" parameter is used as the unique
             * localStorage key for this object.
             */
            var data = this.store.get(this.data.id) || this.data;
            this._createModel(data);

            this.setUpModelBinding();
            this.updateTotalItemsLeft();
        },

        setUpModelBinding: function () {
            /**
             * Set up a composite model attribute, "complete", that is automatically
             * calculated whenever the "incomplete" source value is modified. The "complete"
             * attribute is bound to a view widget, displaying the number of items that can
             * be cleared using the link.
             */
            mvc.bind(this.incomplete, "value", this.complete, "value", lang.hitch(this, function (value) {
                return this.todos.get("length") - value;
            }));

            /**
             * Bind all pre-populated todo items to update the
             * total item values when the "completed" attribute is changed.
             */
            array.forEach(this.todos, lang.hitch(this, "bindItemProps"));

            /**
             * Whenever the "todos" array is modified, an element is added
             * or deleted, we need to recompute the model composite values.
             * Binding attributes changes to the "onTodosModelChange" function
             * using "watch", an attribute on dojo.Stateful objects.
             */
            this.todos.watch(lang.hitch(this, "onTodosModelChange"));
        },

        /**
         * Set up binding on a todo item, so that when the
         * item's checked attribute changes, we re-calculate
         * the composite model attribute's value, "complete".
         *
         * We also need to remove any tasks with empty titles.
         */
        bindItemProps: function (item) {
            mvc.bindInputs([item.completed], lang.hitch(this, "updateTotalItemsLeft"));
            mvc.bindInputs([item.title], lang.hitch(window, setTimeout, lang.hitch(this, "deleteEmptyTasks")));
        },

        /**
         * Search through current tasks list, removing all
         * with empty titles.
         */
        deleteEmptyTasks: function () {
            var len = this.todos.length, idx = 0;

             while (idx < len) {
                 if (!this.todos[idx].title.value.length) {
                     this.todos.remove(idx);
                     len--;
                     continue;
                 }
                 idx++;
             }
        },

        /**
         * When todos array is modified, we need to update the composite
         * value attributes. If the modification was an addition, ensure the
         * "completed" attribute is being watched for updates.
         */
        onTodosModelChange: function (prop, oldValue, newValue) {
            this.updateTotalItemsLeft();

            if (typeof prop === "number" && !oldValue && newValue) {
                this.bindItemProps(newValue);
            }
        },

        /**
         * Update the model's "incomplete" value with the
         * total number of items not finished. This will automatically
         * cause the bound "complete" value to be updated as well.
         */
        updateTotalItemsLeft: function () {
            this.incomplete.set("value", array.filter(this.todos, function (item) {
                return item && !item.completed.value;
            }).length);
        }
    });
});
