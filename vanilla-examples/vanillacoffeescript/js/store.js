/*
Creates a new client side storage object and will create an empty
collection if no collection already exists.

@param {string} name The name of our DB we want to use
@param {function} callback Our fake DB uses callbacks because in
real life you probably would be making AJAX calls
*/


(function() {
  var Store;

  Store = (function() {
    function Store(name, callback) {
      var data, dbName;
      if (callback == null) {
        callback = (function() {});
      }
      dbName = this._dbName = name;
      if (!localStorage[dbName]) {
        data = {
          todos: []
        };
        localStorage[dbName] = JSON.stringify(data);
      }
      callback.call(this, JSON.parse(localStorage[dbName]));
    }

    /*
    Finds items based on a query given as a JS object
    
    @param {object} query The query to match against (i.e. {foo: 'bar'})
    @param {function} callback    The callback to fire when the query has
    completed running
    
    @example
    db.find({foo: 'bar', hello: 'world'}, function (data) {
      // data will return any items that have foo: bar and
      // hello: world in their properties
    });
    */


    Store.prototype.find = function(query, callback) {
      var todos;
      if (!callback) {
        return;
      }
      todos = JSON.parse(localStorage[this._dbName]).todos;
      return callback.call(this, todos.filter(function(todo) {
        var match, q;
        match = true;
        for (q in query) {
          if (query[q] !== todo[q]) {
            match = false;
          }
        }
        return match;
      }));
    };

    /*
    Will retrieve all data from the collection
    
    @param {function} callback The callback to fire upon retrieving data
    */


    Store.prototype.findAll = function(callback) {
      if (callback == null) {
        callback = (function() {});
      }
      return callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    };

    /*
    Will save the given data to the DB. If no item exists it will create a new
    item, otherwise it'll simply update an existing item's properties
    
    @param {number} id An optional param to enter an ID of an item to update
    @param {object} data The data to save back into the DB
    @param {function} callback The callback to fire after saving
    */


    Store.prototype.save = function(id, updateData, callback) {
      var data, todo, todos, update, x, _i, _len;
      if (callback == null) {
        callback = (function() {});
      }
      data = JSON.parse(localStorage[this._dbName]);
      todos = data.todos;
      /*
      If an ID was actually given, find the item and update each property
      */

      if (typeof id !== 'object') {
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          if (todo.id == id) {
            for (x in updateData) {
              update = updateData[x];
              todo[x] = update;
            }
          }
        }
        localStorage[this._dbName] = JSON.stringify(data);
        return callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
      } else {
        callback = updateData;
        updateData = id;
        /*
        Generate an ID
        */

        updateData.id = new Date().getTime();
        todos.push(updateData);
        localStorage[this._dbName] = JSON.stringify(data);
        return callback(this, [updateData]);
      }
    };

    /*
    Will remove an item from the Store based on its ID
    
    @param {number} id The ID of the item you want to remove
    @param {function} callback The callback to fire after saving
    */


    Store.prototype.remove = function(id, callback) {
      var data, i, todo, todos, _i, _len;
      data = JSON.parse(localStorage[this._dbName]);
      todos = data.todos;
      for (i = _i = 0, _len = todos.length; _i < _len; i = ++_i) {
        todo = todos[i];
        if (todo.id == id) {
          todos.splice(i, 1);
          break;
        }
      }
      localStorage[this._dbName] = JSON.stringify(data);
      return callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    };

    /*
    Will drop all storage and start fresh
    
    @param {function} callback The callback to fire after dropping the data
    */


    Store.prototype.drop = function(callback) {
      localStorage[this._dbName] = JSON.stringify({
        todos: []
      });
      return callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
    };

    return Store;

  })();

  window.app = window.app || {};

  window.app.Store = Store;

}).call(this);
