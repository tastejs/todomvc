maria.ElementView.subclass(checkit, 'TodosStatsView', {
    modelConstructor: checkit.TodosModel,
    properties: {
        update: function() {
            this.find('.todos-count').innerHTML = this.getModel().length;
        }
    }
});
