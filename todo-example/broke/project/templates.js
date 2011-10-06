(function(context, undefined){
    var
        genericTaskTemplate= '<li class="item" data-app_label="{{ task.__class__._meta.appLabel }}" data-model="{{ task.__class__._meta.modelName }}" data-pk="{{ task.pk }}">'+
            '<input type="checkbox" data-field="is_complete" data-href="#/task/complete/{{ task.pk }}/" {% if task.fields.is_complete %} checked="checked"{% endif %} />' +
            '<span data-field="title">{{ task.title }}</span>' +
            '<a class="edit" href="#/task/update/{{ task.pk }}/"></a>' +
            '<a class="destroy" href="#/task/delete/{{ task.pk }}/"></a>' +
        '</li>'
    ;

    todo.templates= {
        list: '<ul class="items">' +
            '{% for task in taskList %}' +
                genericTaskTemplate +
            '{% endfor %}' +
        '</ul>'
        ,view: genericTaskTemplate
        ,create: ''
        ,update: '<li class="item" data-app_label="{{ task.__class__._meta.appLabel }}" data-model="{{ task.__class__._meta.modelName }}" data-pk="{{ task.pk }}">'+
            '<form action="#/task/update/{{ task.pk }}/">' +
                '<input type="text" name="title" value="{{ task.title }}" />' +
            '</form>' +
        '</li>'
    };
})(this);