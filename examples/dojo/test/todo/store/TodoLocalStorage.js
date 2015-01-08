define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/json',
	'dojo/when',
	'todo/store/TodoLocalStorage',
	'../../handleCleaner'
], function (bdd, expect, json, when, TodoLocalStorage, handleCleaner) {
	'use strict';

	var STORAGE_ID = 'todos-dojo-test';

	// For supporting Intern's true/false check
	/*jshint -W030*/
	bdd.describe('Test todo/TodoLocalStorage', function () {
		var handles = [];
		bdd.beforeEach(function () {
			localStorage.setItem(STORAGE_ID, json.stringify([
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
			]));
		});
		bdd.afterEach(handleCleaner(handles));

		bdd.it('Query', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			when(store.query({completed: true}), dfd.callback(function (data) {
				expect(data.slice()).to.deep.equal([
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
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Query - Empty storage', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			localStorage.removeItem(STORAGE_ID);
			when(store.query(), dfd.callback(function (data) {
				expect(data.slice()).to.deep.equal([]);
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Get', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			when(store.get(2), dfd.callback(function (data) {
				expect(data).to.deep.equal({
					title: 'Bar',
					completed: true,
					id: 2
				});
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Add - New', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			when(store.add({
				title: 'Qux',
				completed: false
			}), dfd.callback(function (id) {
				expect(json.parse(localStorage.getItem(STORAGE_ID))).to.deep.equal([
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
					},
					{
						title: 'Qux',
						completed: false,
						id: id
					}
				]);
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Add - Existing', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			try {
				when(store.add({
					title: 'Baz',
					completed: true,
					id: 3
				}), function () {
					dfd.reject(new Error('add() with existing ID shouldn\'t succeed.'));
				}, function () {
					dfd.resolve(1);
				});
			} catch (e) {
				dfd.resolve(1);
			}
		});

		bdd.it('Put - New', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			when(store.put({
				title: 'Qux',
				completed: false
			}), dfd.callback(function (id) {
				expect(json.parse(localStorage.getItem(STORAGE_ID))).to.deep.equal([
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
					},
					{
						title: 'Qux',
						completed: false,
						id: id
					}
				]);
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Put - Existing', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			when(store.put({
				title: 'Baz',
				completed: false
			}, {id: 3}), dfd.callback(function () {
				expect(json.parse(localStorage.getItem(STORAGE_ID))).to.deep.equal([
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
						completed: false,
						id: 3
					}
				]);
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Remove - Existing', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			when(store.remove(3), dfd.callback(function () {
				expect(json.parse(localStorage.getItem(STORAGE_ID))).to.deep.equal([
					{
						title: 'Foo',
						completed: false,
						id: 1
					},
					{
						title: 'Bar',
						completed: true,
						id: 2
					}
				]);
			}), function (e) {
				dfd.reject(e);
			});
		});

		bdd.it('Remove - Non-existing', function () {
			var dfd = this.async(1000);
			var store = new TodoLocalStorage({storageId: STORAGE_ID});
			try {
				when(store.remove(-1), function () {
					dfd.reject(new Error('remove() with non-existent ID should not succeed.'));
				}, function () {
					dfd.resolve(1);
				});
			} catch (e) {
				dfd.resolve(1);
			}
		});
	});
});
