maria.ElementView.subclass(checkit, 'TodosToolbarView', {
    uiActions: {
        'click .allCheckbox'   : 'onClickAllCheckbox'  ,
        'click .markallDone'   : 'onClickMarkAllDone'  ,
        'click .markallUndone' : 'onClickMarkAllUndone',
        'click .deleteComplete': 'onClickDeleteDone'
    },
    properties: {
        buildData: function() {
            var model = this.getModel();
            var checkbox = this.find('.allCheckbox');
            checkbox.checked = model.isAllDone();
            checkbox.disabled = model.isEmpty();
        },
        update: function() {
            this.buildData();
        }
    }
});
