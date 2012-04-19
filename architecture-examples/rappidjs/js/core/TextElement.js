requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.core.TextElement",
        ["js.core.Element", "js.core.Binding"], function (Element, Binding) {

            return Element.inherit({
                _initializeBindings: function () {
                    if(this.$descriptor){
                        var textContent = this._getTextContentFromDescriptor(this.$descriptor);
                        this.$.textContent = Binding.evaluateText(textContent, this, "textContent");
                    }

                },
                render: function () {
                    if (!this.$initialized) {
                        this._initialize(this.$creationPolicy);
                    }

                    this.$el = this.$systemManager.$document.createTextNode("");
                    if(!rAppid._.isUndefined(this.$.textContent)){
                        this._renderTextContent(this.$.textContent);

                    }

                    return this.$el;
                },
                _renderTextContent: function (textContent) {
                    this.$el.data = textContent;
                } ,
                _commitChangedAttributes:function (attributes) {
                    if (this.$el) {
                        if(!rAppid._.isUndefined(attributes.textContent)){
                            this._renderTextContent(attributes.textContent);
                        }
                    }
                }
            });
        }
    );
});