maria.ElementView.subclass(checkit, 'TodosStatsView', {
    properties: {
        buildData: function() {
            this.find('.todos-count').innerHTML = this.getModel().length;
        },
        update: function() {
            this.buildData();
        }
    }
});
