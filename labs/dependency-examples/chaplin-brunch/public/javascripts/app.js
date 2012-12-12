(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application, Chaplin, FooterController, HeaderController, Layout, Todos, TodosController, mediator, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  HeaderController = require('controllers/header-controller');

  FooterController = require('controllers/footer-controller');

  TodosController = require('controllers/todos-controller');

  Todos = require('models/todos');

  Layout = require('views/layout');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Chaplin • TodoMVC';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initDispatcher({
        controllerSuffix: '-controller'
      });
      this.initLayout();
      this.initMediator();
      this.initControllers();
      this.initRouter(routes, {
        pushState: false
      });
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initLayout = function() {
      return this.layout = new Layout({
        title: this.title
      });
    };

    Application.prototype.initControllers = function() {
      new HeaderController();
      new FooterController();
      return new TodosController();
    };

    Application.prototype.initMediator = function() {
      mediator.user = null;
      mediator.todos = new Todos();
      mediator.todos.fetch();
      return mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
}});

window.require.define({"controllers/base/controller": function(exports, require, module) {
  var Chaplin, Controller,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(Chaplin.Controller);
  
}});

window.require.define({"controllers/footer-controller": function(exports, require, module) {
  var Controller, FooterController, FooterView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  FooterView = require('views/footer-view');

  mediator = require('mediator');

  module.exports = FooterController = (function(_super) {

    __extends(FooterController, _super);

    function FooterController() {
      return FooterController.__super__.constructor.apply(this, arguments);
    }

    FooterController.prototype.initialize = function() {
      FooterController.__super__.initialize.apply(this, arguments);
      return this.view = new FooterView({
        collection: mediator.todos
      });
    };

    return FooterController;

  })(Controller);
  
}});

window.require.define({"controllers/header-controller": function(exports, require, module) {
  var Controller, HeaderController, HeaderView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HeaderView = require('views/header-view');

  mediator = require('mediator');

  module.exports = HeaderController = (function(_super) {

    __extends(HeaderController, _super);

    function HeaderController() {
      return HeaderController.__super__.constructor.apply(this, arguments);
    }

    HeaderController.prototype.initialize = function() {
      HeaderController.__super__.initialize.apply(this, arguments);
      return this.view = new HeaderView({
        collection: mediator.todos
      });
    };

    return HeaderController;

  })(Controller);
  
}});

window.require.define({"controllers/index-controller": function(exports, require, module) {
  var Controller, IndexController,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  module.exports = IndexController = (function(_super) {

    __extends(IndexController, _super);

    function IndexController() {
      return IndexController.__super__.constructor.apply(this, arguments);
    }

    IndexController.prototype.title = 'Todo list';

    IndexController.prototype.list = function(options) {
      var _ref, _ref1;
      return this.publishEvent('todos:filter', (_ref = (_ref1 = options.filterer) != null ? _ref1.trim() : void 0) != null ? _ref : 'all');
    };

    return IndexController;

  })(Controller);
  
}});

window.require.define({"controllers/todos-controller": function(exports, require, module) {
  var Controller, TodosController, TodosView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  TodosView = require('views/todos-view');

  mediator = require('mediator');

  module.exports = TodosController = (function(_super) {

    __extends(TodosController, _super);

    function TodosController() {
      return TodosController.__super__.constructor.apply(this, arguments);
    }

    TodosController.prototype.initialize = function() {
      TodosController.__super__.initialize.apply(this, arguments);
      return this.view = new TodosView({
        collection: mediator.todos
      });
    };

    return TodosController;

  })(Controller);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });
  
}});

window.require.define({"lib/support": function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
}});

window.require.define({"lib/utils": function(exports, require, module) {
  var Chaplin, utils;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  module.exports = utils;
  
}});

window.require.define({"lib/view-helper": function(exports, require, module) {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Handlebars.registerHelper('if_logged_in', function(options) {
    if (mediator.user) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('with_user', function(options) {
    var context, _ref;
    context = ((_ref = mediator.user) != null ? _ref.serialize() : void 0) || {};
    return Handlebars.helpers["with"].call(this, context, options);
  });
  
}});

window.require.define({"mediator": function(exports, require, module) {
  
  module.exports = require('chaplin').mediator;
  
}});

window.require.define({"models/base/collection": function(exports, require, module) {
  var Chaplin, Collection, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Model = require('models/base/model');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.model = Model;

    return Collection;

  })(Chaplin.Collection);
  
}});

window.require.define({"models/base/model": function(exports, require, module) {
  var Chaplin, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Chaplin.Model);
  
}});

window.require.define({"models/todo": function(exports, require, module) {
  var Model, Todo,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Todo = (function(_super) {

    __extends(Todo, _super);

    function Todo() {
      return Todo.__super__.constructor.apply(this, arguments);
    }

    Todo.prototype.defaults = {
      title: '',
      completed: false
    };

    Todo.prototype.initialize = function() {
      Todo.__super__.initialize.apply(this, arguments);
      if (this.isNew()) {
        return this.set('created', Date.now());
      }
    };

    Todo.prototype.toggle = function() {
      return this.set({
        completed: !this.get('completed')
      });
    };

    Todo.prototype.isVisible = function() {
      var isCompleted;
      return isCompleted = this.get('completed');
    };

    return Todo;

  })(Model);
  
}});

window.require.define({"models/todos": function(exports, require, module) {
  var Collection, Todo, Todos,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  Todo = require('models/todo');

  module.exports = Todos = (function(_super) {

    __extends(Todos, _super);

    function Todos() {
      return Todos.__super__.constructor.apply(this, arguments);
    }

    Todos.prototype.model = Todo;

    Todos.prototype.localStorage = new Store('todos-chaplin');

    Todos.prototype.allAreCompleted = function() {
      return this.getCompleted().length === this.length;
    };

    Todos.prototype.getCompleted = function() {
      return this.where({
        completed: true
      });
    };

    Todos.prototype.getActive = function() {
      return this.where({
        completed: false
      });
    };

    Todos.prototype.comparator = function(todo) {
      return todo.get('created');
    };

    return Todos;

  })(Collection);
  
}});

window.require.define({"routes": function(exports, require, module) {
  
  module.exports = function(match) {
    match(':filterer', 'index#list');
    return match('', 'index#list');
  };
  
}});

window.require.define({"views/base/collection-view": function(exports, require, module) {
  var Chaplin, CollectionView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
}});

window.require.define({"views/base/view": function(exports, require, module) {
  var Chaplin, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view-helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
}});

window.require.define({"views/footer-view": function(exports, require, module) {
  var FooterView, View, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/footer');

  module.exports = FooterView = (function(_super) {

    __extends(FooterView, _super);

    function FooterView() {
      this.renderCounter = __bind(this.renderCounter, this);

      this.updateFilterer = __bind(this.updateFilterer, this);

      this.render = __bind(this.render, this);
      return FooterView.__super__.constructor.apply(this, arguments);
    }

    FooterView.prototype.autoRender = true;

    FooterView.prototype.el = '#footer';

    FooterView.prototype.template = template;

    FooterView.prototype.initialize = function() {
      FooterView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('todos:filter', this.updateFilterer);
      this.modelBind('all', this.renderCounter);
      return this.delegate('click', '#clear-completed', this.clearCompleted);
    };

    FooterView.prototype.render = function() {
      FooterView.__super__.render.apply(this, arguments);
      return this.renderCounter();
    };

    FooterView.prototype.updateFilterer = function(filterer) {
      if (filterer === 'all') {
        filterer = '';
      }
      return this.$('#filters a').removeClass('selected').filter("[href='#/" + filterer + "']").addClass('selected');
    };

    FooterView.prototype.renderCounter = function() {
      var active, completed, countDescription, total;
      total = this.collection.length;
      active = this.collection.getActive().length;
      completed = this.collection.getCompleted().length;
      this.$('#todo-count > strong').html(active);
      countDescription = (active === 1 ? 'item' : 'items');
      this.$('.todo-count-title').text(countDescription);
      this.$('#completed-count').html("(" + completed + ")");
      this.$('#clear-completed').toggle(completed > 0);
      return this.$el.toggle(total > 0);
    };

    FooterView.prototype.clearCompleted = function() {
      return this.publishEvent('todos:clear');
    };

    return FooterView;

  })(View);
  
}});

window.require.define({"views/header-view": function(exports, require, module) {
  var HeaderView, View, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      this.createOnEnter = __bind(this.createOnEnter, this);
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.el = '#header';

    HeaderView.prototype.template = template;

    HeaderView.prototype.initialize = function() {
      HeaderView.__super__.initialize.apply(this, arguments);
      return this.delegate('keypress', '#new-todo', this.createOnEnter);
    };

    HeaderView.prototype.createOnEnter = function(event) {
      var ENTER_KEY, title;
      ENTER_KEY = 13;
      title = $(event.currentTarget).val().trim();
      if (event.keyCode !== ENTER_KEY || !title) {
        return;
      }
      this.collection.create({
        title: title
      });
      return this.$('#new-todo').val('');
    };

    return HeaderView;

  })(View);
  
}});

window.require.define({"views/layout": function(exports, require, module) {
  var Chaplin, Layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      Layout.__super__.initialize.apply(this, arguments);
      return this.subscribeEvent('todos:filter', this.changeFilterer);
    };

    Layout.prototype.changeFilterer = function(filterer) {
      if (filterer == null) {
        filterer = 'all';
      }
      return $('#todoapp').attr('class', "filter-" + filterer);
    };

    return Layout;

  })(Chaplin.Layout);
  
}});

window.require.define({"views/templates/footer": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    


    return "<span id=\"todo-count\">\n  <strong></strong>\n  <span class=\"todo-count-title\">items</span>\n  left\n</span>\n<ul id=\"filters\">\n  <li>\n    <a href=\"#/\">All</a>\n  </li>\n  <li>\n    <a href=\"#/active\">Active</a>\n  </li>\n  <li>\n    <a href=\"#/completed\">Completed</a>\n  </li>\n</ul>\n<button id=\"clear-completed\">\n  Clear completed\n  <span id=\"completed-count\"></span>\n</button>\n";});
}});

window.require.define({"views/templates/header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    


    return "<h1>todos</h1>\n<input id=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n";});
}});

window.require.define({"views/templates/todo": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    return " checked";}

    buffer += "<div class=\"view\">\n  <input class=\"toggle\" type=\"checkbox\"";
    stack1 = depth0.completed;
    stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += ">\n  <label>";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "</label>\n  <button class=\"destroy\"></button>\n</div>\n<input class=\"edit\" value=\"";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "\">\n";
    return buffer;});
}});

window.require.define({"views/templates/todos": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    


    return "<input id=\"toggle-all\" type=\"checkbox\">\n<label for=\"toggle-all\">Mark all as complete</label>\n<ul id=\"todo-list\"></ul>\n";});
}});

window.require.define({"views/todo-view": function(exports, require, module) {
  var TodoView, View, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/todo');

  module.exports = TodoView = (function(_super) {

    __extends(TodoView, _super);

    function TodoView() {
      this.save = __bind(this.save, this);

      this.edit = __bind(this.edit, this);

      this.toggle = __bind(this.toggle, this);

      this.destroy = __bind(this.destroy, this);

      this.render = __bind(this.render, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.prototype.template = template;

    TodoView.prototype.tagName = 'li';

    TodoView.prototype.initialize = function() {
      TodoView.__super__.initialize.apply(this, arguments);
      this.modelBind('change', this.render);
      this.delegate('click', '.destroy', this.destroy);
      this.delegate('dblclick', 'label', this.edit);
      this.delegate('keypress', '.edit', this.save);
      this.delegate('click', '.toggle', this.toggle);
      return this.delegate('blur', '.edit', this.save);
    };

    TodoView.prototype.render = function() {
      var className;
      TodoView.__super__.render.apply(this, arguments);
      this.$el.removeClass('active completed');
      className = this.model.get('completed') ? 'completed' : 'active';
      return this.$el.addClass(className);
    };

    TodoView.prototype.destroy = function() {
      return this.model.destroy();
    };

    TodoView.prototype.toggle = function() {
      return this.model.toggle().save();
    };

    TodoView.prototype.edit = function() {
      this.$el.addClass('editing');
      return this.$('.edit').focus();
    };

    TodoView.prototype.save = function(event) {
      var ENTER_KEY, title;
      ENTER_KEY = 13;
      title = $(event.currentTarget).val().trim();
      if (!title) {
        return this.model.destroy();
      }
      if (event.type === 'keypress' && event.keyCode !== ENTER_KEY) {
        return;
      }
      this.model.save({
        title: title
      });
      return this.$el.removeClass('editing');
    };

    return TodoView;

  })(View);
  
}});

window.require.define({"views/todos-view": function(exports, require, module) {
  var CollectionView, TodoView, TodosView, template,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('views/base/collection-view');

  template = require('views/templates/todos');

  TodoView = require('views/todo-view');

  module.exports = TodosView = (function(_super) {

    __extends(TodosView, _super);

    function TodosView() {
      this.toggleCompleted = __bind(this.toggleCompleted, this);

      this.renderCheckbox = __bind(this.renderCheckbox, this);

      this.render = __bind(this.render, this);
      return TodosView.__super__.constructor.apply(this, arguments);
    }

    TodosView.prototype.el = '#main';

    TodosView.prototype.itemView = TodoView;

    TodosView.prototype.listSelector = '#todo-list';

    TodosView.prototype.template = template;

    TodosView.prototype.initialize = function() {
      TodosView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('todos:clear', this.clear);
      this.modelBind('all', this.renderCheckbox);
      return this.delegate('click', '#toggle-all', this.toggleCompleted);
    };

    TodosView.prototype.render = function() {
      TodosView.__super__.render.apply(this, arguments);
      return this.renderCheckbox();
    };

    TodosView.prototype.renderCheckbox = function() {
      this.$('#toggle-all').prop('checked', this.collection.allAreCompleted());
      return this.$el.toggle(this.collection.length !== 0);
    };

    TodosView.prototype.toggleCompleted = function(event) {
      var isChecked;
      isChecked = event.currentTarget.checked;
      return this.collection.each(function(todo) {
        return todo.save({
          completed: isChecked
        });
      });
    };

    TodosView.prototype.clear = function() {
      return this.collection.getCompleted().forEach(function(model) {
        return model.destroy();
      });
    };

    return TodosView;

  })(CollectionView);
  
}});

