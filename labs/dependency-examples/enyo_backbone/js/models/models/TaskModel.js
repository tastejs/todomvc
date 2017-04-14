enyo.ready(function () {
    ToDo.TaskModel = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false
        }
    });
});