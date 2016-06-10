define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/_base/declare',
	'dijit/_TemplatedMixin',
	'todo/widgets/TodoFocus',
	'../../handleCleaner',
	'dojo/text!./templates/TodoFocus.html'
], function (bdd, expect, declare, _TemplatedMixin, TodoFocus, handleCleaner, template) {
	'use strict';

	bdd.describe('Test todo/widgets/TodoFocus', function () {
		var handles = [];
		bdd.afterEach(handleCleaner(handles));

		bdd.it('Focus on domNode', function () {
			var w = new TodoFocus({}, document.createElement('input')).placeAt(document.body);
			handles.push(w);
			w.set('shouldGetFocus', false);
			expect(document.activeElement).not.to.equal(w.domNode);
			w.set('shouldGetFocus', true);
			expect(document.activeElement).to.equal(w.domNode);
		});

		bdd.it('Focus on focusNode defined in template', function () {
			var w = new (declare([TodoFocus, _TemplatedMixin], {
				templateString: template
			}))().placeAt(document.body);
			handles.push(w);
			w.set('shouldGetFocus', true);
			expect(document.activeElement).to.equal(w.focusNode);
		});
	});
});
