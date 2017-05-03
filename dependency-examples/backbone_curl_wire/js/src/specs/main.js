define( {

  app: {
    create: {
      module: 'views/app',
      args: [
        // Options object
        {
          el: { $ref: 'dom.query!#todoapp' } // Bind to the existing skeleton of the App already present in the HTML.
        }
      ]
    },
    // Inject references to the view and a prefs store
    properties: {

      // Dom elements
      input: { $ref: 'dom.query!#new-todo', i:0 },
      allCheckbox: { $ref: 'dom.query!.mark-all-done', i:0 },
      stats: { $ref: 'dom.query!#todo-stats', i:0 },
      list: { $ref: 'dom.query!#todo-list', i:0 },
      tooltip: { $ref: 'dom.query!.ui-tooltip-top', i:0 },

      // Templates
      statsTemplate: { $ref: 'template.underscore!templates/stats.html' } // Creates a renderable template from the html file

    },
    // Connect to events
    connect: {
      collection: {
        'add':   'addOne', // When a model is added, add the view to the app list
        'reset': 'addAll', // When muptliple models are added, add them all to the app list
        'all':   'render'  // On any change, rerender the view
      }

      // TOOD: update wire plugin so we can connect DOM events here
    }
  },

  collection: {
    create: {
      module: 'collections/todos',
      args: [
        // Default models
        [], // TODO: instead of doing a fetch to get the localstorage todos, we should have a wire plugin get them and pass them in here.
        // Options object
        {}
      ]
    },
    properties: {
      // Whoah! Use the wire factory with the defer option to inject
      // a function that will create a todo (view and model) using another wire spec!
      _createTodo: { wire: { spec: 'specs/todo', defer: true } }
    },
    // Connect to appropriate events
    connect: {
      app: {
        'todoSubmission': 'create', // When the main input field has text submited, create a new todo
        'clearDone': 'clearDone',
        'toggleDone': 'toggleDone'
      }
    }
  },

  plugins: [
    //{ module: 'wire/debug', trace: true }, // Uncomment to see what's going on inside this spec
    { module: 'wire/jquery/dom' },
    { module: 'wire/underscore/template' },
    { module: 'wire/backbone/events' }
  ]
  
} );