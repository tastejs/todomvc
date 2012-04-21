var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("app.model.Todo", ["js.core.Bindable"], function (Bindable) {
        return Bindable.inherit({
            defaults:{
                content:"",
                isDone: false
            },
            setDone:function (done) {
                this.set("isDone", done);
            },
            status: function(){
                if(this.$.isDone){
                    return "done";
                }else{
                    return "";
                }
            }.onChange("isDone","isEditing"),
            hasContent:function () {
                return this.$.content.length > 0;
            }.onChange("content")
        });
    });
});