(function(context, undefined){
    var
        genericTaskTemplate= '<li ' +
            'class="item {{ task.fields.is_complete }} {% if task.fields.is_complete %} done{% endif %}" ' +
            'data-app_label="{{ task.__class__._meta.appLabel }}" ' +
            'data-model="{{ task.__class__._meta.modelName }}" ' +
            'data-pk="{{ task.pk }}">'+

            '<div class="todo" data-href="#/task/update/{{ task.pk }}/">'+
                '<input type="checkbox" class="check" data-field="is_complete" data-href="#/task/complete/{{ task.pk }}/"{% if task.fields.is_complete %} checked="checked"{% endif %} />' +
                '<label data-field="title" class="todo-content">{{ task.title }}</label>' +
                '<a class="destroy" href="#/task/delete/{{ task.pk }}/"></a>' +
            '</div>'+

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
                '<input type="text" class="todo-input" name="title" value="{{ task.title }}" />' +
            '</form>' +
        '</li>'
    };
})(this);