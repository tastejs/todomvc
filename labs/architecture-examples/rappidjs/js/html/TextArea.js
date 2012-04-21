var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.html.TextArea",
        ["js.html.DomElement", "js.core.TextElement"], function (DomElement, TextElement) {
            return DomElement.inherit({
                _renderChild: function(child){
                    if(child instanceof TextElement){
                        // contains two way binding ...
                        var text = this._getTextContentFromDescriptor(child.$descriptor);
                        /*
                        if(this._isBindingDefinition(text)){
                            this._initBinding(text,"value");
                        } */
                    }
                },
                _renderValue: function(value){
                    if(Element.textContent){
                        this.$el.textContent = value;
                    }else{
                        this.$el.innerText = value;
                    }

                },
                _bindDomEvents: function(){
                    var self = this;
                    this.addEventListener('change', function (e) {
                        self.set('value', e.target ? e.target.value : self.$el.innerText);
                    });
                }
            });
        }
    );
});