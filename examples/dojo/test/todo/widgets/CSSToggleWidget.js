define([
	'intern!bdd',
	'intern/chai!expect',
	'dojo/_base/declare',
	'dojo/dom-class',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'todo/widgets/CSSToggleWidget',
	'../../handleCleaner',
	'dojo/text!./templates/CSSToggleWidget.html',
	'dojox/mvc/at'
], function (bdd, expect, declare, domClass,
	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, CSSToggleWidget, handleCleaner, template) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	// For supporting Intern's true/false check
	/*jshint -W030*/
	bdd.describe('Test todo/widgets/CSSToggleWidget', function () {
		var handles = [];
		bdd.afterEach(handleCleaner(handles));

		bdd.it('Standalone', function () {
			var w = new (declare(CSSToggleWidget, {
				buildRendering: function () {
					this.inherited(arguments);
					this.fooNode = this.domNode.appendChild(document.createElement('div'));
					this.barNode = this.domNode.appendChild(document.createElement('div'));
				},
				_setDijitDisplayNoneAttr: [
					{
						node: 'fooNode',
						type: 'classExists'
					},
					{
						node: 'barNode',
						type: 'classExists',
						className: 'dijitHidden'
					}
				]
			}))({
				dijitDisplayNone: true
			});
			handles.push(w);
			expect(domClass.contains(w.fooNode, 'dijitDisplayNone')).to.be.true;
			expect(domClass.contains(w.barNode, 'dijitHidden')).to.be.true;
			w.set('dijitDisplayNone', false);
			expect(domClass.contains(w.fooNode, 'dijitDisplayNone')).to.be.false;
			expect(domClass.contains(w.barNode, 'dijitHidden')).to.be.false;
		});

		bdd.it('In template', function () {
			var w = new (declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
				templateString: template
			}))({
				teeny: true
			});
			handles.push(w);
			w.startup();
			expect(domClass.contains(w.testNode.domNode, 'dijitTeeny')).to.be.true;
			w.set('teeny', false);
			expect(domClass.contains(w.testNode.domNode, 'dijitTeeny')).to.be.false;
		});
	});
});
