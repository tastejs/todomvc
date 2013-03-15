// This is based on Enyo 2.2.  The next version of Enyo will more tightly integrate backbone and require less custom code.
var ENTER_KEY = 13;
// The global controller for this app.
enyo.kind({
    name: 'ToDo.NotepadController',
    // Tells enyo this is a subclass of CollectionController and should inherit it's properties/methods
    kind: 'enyo.CollectionController',
    // Bind to this collection
    collection: 'ToDo.TaskCollection',
    // Automatically load the collection into the controller without a custom load function
    autoLoad: true,
    // Enyo automatically creates get/set and an event listener for published properties
    published: {
        route: ''
    },
    // These are the events this controller will listen for, and what function to call when they occur
    handlers: {
        onSaveNew: 'saveNew',
        onDeleteTask: 'deleteTask',
        onMarkComplete: 'toggleComplete',
        onMarkAllComplete: 'toggleAllComplete',
        onStartEdit: 'showEdit',
        onSaveExistingKeypress: 'leaveField',
        onblur: 'leaveField',
        onClearCompleted: 'clearCompleted',
        onReload: 'loadList'
    },
    // Clear all completed tasks
    clearCompleted: function () {
        // reset the collection stored inside the controller, in case the collection has been filtered
        this.releaseCollection();
        this.load();
        // Collect all completed tasks from the collection, and destroy them
        completedTasks = this.collection.where({
            completed: true
        });
        completedTasks.forEach(function (task) {
            task.destroy();
        });
        // reset the display
        this.bubble('onReload');
    },
    routeChanged: function () {
        // reset the display
        this.bubble('onReload');
    },
    leaveField: function (inSender, inEvent) {
        // All enyo events are provided a hook to the sender, and the event that spawned it
        // The inEvent object has a pointer to the enyo object that first started the process
        // InSender is more refelective of where the event came from
        // Bubbling will send an event up the enyo object hierarchy so parent object along the way can get this event
        var val = inEvent.originator.getValue().trim();
        var controller;
        // Make sure the sender has a valid controller to modify
        if (inSender.controller) {
            if (val === '') {
                // Bubble up the delete event
                this.bubble('onDeleteTask', inEvent, inSender);
            } else {
                // update the data
                // Each row is given its own controller with a direct link to the row's representative model
                // Avoids having to navigate to the parent controller directly
                controller = inSender.controller;
                controller.data.attributes.title = val;
                inSender.controller.data.save();
            }
            // in this case, the sender is the table row, so we remove the class from the sender
            // the inEvent.originator is the field
            inSender.removeClass('editing');
            this.bubble('onReload');
        }
        return true;
    },
    showEdit: function (inSender) {
        // in this case, the sender is the table row, so we remove the class from the sender
        inSender.addClass('editing');
        inSender.$.inputField.focus();
        return true;
    },
    saveNew: function (inSender, inEvent) {
        var val = inEvent.originator.getValue().trim();
        if (val !== '') {
            this.collection.create({
                title: val
            });
            inEvent.originator.setValue('');
        }
        // reload the display
        this.bubble('onReload');
        return true;
    },
    deleteTask: function (inSender) {
        inSender.controller.model().destroy();
        // reload the display
        this.bubble('onReload');
        return true;
    },
    toggleComplete: function (inSender) {
        // toggle the completed attribute
        inSender.controller.data.attributes.completed = !inSender.controller.data.attributes.completed;
        inSender.controller.data.save();
        // reload the display
        this.bubble('onReload');
        return true;
    },
    toggleAllComplete: function () {
        // Find out which way the toggle all is flipped
        var completed = enyo.$['toggle-all'].getAttribute('checked') ? true : false;
        // enyo stores all its objects at the top, and each object knows where to point in the DOM
        // No need to find something in the DOM, just grab the top level enyo object that represents it
        // toggle all children of the todo list
        enyo.$['todo-list'].children.forEach(function (child) {
            child.controller.data.attributes.completed = !completed;
            child.controller.data.save();
        });
        // reload the display
        this.bubble('onReload');
        return true;
    },
    loadList: function () {
        var checked;
        var falseTasks; // array of active tasks
        var completedTasks; // array of completed tasks
        var length; // length of all tasks
        // if we have created the todo-list in the enyo hierarchy
        if (enyo.$['todo-list']) {
            todoList = enyo.$['todo-list'];
            $('#filters a').removeClass('selected');
            // reset the collection being used by the controller
            this.releaseCollection();
            this.load();
            length = this.length;
            // Grab an array of false tasks and completed tasks
            falseTasks = this.collection.where({
                completed: false
            });
            completedTasks = this.collection.where({
                completed: true
            });
            // set the appropriate filter link css, then update the collection to the correct models array
            if (this.route === '/completed') {
                $('#tagComplete').addClass('selected');
                this.update(completedTasks);
            } else if (this.route === '/active') {
                $('#tagActive').addClass('selected');
                this.update(falseTasks);
            } else {
                $('#tagAll').addClass('selected');
            }
            // hide or show based on number of total tasks
            if (length === 0) {
                enyo.$.main.hide();
                enyo.$.footer.hide();
            } else {
                enyo.$.main.show();
                enyo.$.footer.show();
                // toggle the all button
                if (falseTasks.length === 0) {
                    $('#toggle-all').attr('checked', true);
                } else {
                    $('#toggle-all').removeAttr('checked');
                }
                // update the task counter
                enyo.$['count-number'].setContent(falseTasks.length);
                if (falseTasks.length === 1) {
                    enyo.$.countText.setContent(' item left');
                } else {
                    enyo.$.countText.setContent(' items left');
                }
                // update the clear completed button
                if (completedTasks.length === 0) {
                    enyo.$['clear-completed'].hide();
                    enyo.$['clear-completed'].setContent('');
                } else {
                    enyo.$['clear-completed'].show();
                    enyo.$['clear-completed'].setContent('Clear Completed (' + completedTasks.length + ')');
                }
            }
            // set the correct ui representation for each task.  Use the top level todo-list object to navigate down the rows
            enyo.$['todo-list'].children.forEach(function (child) {
                checked = child.controller.data.attributes.completed;
                if (checked) {
                    child.addClass('completed');
                    child.applyStyle('text-decoration', 'line-through');
                    $(child.$.checkbox.hasNode()).attr('checked', true);
                } else {
                    child.removeClass('completed');
                    child.applyStyle('text-decoration', null);
                    $(child.$.checkbox.hasNode()).removeAttr('checked', false);
                }
            });
        }
    }
});