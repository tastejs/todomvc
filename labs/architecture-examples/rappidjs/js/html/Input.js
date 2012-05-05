var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.html.Input",
        ["js.html.DomElement"], function (DomElement) {
            return DomElement.inherit({
                defaults: {
                    checked: false
                },
                _renderValue: function(value){
                    this.$el.value = value;
                },
                _renderChecked: function(checked){
                    this.$el.checked = checked;
                },
                _bindDomEvents: function(){

                    var self = this;
                    if (this.$el.type == "text" || this.$el.type == "password") {
                        this.addEventListener('change', function (e) {
                            self.set('value', self.$el.value);
                        });
                    } else if (this.$el.type == "checkbox" || this.$el.type == "radio") {
                        this.addEventListener('click', function (e) {
                            self.set('checked', self.$el.checked);
                        });
                    }

                    this.callBase();
                }
            });
        }
    );
});