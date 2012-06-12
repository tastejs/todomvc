maria.SetView.subclass(checkit, 'TodosListView', {
    modelConstructor: checkit.TodosModel,
    properties: {
        createChildView: function(todoModel) {
            return new checkit.TodoView(todoModel);
        }
    }
});
