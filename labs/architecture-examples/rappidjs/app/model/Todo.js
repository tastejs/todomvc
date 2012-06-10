<<<<<<< HEAD
define(["js/data/Model"], function (Model) {
    return Model.inherit("app.model.Todo", {
=======
define(["js/data/Model"], function (Bindable) {
    return Bindable.inherit("app.model.Todo", {
>>>>>>> ff2959b913b2a0489bcd4d67eb2c021582beaa36
        defaults: {
            title: "",
            completed: false
        },
        setCompleted: function (completed) {
            this.set("completed", completed);
        },
        isCompleted: function () {
            return this.$.completed;
        },
        status: function () {
            return this.$.completed ? "done" : '';
        }.onChange("completed"),
        hasTitle: function () {
            return this.$.title.trim().length;
        }.onChange("title")
    });
});