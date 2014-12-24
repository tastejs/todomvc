define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/on',
	'todo/widgets/TodoEscape',
	'../../handleCleaner'
], function (bdd, expect, on, TodoEscape, handleCleaner) {
	'use strict';

	var ESCAPE_KEY = 27;

	bdd.describe('Test todo/widgets/TodoEscape', function () {
		var handles = [];
		bdd.afterEach(handleCleaner(handles));

		bdd.it('Emitting custom event', function () {
			var count = 0;
			var w = new TodoEscape().placeAt(document.body);
			handles.push(w);
			w.on('escape', function () {
				++count;
			});
			w.startup();
			w.emit('keydown', {
				keyCode: ESCAPE_KEY
			});
			w.emit('keydown', {});
			expect(count).to.equal(1);
		});
	});
});
