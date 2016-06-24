System.register(['aurelia-router', './todos'], function (_export) {
	'use strict';

	var Router, Todos, App;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	return {
		setters: [function (_aureliaRouter) {
			Router = _aureliaRouter.Router;
		}, function (_todos) {
			Todos = _todos.Todos;
		}],
		execute: function () {
			App = (function () {
				_createClass(App, null, [{
					key: 'inject',
					value: function inject() {
						return [Router];
					}
				}]);

				function App(router) {
					_classCallCheck(this, App);

					this.router = router;
					this.router.configure(this.configureRoutes);
				}

				_createClass(App, [{
					key: 'configureRoutes',
					value: function configureRoutes(cfg) {
						cfg.title = 'TodoMVC';
						cfg.map([{ route: ['', ':filter'], moduleId: 'todos' }]);
					}
				}]);

				return App;
			})();

			_export('App', App);
		}
	};
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7b0JBR2EsR0FBRzs7Ozs7Ozs7MkJBSFIsTUFBTTs7a0JBQ04sS0FBSzs7O0FBRUEsTUFBRztpQkFBSCxHQUFHOztZQUNGLGtCQUFHO0FBQUUsYUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQUU7OztBQUV6QixhQUhDLEdBQUcsQ0FHSCxNQUFNLEVBQUU7MkJBSFIsR0FBRzs7QUFJZCxTQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixTQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDNUM7O2lCQU5XLEdBQUc7O1lBUUEseUJBQUMsR0FBRyxFQUFFO0FBQ3BCLFNBQUcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFNBQUcsQ0FBQyxHQUFHLENBQUMsQ0FDUCxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQzdDLENBQUMsQ0FBQztNQUNIOzs7V0FiVyxHQUFHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Um91dGVyfSBmcm9tICdhdXJlbGlhLXJvdXRlcic7XG5pbXBvcnQge1RvZG9zfSBmcm9tICcuL3RvZG9zJztcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG5cdHN0YXRpYyBpbmplY3QoKSB7IHJldHVybiBbUm91dGVyXTsgfVxuXG5cdGNvbnN0cnVjdG9yKHJvdXRlcikge1xuXHRcdHRoaXMucm91dGVyID0gcm91dGVyO1xuXHRcdHRoaXMucm91dGVyLmNvbmZpZ3VyZSh0aGlzLmNvbmZpZ3VyZVJvdXRlcyk7XG5cdH1cblxuXHRjb25maWd1cmVSb3V0ZXMoY2ZnKSB7XG5cdFx0Y2ZnLnRpdGxlID0gJ1RvZG9NVkMnO1xuXHRcdGNmZy5tYXAoW1xuXHRcdFx0eyByb3V0ZTogWycnLCAnOmZpbHRlciddLCBtb2R1bGVJZDogJ3RvZG9zJyB9XG5cdFx0XSk7XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
