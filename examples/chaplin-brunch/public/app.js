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
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
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
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, Todos, mediator, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mediator = require('mediator');

Todos = require('models/todos');

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.title = 'Chaplin • TodoMVC';

  Application.prototype.initMediator = function() {
    mediator.todos = new Todos();
    return Application.__super__.initMediator.apply(this, arguments);
  };

  Application.prototype.start = function() {
    mediator.todos.fetch();
    return Application.__super__.start.apply(this, arguments);
  };

  return Application;

})(Chaplin.Application);
});

;require.register("controllers/index-controller", function(exports, require, module) {
var FooterView, HeaderView, IndexController, TodosView, mediator, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HeaderView = require('../views/header-view');

FooterView = require('../views/footer-view');

TodosView = require('../views/todos-view');

mediator = require('mediator');

module.exports = IndexController = (function(_super) {
  __extends(IndexController, _super);

  function IndexController() {
    _ref = IndexController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  IndexController.prototype.beforeAction = function() {
    return this.reuse('structure', function() {
      var params;
      params = {
        collection: mediator.todos
      };
      this.header = new HeaderView(params);
      return this.footer = new FooterView(params);
    });
  };

  IndexController.prototype.list = function(params) {
    var filterer, _ref1, _ref2;
    filterer = (_ref1 = (_ref2 = params.filterer) != null ? _ref2.trim() : void 0) != null ? _ref1 : 'all';
    this.publishEvent('todos:filter', filterer);
    return this.view = new TodosView({
      collection: mediator.todos,
      filterer: function(model) {
        switch (filterer) {
          case 'completed':
            return model.get('completed');
          case 'active':
            return !model.get('completed');
          default:
            return true;
        }
      }
    });
  };

  return IndexController;

})(Chaplin.Controller);
});

;require.register("initialize", function(exports, require, module) {
var Application, routes;

Application = require('application');

routes = require('routes');

document.addEventListener('DOMContentLoaded', function() {
  return new Application({
    controllerSuffix: '-controller',
    pushState: false,
    routes: routes
  });
}, false);
});

;require.register("lib/utils", function(exports, require, module) {
var utils;

utils = Chaplin.utils.beget(Chaplin.utils);

Backbone.utils.extend(utils, {
  toggle: function(elem, visible) {
    return elem.style.display = (visible ? '' : 'none');
  }
});

if (typeof Object.seal === "function") {
  Object.seal(utils);
}

module.exports = utils;
});

;require.register("mediator", function(exports, require, module) {
module.exports = Chaplin.mediator;
});

;require.register("models/todo", function(exports, require, module) {
var Todo, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Todo = (function(_super) {
  __extends(Todo, _super);

  function Todo() {
    _ref = Todo.__super__.constructor.apply(this, arguments);
    return _ref;
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

})(Chaplin.Model);
});

;require.register("models/todos", function(exports, require, module) {
var Todo, Todos, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Todo = require('models/todo');

module.exports = Todos = (function(_super) {
  __extends(Todos, _super);

  function Todos() {
    _ref = Todos.__super__.constructor.apply(this, arguments);
    return _ref;
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

})(Chaplin.Collection);
});

;require.register("routes", function(exports, require, module) {
module.exports = function(match) {
  match(':filterer', 'index#list');
  return match('', 'index#list');
};
});

;require.register("views/base/collection-view", function(exports, require, module) {
var CollectionView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/base/view');

module.exports = CollectionView = (function(_super) {
  __extends(CollectionView, _super);

  function CollectionView() {
    _ref = CollectionView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

  CollectionView.prototype.useCssAnimation = true;

  return CollectionView;

})(Chaplin.CollectionView);
});

;require.register("views/base/view", function(exports, require, module) {
var View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype.getTemplateFunction = function() {
    return this.template;
  };

  return View;

})(Chaplin.View);
});

;require.register("views/footer-view", function(exports, require, module) {
var FooterView, View, utils, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./base/view');

utils = require('lib/utils');

module.exports = FooterView = (function(_super) {
  __extends(FooterView, _super);

  function FooterView() {
    _ref = FooterView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  FooterView.prototype.autoRender = true;

  FooterView.prototype.el = '#footer';

  FooterView.prototype.events = {
    'click #clear-completed': 'clearCompleted'
  };

  FooterView.prototype.listen = {
    'todos:filter mediator': 'updateFilterer',
    'all collection': 'renderCounter'
  };

  FooterView.prototype.template = require('./templates/footer');

  FooterView.prototype.render = function() {
    FooterView.__super__.render.apply(this, arguments);
    return this.renderCounter();
  };

  FooterView.prototype.updateFilterer = function(filterer) {
    var cls, selector,
      _this = this;
    if (filterer === 'all') {
      filterer = '';
    }
    selector = "[href='#/" + filterer + "']";
    cls = 'selected';
    return this.findAll('#filters a').forEach(function(link) {
      link.classList.remove(cls);
      if (Backbone.utils.matchesSelector(link, selector)) {
        return link.classList.add(cls);
      }
    });
  };

  FooterView.prototype.renderCounter = function() {
    var active, completed, countDescription, total;
    total = this.collection.length;
    active = this.collection.getActive().length;
    completed = this.collection.getCompleted().length;
    this.find('#todo-count > strong').textContent = active;
    countDescription = (active === 1 ? 'item' : 'items');
    this.find('.todo-count-title').textContent = countDescription;
    utils.toggle(this.find('#clear-completed'), completed > 0);
    return utils.toggle(this.el, total > 0);
  };

  FooterView.prototype.clearCompleted = function() {
    return this.publishEvent('todos:clear');
  };

  return FooterView;

})(View);
});

;require.register("views/header-view", function(exports, require, module) {
var HeaderView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./base/view');

module.exports = HeaderView = (function(_super) {
  __extends(HeaderView, _super);

  function HeaderView() {
    _ref = HeaderView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HeaderView.prototype.autoRender = true;

  HeaderView.prototype.el = '#header';

  HeaderView.prototype.events = {
    'keypress #new-todo': 'createOnEnter'
  };

  HeaderView.prototype.template = require('./templates/header');

  HeaderView.prototype.createOnEnter = function(event) {
    var ENTER_KEY, title;
    ENTER_KEY = 13;
    title = event.delegateTarget.value.trim();
    if (event.keyCode !== ENTER_KEY || !title) {
      return;
    }
    this.collection.create({
      title: title
    });
    return this.find('#new-todo').value = '';
  };

  return HeaderView;

})(View);
});

;require.register("views/templates/footer", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span id=\"todo-count\">\n  <strong></strong>\n  <span class=\"todo-count-title\">items</span>\n  left\n</span>\n<ul id=\"filters\">\n  <li>\n    <a href=\"#/\">All</a>\n  </li>\n  <li>\n    <a href=\"#/active\">Active</a>\n  </li>\n  <li>\n    <a href=\"#/completed\">Completed</a>\n  </li>\n</ul>\n<button id=\"clear-completed\">Clear completed</button>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/header", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>todos</h1>\n<input id=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/todo", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return " checked";
  }

  buffer += "<div class=\"view\">\n  <input class=\"toggle\" type=\"checkbox\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.completed), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n  <label>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n  <button class=\"destroy\"></button>\n</div>\n<input class=\"edit\" value=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n";
  return buffer;
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/todos", function(exports, require, module) {
var __templateData = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<input id=\"toggle-all\" type=\"checkbox\">\n<label for=\"toggle-all\">Mark all as complete</label>\n<ul id=\"todo-list\"></ul>\n";
  });
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/todo-view", function(exports, require, module) {
var TodoView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./base/view');

module.exports = TodoView = (function(_super) {
  __extends(TodoView, _super);

  function TodoView() {
    _ref = TodoView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TodoView.prototype.events = {
    'click .toggle': 'toggle',
    'dblclick label': 'edit',
    'keyup .edit': 'save',
    'focusout .edit': 'save',
    'click .destroy': 'clear'
  };

  TodoView.prototype.listen = {
    'change model': 'render'
  };

  TodoView.prototype.template = require('./templates/todo');

  TodoView.prototype.tagName = 'li';

  TodoView.prototype.render = function() {
    TodoView.__super__.render.apply(this, arguments);
    return this.toggleClass();
  };

  TodoView.prototype.toggleClass = function() {
    var isCompleted;
    isCompleted = this.model.get('completed');
    return this.el.classList.toggle('completed', isCompleted);
  };

  TodoView.prototype.clear = function() {
    return this.model.destroy();
  };

  TodoView.prototype.toggle = function() {
    return this.model.toggle().save();
  };

  TodoView.prototype.edit = function() {
    var input;
    this.el.classList.add('editing');
    input = this.find('.edit');
    input.focus();
    return input.value = input.value;
  };

  TodoView.prototype.save = function(event) {
    var ENTER_KEY, title;
    ENTER_KEY = 13;
    title = event.delegateTarget.value.trim();
    if (!title) {
      return this.model.destroy();
    }
    if (event.type === 'keyup' && event.keyCode !== ENTER_KEY) {
      return;
    }
    this.model.save({
      title: title
    });
    return this.el.classList.remove('editing');
  };

  return TodoView;

})(View);
});

;require.register("views/todos-view", function(exports, require, module) {
var CollectionView, TodoView, TodosView, utils, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CollectionView = require('./base/collection-view');

TodoView = require('./todo-view');

utils = require('lib/utils');

module.exports = TodosView = (function(_super) {
  __extends(TodosView, _super);

  function TodosView() {
    _ref = TodosView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  TodosView.prototype.container = '#main';

  TodosView.prototype.events = {
    'click #toggle-all': 'toggleCompleted'
  };

  TodosView.prototype.itemView = TodoView;

  TodosView.prototype.listSelector = '#todo-list';

  TodosView.prototype.listen = {
    'all collection': 'renderCheckbox',
    'todos:clear mediator': 'clear'
  };

  TodosView.prototype.template = require('./templates/todos');

  TodosView.prototype.render = function() {
    TodosView.__super__.render.apply(this, arguments);
    return this.renderCheckbox();
  };

  TodosView.prototype.renderCheckbox = function() {
    this.find('#toggle-all').checked = this.collection.allAreCompleted();
    return utils.toggle(this.el, this.collection.length !== 0);
  };

  TodosView.prototype.toggleCompleted = function(event) {
    var isChecked;
    isChecked = event.delegateTarget.checked;
    return this.collection.forEach(function(todo) {
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
});

;
//# sourceMappingURL=app.js.map