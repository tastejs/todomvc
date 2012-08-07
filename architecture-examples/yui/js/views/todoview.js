YUI.add('todo-view', function (Y) {
    "use strict";

    // -- Todo View -------------------
    var TodoView = Y.Base.create('todoView', Y.View, [], {

        // The container element that the View is rendered under.
        containerTemplate: '<li>',

        // Compile our template using Handlebars.
        template: Y.Handlebars.compile(Y.one('#item-template').getHTML()),

        // Bind DOM events for handling changes to a specific Todo,
        // for completion and editing.
        events: {
            '.toggle': {
                click: 'toggleComplete'
            },
            'label': {
                dblclick: 'edit'
            },
            '.edit': {
                blur: 'close',
                keypress: 'enterUpdate'
            },
            '.destroy': {
                click: 'clear'
            }
        },

        // Initialize this view by setting event handlers when the Model
        // is updated or destroyed.
        initializer: function () {
            var model = this.get('model');

            model.after('change', this.render, this);
        },

        // Render this view in our <li> container, and fill it with the
        // data in our Model.
        render: function () {
            var container = this.get('container'),
                model = this.get('model');

            container.setHTML(this.template(model.toJSON()));
            container.toggleClass('completed', model.get('completed'));

            this.set('inputNode', container.one('.edit'));

            return this;
        },

        // Toggle the linked Todo's completion status.
        toggleComplete: function () {
            this.get('model').toggle();
        },

        // Turn on editing mode for the Todo by exposing the input field.
        edit: function () {
            this.get('container').addClass('editing');
            this.get('inputNode').focus();
        },

        // Get the value from our input field while hiding it, and
        // save it to our Todo when focus is lost from the field.
        close: function (e) {
            var value = this.get('inputNode').get('value'),
                editedValue = Y.Escape.html(Y.Lang.trim(value));

            this.get('container').removeClass('editing');

            if (editedValue) {
                this.get('model').save({title: editedValue});
            } else {
                this.clear();
            }
        },

        // Also allow updating the Todo's text through the enter key.
        enterUpdate: function (e) {
            var ENTER_KEY = 13;
            if (e.keyCode === ENTER_KEY) {
                this.close();
            }
        },

        // Destroy the model when the delete button is clicked.
        clear: function (e) {
            this.get('model').clear();
        }
    });

    // Set this View under our custom Y.TodoMVC namespace.
    Y.namespace('TodoMVC').TodoView = TodoView;
}, '@VERSION@', {
    requires: [
        'view',
        'handlebars'
    ]
});
