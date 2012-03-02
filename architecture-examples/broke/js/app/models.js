(function(context, undefined){
    var
        models= broke.db.models
    ;

    todo.models= {};

    models.Model.create({
        __name__: "todo.models.Task"
        ,title: models.CharField({ max_length: 200 })
        ,is_complete: models.BooleanField({ 'default': false })
        ,update: function(kwargs){
            if('is_complete' in kwargs && kwargs['is_complete']) {
                this.elements().addClass('done');
            } else if('is_complete' in kwargs && !kwargs['is_complete']) {
                this.elements().removeClass('done');
            }

            return this._super(kwargs);
        }
    });

    models.Model.create({
        __name__: "todo.models.Counter"
        ,count: models.PositiveIntegerField({ 'default': 0 })
        ,update: function(kwargs){
            var result = this._super(kwargs);

            if(this.fields.count === undefined) {
                this.elements().find('[data-field="count"]').hide();
            } else {
                this.elements().find('[data-field="count"]').show();
            }

            if(!this.fields.completed) {
                this.elements().find('[data-field="completed"]').parent().andSelf().hide();
            } else {
                this.elements().find('[data-field="completed"]').parent().andSelf().show();
            }

            if(!this.fields.completed && !this.fields.count) {
                this.elements().hide();
            } else {
                this.elements().show();
            }

            return result;
        }
    });
})(this);