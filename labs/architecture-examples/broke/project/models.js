(function(context, undefined){
    var
        models= broke.db.models
    ;

    todo.models= {};

    models.Model.create({
        __name__: "todo.models.Task"
        ,title: models.CharField({ max_length: 200 })
        ,is_complete: models.BooleanField({ 'default': false })
    });
})(this);