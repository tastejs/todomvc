define('app/models/store', [
    'app/models/todo',
    'ember',
    'persistence',
    'persistence_mem',
    'persistence_sql',
    'persistence_websql'
  ],
  /**
   * Todo entries storage model
   *
   * @param Class Todo, the todo entry model
   * @returns Class
   */
  function( Todo ) {
    // Our Store is handled by PersistenceJS via WebSQL or localStorage.
    // Create it with a meaningful name, like the name you'd give a table.
    return function( name ) {
      this.name = name;
      if (!!window.openDatabase) {
        // WebSQL store:
        persistence.store.websql.config(persistence, name, 'todo database', 5*1024*1024);
      } else if (!!Storage) {
        // In-memory localStore:
        persistence.store.memory.config(persistence);
        $(window).unload(function() {
          persistence.saveToLocalStorage();
        });
      } else {
        alert('Your browser does not support any of persistence methods');
      }

      var TodoPersistence = persistence.define( 'todo', {
        title: 'TEXT',
        completed: 'BOOL'
      });
      persistence.schemaSync();

      if (!!Storage && window.openDatabase === undefined) persistence.loadFromLocalStorage();

      // Persist the current state of the **Store**.
      this.save = function() {
        persistence.flush();
        //if (!!Storage) persistence.saveToLocalStorage();
      };

      // Wrapper around `this.create`
      // Creates a `Todo` model object out of the title
      this.createFromTitle = function( title ) {
        var todo = Todo.create({
          title: title,
          store: this
        });
        this.create( todo );
        return todo;
      };

      // Store the model inside the `Store`
      this.create = function ( model ) {
        if ( !model.get( 'id' ) ) {
          var t = new TodoPersistence( model.getProperties( 'title', 'completed' ) );
          model.set( 'id', t.id );
          persistence.add(t);
          this.save();
        }
        return model;
      };

      // Update a model by replacing its copy in persistence store.
      this.update = function( model ) {
        TodoPersistence.findBy('id', model.get('id'), function( todo ) {
          if ( todo !== null ) {
            todo.title = model.get( 'title' );
            todo.completed = model.get( 'completed' );
            persistence.flush();
          }
        });
        return model;
      };

      // Retrieve a model from Persistence by id asynchronously.
      this.find = function( model, callback ) {
        var self = this;
        TodoPersistence.findBy( 'id', model.get( 'id' ), function( item ) {
          var todo = Todo.create({
            id: item.id,
            title: item.title,
            completed: item.completed,
            store: self
          });
          callback( todo );
        });
      };

      // Fetch all items in async mode and pass it to the callback.
      this.findAll = function( callback ) {
        var self = this;
        TodoPersistence.all().list( function( items ) {
          var itemCount = items.length;
          var todos = [];
          items.forEach( function( item ) {
            todos.push( Todo.create({
              id: item.id,
              title: item.title,
              completed: item.completed,
              store: self
            }));
          });
          callback( todos );
        });
      };

      // Delete a model asynchronously.
      this.remove = function( model ) {
        TodoPersistence.findBy( 'id', model.get('id'), function(item) {
          persistence.remove(item);
          persistence.flush();
        });
        return model;
      };
    };
  }
);