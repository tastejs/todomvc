/*global define */
/*jslint sloppy: true,unparam: true*/
define(function () {
    var ENTER_KEY = 13,
        ESCAPE_KEY = 27;

    return {
        'todo-visible': function () {
            return {
                visible: this.items().length > 0
            };
        },
        'todo-input': function () {
            var addItem = this.addItem;
            return {
                value: this.newItem,
                valueUpdate: 'afterkeydown',
                event: {
                    keyup: function (data, e) {
                        if (e.keyCode === ENTER_KEY) {
                            addItem();
                        }
                    }
                }
            };
        },
        'todo-item': function () {
            return {
                css: {
                    completed: this.completed,
                    editing: this.editMode
                },
                event: {
                    dblclick: this.beginEdit
                }
            };
        },
        'todo-edit': function () {
            var item = this;

            return {
                value: this.title,
                valueUpdate: 'afterkeydown',
                event: {
                    keyup: function (data, e) {
                        if (e.keyCode === ENTER_KEY) {
                            item.endEdit();
                        } else if (e.keyCode === ESCAPE_KEY) {
                            item.cancelEdit();
                        }
                    },
                    blur: function () {
                        item.endEdit();
                    }
                },
                hasFocus: this.editMode
            };
        },
        'todo-count-text': function () {
            return {
                text: (this.items().length === 1 ? 'item' : 'items') + ' left'
            };
        },
        'todo-clear-completed': function () {
            return {
                visible: this.completedItems().length > 0,
                text: 'Clear completed (' + this.completedItems().length + ')',
                click: this.removeCompletedItems
            };
        },
        'todo-view': function (ctx) {
            return {
                text: this.name,
                click: this.raiseEvent,
                css: { selected: ctx.$parent.currentView() === this.name }
            };
        }
    };
});
