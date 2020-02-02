'use strict';



;define('todomvc/app', ['exports', 'todomvc/resolver', 'ember-load-initializers', 'todomvc/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
;define('todomvc/components/todo-item', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		repo: Ember.inject.service(),
		tagName: 'li',
		editing: false,
		classNameBindings: ['todo.completed', 'editing'],

		actions: {
			startEditing() {
				this.onStartEdit();
				this.set('editing', true);
				Ember.run.scheduleOnce('afterRender', this, 'focusInput');
			},

			doneEditing(todoTitle) {
				if (!this.editing) {
					return;
				}
				if (Ember.isBlank(todoTitle)) {
					this.send('removeTodo');
				} else {
					this.set('todo.title', todoTitle.trim());
					this.set('editing', false);
					this.onEndEdit();
				}
			},

			handleKeydown(e) {
				if (e.keyCode === 13) {
					e.target.blur();
				} else if (e.keyCode === 27) {
					this.set('editing', false);
				}
			},

			toggleCompleted(e) {
				let todo = this.todo;
				Ember.set(todo, 'completed', e.target.checked);
				this.repo.persist();
			},

			removeTodo() {
				this.repo.delete(this.todo);
			}
		},

		focusInput() {
			this.element.querySelector('input.edit').focus();
		}
	});
});
;define('todomvc/components/todo-list', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		repo: Ember.inject.service(),
		tagName: 'section',
		classNames: ['main'],
		canToggle: true,
		allCompleted: Ember.computed('todos.@each.completed', function () {
			return this.todos.isEvery('completed');
		}),

		actions: {
			enableToggle() {
				this.set('canToggle', true);
			},

			disableToggle() {
				this.set('canToggle', false);
			},

			toggleAll() {
				let allCompleted = this.allCompleted;
				this.todos.forEach(todo => Ember.set(todo, 'completed', !allCompleted));
				this.repo.persist();
			}
		}
	});
});
;define('todomvc/controllers/active', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		todos: Ember.computed.filterBy('model', 'completed', false)
	});
});
;define('todomvc/controllers/application', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		repo: Ember.inject.service(),
		remaining: Ember.computed.filterBy('model', 'completed', false),
		completed: Ember.computed.filterBy('model', 'completed'),
		actions: {
			createTodo(e) {
				if (e.keyCode === 13 && !Ember.isBlank(e.target.value)) {
					this.repo.add({ title: e.target.value.trim(), completed: false });
					e.target.value = '';
				}
			},

			clearCompleted() {
				this.model.removeObjects(this.completed);
				this.repo.persist();
			}
		}
	});
});
;define('todomvc/controllers/completed', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		todos: Ember.computed.filterBy('model', 'completed', true)
	});
});
;define('todomvc/helpers/app-version', ['exports', 'todomvc/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;

    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
;define('todomvc/helpers/gt', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.gt = gt;
	function gt([n1, n2] /*, hash*/) {
		return n1 > n2;
	}

	exports.default = Ember.Helper.helper(gt);
});
;define('todomvc/helpers/pluralize', ['exports', 'ember-inflector'], function (exports, _emberInflector) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.pluralizeHelper = pluralizeHelper;
	function pluralizeHelper([singular, count] /*, hash*/) {
		return count === 1 ? singular : (0, _emberInflector.pluralize)(singular);
	}

	exports.default = Ember.Helper.helper(pluralizeHelper);
});
;define('todomvc/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
;define('todomvc/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'todomvc/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let name, version;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
;define('todomvc/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
;define('todomvc/initializers/export-application-global', ['exports', 'todomvc/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
;define('todomvc/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
;define('todomvc/router', ['exports', 'todomvc/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('active');
    this.route('completed');
  });

  exports.default = Router;
});
;define('todomvc/routes/application', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend({
		repo: Ember.inject.service(),
		model() {
			return this.repo.findAll();
		}
	});
});
;define('todomvc/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define('todomvc/services/repo', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Service.extend({
		lastId: 0,
		data: null,
		findAll() {
			return this.data || this.set('data', JSON.parse(window.localStorage.getItem('todos') || '[]'));
		},

		add(attrs) {
			let todo = Object.assign({ id: this.incrementProperty('lastId') }, attrs);
			this.data.pushObject(todo);
			this.persist();
			return todo;
		},

		delete(todo) {
			this.data.removeObject(todo);
			this.persist();
		},

		persist() {
			window.localStorage.setItem('todos', JSON.stringify(this.data));
		}
	});
});
;define("todomvc/templates/active", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6ksfe8D/", "block": "{\"symbols\":[],\"statements\":[[1,[27,\"todo-list\",null,[[\"todos\"],[[23,[\"todos\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "todomvc/templates/active.hbs" } });
});
;define("todomvc/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "TN69YPIG", "block": "{\"symbols\":[],\"statements\":[[7,\"section\"],[11,\"class\",\"todoapp\"],[9],[0,\"\\n  \"],[7,\"header\"],[11,\"class\",\"header\"],[9],[0,\"\\n    \"],[7,\"h1\"],[9],[0,\"todos\"],[10],[0,\"\\n    \"],[7,\"input\"],[11,\"class\",\"new-todo\"],[12,\"onkeydown\",[27,\"action\",[[22,0,[]],\"createTodo\"],null]],[11,\"placeholder\",\"What needs to be done?\"],[11,\"autofocus\",\"\"],[9],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[1,[21,\"outlet\"],false],[0,\"\\n\"],[4,\"if\",[[27,\"gt\",[[23,[\"model\",\"length\"]],0],null]],null,{\"statements\":[[0,\"    \"],[7,\"footer\"],[11,\"class\",\"footer\"],[9],[0,\"\\n      \"],[7,\"span\"],[11,\"class\",\"todo-count\"],[9],[7,\"strong\"],[9],[1,[23,[\"remaining\",\"length\"]],false],[10],[0,\" \"],[1,[27,\"pluralize\",[\"item\",[23,[\"remaining\",\"length\"]]],null],false],[0,\" left\"],[10],[0,\"\\n      \"],[7,\"ul\"],[11,\"class\",\"filters\"],[9],[0,\"\\n        \"],[7,\"li\"],[9],[4,\"link-to\",[\"index\"],[[\"activeClass\"],[\"selected\"]],{\"statements\":[[0,\"All\"]],\"parameters\":[]},null],[10],[0,\"\\n        \"],[7,\"li\"],[9],[4,\"link-to\",[\"active\"],[[\"activeClass\"],[\"selected\"]],{\"statements\":[[0,\"Active\"]],\"parameters\":[]},null],[10],[0,\"\\n        \"],[7,\"li\"],[9],[4,\"link-to\",[\"completed\"],[[\"activeClass\"],[\"selected\"]],{\"statements\":[[0,\"Completed\"]],\"parameters\":[]},null],[10],[0,\"\\n      \"],[10],[0,\"\\n\"],[4,\"if\",[[23,[\"completed\",\"length\"]]],null,{\"statements\":[[0,\"        \"],[7,\"button\"],[11,\"class\",\"clear-completed\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"clearCompleted\"],null]],[9],[0,\"Clear completed\"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[10],[0,\"\\n\"],[7,\"footer\"],[11,\"class\",\"info\"],[9],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Double-click to edit a todo\"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"\\n    Created by\\n    \"],[7,\"a\"],[11,\"href\",\"http://github.com/cibernox\"],[9],[0,\"Miguel Camba\"],[10],[0,\",\\n    \"],[7,\"a\"],[11,\"href\",\"http://github.com/addyosmani\"],[9],[0,\"Addy Osmani\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Part of \"],[7,\"a\"],[11,\"href\",\"http://todomvc.com\"],[9],[0,\"TodoMVC\"],[10],[10],[0,\"\\n\"],[10]],\"hasEval\":false}", "meta": { "moduleName": "todomvc/templates/application.hbs" } });
});
;define("todomvc/templates/completed", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jQja7Xz4", "block": "{\"symbols\":[],\"statements\":[[1,[27,\"todo-list\",null,[[\"todos\"],[[23,[\"todos\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "todomvc/templates/completed.hbs" } });
});
;define("todomvc/templates/components/todo-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rpTJMidP", "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"view\"],[9],[0,\"\\n  \"],[7,\"input\"],[11,\"class\",\"toggle\"],[12,\"checked\",[23,[\"todo\",\"completed\"]]],[12,\"onchange\",[27,\"action\",[[22,0,[]],\"toggleCompleted\"],null]],[11,\"type\",\"checkbox\"],[9],[10],[0,\"\\n  \"],[7,\"label\"],[12,\"ondblclick\",[27,\"action\",[[22,0,[]],\"startEditing\"],null]],[9],[1,[23,[\"todo\",\"title\"]],false],[10],[0,\"\\n  \"],[7,\"button\"],[11,\"class\",\"destroy\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"removeTodo\"],null]],[9],[10],[0,\"\\n\"],[10],[0,\"\\n\"],[7,\"input\"],[11,\"class\",\"edit\"],[12,\"value\",[23,[\"todo\",\"title\"]]],[12,\"onblur\",[27,\"action\",[[22,0,[]],\"doneEditing\"],[[\"value\"],[\"target.value\"]]]],[12,\"onkeydown\",[27,\"action\",[[22,0,[]],\"handleKeydown\"],null]],[11,\"autofocus\",\"\"],[9],[10]],\"hasEval\":false}", "meta": { "moduleName": "todomvc/templates/components/todo-item.hbs" } });
});
;define("todomvc/templates/components/todo-list", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ar59JxGR", "block": "{\"symbols\":[\"todo\"],\"statements\":[[4,\"if\",[[23,[\"todos\",\"length\"]]],null,{\"statements\":[[4,\"if\",[[23,[\"canToggle\"]]],null,{\"statements\":[[0,\"    \"],[7,\"input\"],[11,\"id\",\"toggle-all\"],[11,\"class\",\"toggle-all\"],[12,\"checked\",[21,\"allCompleted\"]],[12,\"onchange\",[27,\"action\",[[22,0,[]],\"toggleAll\"],null]],[11,\"type\",\"checkbox\"],[9],[10],[0,\"\\n    \"],[7,\"label\"],[11,\"for\",\"toggle-all\"],[9],[0,\"Mark all as complete\"],[10],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[7,\"ul\"],[11,\"class\",\"todo-list\"],[9],[0,\"\\n\"],[4,\"each\",[[23,[\"todos\"]]],null,{\"statements\":[[0,\"      \"],[1,[27,\"todo-item\",null,[[\"todo\",\"onStartEdit\",\"onEndEdit\"],[[22,1,[]],[27,\"action\",[[22,0,[]],\"disableToggle\"],null],[27,\"action\",[[22,0,[]],\"enableToggle\"],null]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[10],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "todomvc/templates/components/todo-list.hbs" } });
});
;define("todomvc/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+pDjlhXg", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[23,[\"model\",\"length\"]]],null,{\"statements\":[[0,\"  \"],[1,[27,\"todo-list\",null,[[\"todos\"],[[23,[\"model\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "todomvc/templates/index.hbs" } });
});
;

;define('todomvc/config/environment', [], function() {
  var prefix = 'todomvc';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("todomvc/app")["default"].create({"name":"todomvc","version":"0.0.0+1a595254"});
          }
        
//# sourceMappingURL=todomvc.map
