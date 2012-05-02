define(["js/data/Model"], function (Bindable) {
    return Bindable.inherit("app.model.Todo", {
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