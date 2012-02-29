(function(context, undefined){
    var
        models= broke.db.models
    ;

    todo.models= {};

    models.Model.create({
        __name__: "todo.models.Task"
        ,title: models.CharField({ max_length: 200 })
        ,is_complete: models.BooleanField({ 'default': false })
        /*,update: function(kwargs){
            if('is_complete' in kwargs && kwargs['is_complete']) {
                this.elements().addClass('done');
            } else if('is_complete' in kwargs && !kwargs['is_complete']) {
                this.elements().removeClass('done');
            }

            return this._super(kwargs);
        }*/
    });

    models.Model.create({
        __name__: "todo.models.Counter"
        ,count: models.PositiveIntegerField({ 'default': 0 })
    });
})(this);