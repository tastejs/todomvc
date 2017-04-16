(function (html) {
    'use strict';
    var storage = html.module('storage'),
        ToDo = function (model, completed) {
            var self = this,
                todoTemp = model,
                vm = html.module('vm');
            this.title = html.data(model);
            this.editMode = html.data(false);
            this.completed = html.data(completed);
            this.editingClass = html.data(function () {
                return self.editMode() ? 'editing' : '';
            });
            this.isShown = html.data(true);
            this.completedClass = html.data(function () {
                return self.completed() ? 'completed' : '';
            });
            
            // events
            this.showEditor = function (e) {
                // show editor
                self.editMode(true);
                // set editor value
                todoTemp = self.title();
                html((e.srcElement || e.target).parentElement.nextSibling).focus();
            };
            this.saveChange = function () {
                // hide editor
                self.editMode(false);
            };
            this.revertChange = function () {
                // do nothing but hide editor
                self.editMode(false);
                // set the value of label by input's value
                self.title(todoTemp);
            };
            
            // hide item on check change event
            this.checkChange = function (e) {
                var checked = (e.srcElement || e.target).checked;
                if (vm.section() === 'active' && checked) {
                    // hide if it's checked and the section is "active"
                    self.isShown(false);
                }
                if (vm.section() === 'completed' && !checked) {
                    // hide if it's checked and the section is "completed"
                    self.isShown(false);
                }
            };
        },

        ViewModel = function () {
            // Data
            var self = this;
            html.module('vm', this);
            this.newToDo = html.data();
            this.todoList = html.data([]);
            this.section = html.data('all');
            
            /* COMPUTED DATA */
            // is all items completed
            this.isAllCompleted = html.data(function () {
                // return false if there are no items in the list
                if (self.todoList().length === 0) {
                    return false;
                }
                for (var i = 0, j = self.todoList().length; i < j; i++) {
                    if (!self.todoList()[i].completed()) {
                        return false;
                    }
                }
                return true;
            });            
            this.itemCount = html.data(function () {
                return self.todoList().length;
            });
            this.itemLeft = html.data(function () {
                var res = 0;
                for (var i = 0, j = self.todoList().length; i < j; i++) {
                    res += self.todoList()[i].completed() ? 0 : 1;
                }
                return res;
            });
            this.completedCount = html.data(function () {
                return self.itemCount() - self.itemLeft();
            });
            this.itemText = html.data(function () {
                return self.itemLeft() !== 1 ? 'items' : 'item';
            });
            /* END OF COMPUTED DATA */
            
            // events
            this.addNew = function () {
                var newTodo = html.trim(self.newToDo());
                if (newTodo === '') {
                    return;
                }
                self.todoList.push(new ToDo(newTodo));
                self.newToDo('');
                self.showItems();
                storage.saveToLocalStorage(self.todoList.serialize());
                self.isAllCompleted();
            };
            
            // delete to do item
            this.deleteTask = function (e, item) {
                // remove from to do list
                self.todoList.remove(item);
                // save to local storage for later loading
                storage.saveToLocalStorage(self.todoList.serialize());
            };
            
            // toggle all to do item
            this.toggleAll = function () {
                // check for all items are completed
                var isAllCompleted = self.isAllCompleted();
                for (var i = 0, j = self.todoList().length; i < j; i++) {
                    // set the checked item to the opposite of isAllCompleted state
                    self.todoList()[i].completed(!isAllCompleted);
                }
                // show/hide items if we're in a section "active"/"completed"
                self.showItems();
                // save to local storage for later loading
                storage.saveToLocalStorage(self.todoList.serialize());
            };
            
            // show/hide every item based on section and its completed state
            this.showItems = function () {
                var section = self.section();
                for (var i = 0, j = self.todoList().length; i < j; i++) {
                    if (section === '') {
                        // show all items when we're in "all" state
                        // regardless of completed state
                        self.todoList()[i].isShown(true);
                        continue;
                    }
                    if (self.todoList()[i].completed()) {
                        self.todoList()[i].isShown(section === 'completed');
                    } else {
                        self.todoList()[i].isShown(section !== 'completed');
                    }
                }
            };
            
            // clear all completed items (checked items)
            this.clearCompleted = function () {
                for (var i = 0, j = self.todoList().length; i < j; i++) {
                    if (self.todoList()[i].completed()) {
                        // remove an item if it's completed
                        self.todoList.removeAt(i);
                        i--; // reduce runner variable
                        j--; // reduce counter
                    }
                }
                storage.saveToLocalStorage(self.todoList.serialize());
            };
            this.saveChanges = function () {
                storage.saveToLocalStorage(self.todoList.serialize());
            };
            
            // Get Data
            html.array(storage.getFromLocalStorage()).each(function (item) {
                self.todoList.push(new ToDo(item.title, item.completed));
            });
        };
        /* END OF VIEW MODEL */
    
    // export ViewModel class
    html.module('ViewModel', ViewModel);
})(window.html);