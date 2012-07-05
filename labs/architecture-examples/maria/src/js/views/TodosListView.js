maria.SetView.subclass(checkit, 'TodosListView', {
    properties: {
        createChildView: function(todoModel) {
            return new checkit.TodoView(todoModel);
        }
    }
});
