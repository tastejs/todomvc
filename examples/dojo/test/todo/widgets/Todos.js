define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/_base/array',
	'dojo/_base/declare',
	'dojo/router',
	'dojo/Deferred',
	'dojo/Stateful',
	'dojo/store/Memory',
	'dojox/mvc/at',
	'dojox/mvc/getPlainValue',
	'todo/widgets/Todos',
	'../../handleCleaner'
], function (bdd, expect, array, declare, router, Deferred, Stateful, Memory, at, getPlainValue, Todos, handleCleaner) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	// For supporting Intern's true/false check
	/*jshint -W030*/
	bdd.describe('Test todo/widgets/Todos', function () {
		var w;
		var handles = [];
		var initialData = [
			{
				title: 'Foo',
				completed: false,
				id: 1
			},
			{
				title: 'Bar',
				completed: true,
				id: 2
			},
			{
				title: 'Baz',
				completed: true,
				id: 3
			}
		];

		bdd.afterEach(handleCleaner(handles));

		var emptyTemplateString = '<div><\/div>';
		var TestTodos = declare(Todos, {
			templateString: emptyTemplateString,
			one: 'item left',
			other: 'items left',
			statusForElem: 'active',
			postMixInProperties: function () {
				this.inherited(arguments);
				this.set('isEmpty', at(this.get('todos'), 'length').transform(this.emptyConverter));
				this.set('remainingCountMessage', at(this, 'remainingCount').transform(this.pluralizeConverter));
				this.set('statusMatches', at(this, 'status').transform(this.statusConverter));
			}
		});
		bdd.beforeEach(function () {
			// Create fresh Todo instance for each test case
			handles.push(w = new TestTodos({
				store: new Memory({data: initialData.slice()})
			}));
			w.startup();
		});

		bdd.it('Default store', function () {
			var w = new Todos({
				templateString: emptyTemplateString
			});
			handles.push(w);
			expect(w.store.storageId).to.equal('todos-dojo');
		});

		bdd.it('Initial data', function () {
			expect(getPlainValue(w.get('todos'))).to.deep.equal(initialData);
			expect(w.get('remainingCount')).to.equal(1);
			expect(w.get('completedCount')).to.equal(2);
			expect(w.get('areAllChecked')).not.to.be.true;
			expect(w.get('isEmpty')).not.to.be.true;
			expect(w.get('remainingCountMessage')).to.equal('item left');
			expect(w.get('statusMatches')).not.to.be.true;
		});

		bdd.it('Routing', function () {
			expect(getPlainValue(w.get('filteredTodos'))).to.deep.equal(initialData);
			router.go('/active');
			expect(getPlainValue(w.get('filteredTodos'))).to.deep.equal([
				{
					title: 'Foo',
					completed: false,
					id: 1
				}
			]);
			expect(w.get('statusMatches')).to.be.true;
			router.go('/completed');
			expect(getPlainValue(w.get('filteredTodos'))).to.deep.equal([
				{
					title: 'Bar',
					completed: true,
					id: 2
				},
				{
					title: 'Baz',
					completed: true,
					id: 3
				}
			]);
			expect(w.get('statusMatches')).not.to.be.true;
			router.go('/');
			expect(getPlainValue(w.get('filteredTodos'))).to.deep.equal(initialData);
			expect(w.get('statusMatches')).not.to.be.true;
			router.go('');
			expect(getPlainValue(w.get('filteredTodos'))).to.deep.equal(initialData);
			expect(w.get('statusMatches')).not.to.be.true;
		});

		bdd.it('Adding todo', function () {
			var preventedDefault;
			var fakeEvent = {
				preventDefault: function () {
					preventedDefault = true;
				}
			};
			w.set('newTodo', ' ');
			w.addTodo(fakeEvent);
			expect(preventedDefault).to.be.true;
			expect(w.store.data).to.deep.equal(initialData);

			preventedDefault = false;
			w.set('newTodo', 'Qux');
			w.addTodo(fakeEvent);
			expect(preventedDefault).to.be.true;
			var newOne = array.filter(w.store.data, function (entry) {
				return [1, 2, 3].indexOf(entry.id) < 0;
			});
			expect(newOne.length).to.equal(1);
			expect(newOne[0].title).to.equal('Qux');
			expect(newOne[0].completed).not.to.be.true;
			expect(w.get('remainingCountMessage')).to.equal('items left');
		});

		bdd.it('Saving change', function () {
			w.saveTodo({
				title: 'Bar0',
				completed: false,
				id: 2
			});
			expect(w.store.data).to.deep.equal([
				{
					title: 'Foo',
					completed: false,
					id: 1
				},
				{
					title: 'Bar0',
					completed: false,
					id: 2
				},
				{
					title: 'Baz',
					completed: true,
					id: 3
				}
			]);
		});

		bdd.it('Removing todo', function () {
			w.removeTodo(initialData[1]);
			expect(w.store.data).to.deep.equal([
				{
					title: 'Foo',
					completed: false,
					id: 1
				},
				{
					title: 'Baz',
					completed: true,
					id: 3
				}
			]);
			w.removeTodo(initialData[0]);
			w.removeTodo(initialData[2]);
			expect(w.get('isEmpty')).to.be.true;
		});

		bdd.it('Reverting todo', function () {
			var todo = w.get('todos')[1];
			var original = {
				title: todo.get('title'),
				completed: todo.get('completed'),
				id: todo.get('id')
			};
			todo.set('title', 'Bar0');
			w.replaceTodo(todo, original);
			expect(getPlainValue(w.get('todos'))).to.deep.equal(initialData);
			w.replaceTodo({}, original);
			expect(getPlainValue(w.get('todos'))).to.deep.equal(initialData);
		});

		bdd.it('Marking all todos as complete', function () {
			w.set('areAllChecked', !w.get('areAllChecked'));
			w.markAll();
			expect(array.every(w.store.data, function (todo) {
				return todo.completed;
			})).to.be.true;
			w.set('areAllChecked', !w.get('areAllChecked'));
			w.markAll();
			expect(array.every(w.store.data, function (todo) {
				return !todo.completed;
			})).to.be.true;
		});

		bdd.it('Removing completed todos', function () {
			w.clearCompletedTodos();
			expect(w.store.data).to.deep.equal([
				{
					title: 'Foo',
					completed: false,
					id: 1
				}
			]);
		});

		bdd.it('Error accessing store', function () {
			function failPromiseMethod() {
				var dfd = new Deferred();
				dfd.reject(new Error());
				return dfd.promise;
			}

			var w = new Todos({
				templateString: emptyTemplateString,
				store: {
					add: failPromiseMethod,
					put: failPromiseMethod,
					remove: failPromiseMethod,
					query: function () {
						return [];
					},
					getIdentity: function () {}
				}
			});
			handles.push(w);

			w.set('newTodo', 'Foo');

			return w.addTodo(new CustomEvent('dummy')).then(function () {
				throw new Error('addTodo() shouldn\'t succeed if the corresponding store method doesn\'t.');
			}, function () {
				expect(w.get('saving')).not.to.be.true;
			}).then(function () {
				var todo = new Stateful({
					title: 'Foo1',
					completed: true,
					id: 1
				});
				return w.saveTodo(todo, 'Foo0', false).then(function () {
					throw new Error('saveTodo() shouldn\'t succeed if the corresponding store method doesn\'t.');
				}, function () {
					expect(w.get('saving')).not.to.be.true;
					expect(todo.get('title')).to.equal('Foo0');
					expect(todo.get('completed')).not.to.be.true;
				});
			}).then(function () {
				return w.removeTodo().then(function () {
					throw new Error('removeTodo() shouldn\'t succeed if the corresponding store method doesn\'t.');
				}, function () {
					expect(w.get('saving')).not.to.be.true;
				});
			});
		});
	});
});
