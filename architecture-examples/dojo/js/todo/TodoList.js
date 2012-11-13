define([
	"dojo/_base/declare",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojox/mvc/WidgetList",
	"dojox/mvc/_InlineTemplateMixin",
	"todo/CssToggleWidget",
	"todo/ctrl/_HashCompletedMixin"
], function(declare, _TemplatedMixin, _WidgetsInTemplateMixin, WidgetList, _InlineTemplateMixin, CssToggleWidget, _HashCompletedMixin){
	return declare([WidgetList, _InlineTemplateMixin], {
		childClz: declare([CssToggleWidget,  _TemplatedMixin, _WidgetsInTemplateMixin, _HashCompletedMixin], {
			_setCompletedAttr: {type: "classExists", className: "completed"},
			_setHiddenAttr: {type: "classExists", className: "hidden"},

			onRemoveClick: function(){
				this.parent.listCtrl.removeItem(this.uniqueId);
			},

			onEditBoxChange: function(){
				if(!this.editBox.value){
					this.parent.listCtrl.removeItem(this.uniqueId);
				}
			}
		})
	});
});
