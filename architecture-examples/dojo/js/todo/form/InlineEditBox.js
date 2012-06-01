/**
 * Extension to the "InlineEditBox" widget to support editing on double click
 * events rather than single clicks. We need to override base "postMixInProperties"
 * lifecycle method where the event handlers are setup. This method is just a clone
 * of that code with the modified event list.
 */
define([
	"dijit/InlineEditBox",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class"
], function (InlineEditBox, declare, lang, domClass) {

    InlineEditBox._InlineEditor.prototype._onChange = function () {
        if(this.inlineEditBox.autoSave && this.inlineEditBox.editing && this.enableSave()){
			this._onBlur();
		}

    };
    return declare("todo.form.InlineEditBox", InlineEditBox, {

	    postMixInProperties: function () {
            // save pointer to original source node, since Widget nulls-out srcNodeRef
            this.displayNode = this.srcNodeRef;

            // connect handlers to the display node
            var events = {
                ondblclick: "_onClick",
                onmouseover: "_onMouseOver",
                onmouseout: "_onMouseOut",
                onfocus: "_onMouseOver",
                onblur: "_onMouseOut"
            };
            for(var name in events){
                this.connect(this.displayNode, name, events[name]);
            }
            this.displayNode.setAttribute("role", "button");
            if(!this.displayNode.getAttribute("tabIndex")){
                this.displayNode.setAttribute("tabIndex", 0);
            }

            if(!this.value && !("value" in this.params)){ // "" is a good value if specified directly so check params){
                this.value = lang.trim(this.renderAsHtml ? this.displayNode.innerHTML :
                                       (this.displayNode.innerText||this.displayNode.textContent||""));
            }
            if(!this.value){
                this.displayNode.innerHTML = this.noValueIndicator;
            }

            domClass.add(this.displayNode, 'dijitInlineEditBoxDisplayMode');
        },

        _onChange: function () {
            this.inherited(arguments);
            this._onBlur();
        }
    });
});
