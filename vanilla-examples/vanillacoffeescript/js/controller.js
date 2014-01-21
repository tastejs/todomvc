/*
Takes a model and view and acts as the controller between them

@constructor
@param {object} model The model instance
@param {object} view The view instance
*/


(function() {
  var Controller;

  Controller = (function() {
    function Controller(model, view) {
      var _this = this;
      this.model = model;
      this.view = view;
      this.view.bind('newTodo', function(title) {
        return _this.addItem(title);
      });
      this.view.bind('itemEdit', function(item) {
        return _this.editItem(item.id);
      });
      this.view.bind('itemEditDone', function(item) {
        return _this.editItemSave(item.id, item.title);
      });
      this.view.bind('itemEditCancel', function(item) {
        return _this.editItemCancel(item.id);
      });
      this.view.bind('itemRemove', function(item) {
        return _this.removeItem(item.id);
      });
      this.view.bind('itemToggle', function(item) {
        return _this.toggleComplete(item.id, item.completed);
      });
      this.view.bind('removeCompleted', function() {
        return _this.removeCompletedItems();
      });
      this.view.bind('toggleAll', function(status) {
        return _this.toggleAll(status.completed);
      });
    }

    /*
    Loads and initialises the view
    
    @param {string} '' | 'active' | 'completed'
    */


    Controller.prototype.setView = function(locationHash) {
      var page, route;
      route = locationHash.split('/')[1];
      page = route || '';
      return this._updateFilterState(page);
    };

    /*
    An event to fire on load. Will get all items and display them in the
    todo-list
    */


    Controller.prototype.showAll = function() {
      var _this = this;
      return this.model.read(function(data) {
        return _this.view.render('showEntries', data);
      });
    };

    /*
    Renders all active tasks
    */


    Controller.prototype.showActive = function() {
      var _this = this;
      return this.model.read({
        completed: false
      }, function(data) {
        return _this.view.render('showEntries', data);
      });
    };

    /*
    Renders all completed tasks
    */


    Controller.prototype.showCompleted = function() {
      var _this = this;
      return this.model.read({
        completed: true
      }, function(data) {
        return _this.view.render('showEntries', data);
      });
    };

    /*
    An event to fire whenever you want to add an item. Simply pass in the event
    object and it'll handle the DOM insertion and saving of the new item.
    */


    Controller.prototype.addItem = function(title) {
      var _this = this;
      if (title.trim() === '') {
        return;
      }
      return this.model.create(title, function() {
        _this.view.render('clearNewTodo');
        return _this._filter(true);
      });
    };

    /*
    Triggers the item editing mode.
    */


    Controller.prototype.editItem = function(id) {
      var _this = this;
      return this.model.read(id, function(data) {
        return _this.view.render('editItem', {
          id: id,
          title: data[0].title
        });
      });
    };

    /*
    Finishes the item editing mode successfully.
    */


    Controller.prototype.editItemSave = function(id, title) {
      var _this = this;
      if (title.trim()) {
        return this.model.update(id, {
          title: title
        }, function() {
          return _this.view.render('editItemDone', {
            id: id,
            title: title
          });
        });
      } else {
        return this.removeItem(id);
      }
    };

    /*
    Cancels the item editing mode.
    */


    Controller.prototype.editItemCancel = function(id) {
      var _this = this;
      return this.model.read(id, function(data) {
        return _this.view.render('editItemDone', {
          id: id,
          title: data[0].title
        });
      });
    };

    /*
    By giving it an ID it'll find the DOM element matching that ID,
    remove it from the DOM and also remove it from storage.
    
    @param {number} id The ID of the item to remove from the DOM and
    storage
    */


    Controller.prototype.removeItem = function(id) {
      var _this = this;
      this.model.remove(id, function() {
        return _this.view.render('removeItem', id);
      });
      return this._filter();
    };

    /*
    Will remove all completed items from the DOM and storage.
    */


    Controller.prototype.removeCompletedItems = function() {
      var _this = this;
      this.model.read({
        completed: true
      }, function(data) {
        return data.forEach(function(item) {
          return _this.removeItem(item.id);
        });
      });
      return this._filter();
    };

    /*
    Give it an ID of a model and a checkbox and it will update the item
    in storage based on the checkbox's state.
    
    @param {number} id The ID of the element to complete or uncomplete
    @param {object} checkbox The checkbox to check the state of complete
                             or not
    @param {boolean|undefined} silent Prevent re-filtering the todo items
    */


    Controller.prototype.toggleComplete = function(id, completed, silent) {
      var _this = this;
      this.model.update(id, {
        completed: completed
      }, function() {
        return _this.view.render('elementComplete', {
          id: id,
          completed: completed
        });
      });
      if (!silent) {
        return this._filter();
      }
    };

    /*
    Will toggle ALL checkboxe's on/off state and completeness of models.
    Just pass in the event object.
    */


    Controller.prototype.toggleAll = function(completed) {
      var _this = this;
      this.model.read({
        completed: !completed
      }, function(data) {
        return data.forEach(function(item) {
          return _this.toggleComplete(item.id, completed, true);
        });
      });
      return this._filter();
    };

    /*
    Updates the pieces of the page which change depending on the remaining
    number of todos.
    */


    Controller.prototype._updateCount = function() {
      var todos;
      todos = this.model.getCount();
      this.view.render('updateElementCount', todos.active);
      this.view.render('clearCompletedButton', {
        completed: todos.completed,
        visible: todos.completed > 0
      });
      this.view.render('toggleAll', {
        checked: todos.completed === todos.total
      });
      return this.view.render('contentBlockVisibility', {
        visible: todos.total > 0
      });
    };

    /*
    Re-filters the todo items, based on the active route.
    @param {boolean|undefined} force  forces a re-painting of todo items.
    */


    Controller.prototype._filter = function(force) {
      var activeRoute;
      activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);
      /*
      Update the elements on the page, which change with each completed todo
      */

      this._updateCount();
      /*
      If the last active route isn't "All", or we're switching routes, we
      re-create the todo item elements, calling:
         @show[All|Active|Completed]();
      */

      if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
        this['show' + activeRoute]();
      }
      return this._lastActiveRoute = activeRoute;
    };

    /*
    Simply updates the filter nav's selected states
    */


    Controller.prototype._updateFilterState = function(currentPage) {
      /*
      Store a reference to the active route, allowing us to re-filter todo
      items as they are marked complete or incomplete.
      */

      this._activeRoute = currentPage;
      if (currentPage === '') {
        this._activeRoute = 'All';
      }
      this._filter();
      return this.view.render('setFilter', currentPage);
    };

    return Controller;

  })();

  window.app = window.app || {};

  window.app.Controller = Controller;

}).call(this);
