'use strict';

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $on = helpers.$on;
var setView = function setView() {
	return todo.controller.setView(document.location.hash);
};

var Todo =
/**
 * Init new Todo List
 * @param  {string} The name of your list
 */
function Todo(name) {
	_classCallCheck(this, Todo);

	this.storage = new _store2.default(name);
	this.model = new _model2.default(this.storage);

	this.template = new _template2.default();
	this.view = new _view2.default(this.template);

	this.controller = new _controller2.default(this.model, this.view);
};

var todo = new Todo('todos-vanillajs');

$on(window, 'load', setView);
$on(window, 'hashchange', setView);