(function() {
    var todoView = Stapes.create(),
        taskTmpl;

    function bindEventHandlers() {
        $("#new-todo").on('keyup', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                todoView.emit('taskadd', $(this).val());
            }
        });

        $("#todo-list").on('click', '.destroy', function() {
            todoView.emit('taskdelete', $(this).parents('.item').data('id'));
        });

        $("#todo-list").on('click', 'input.toggle', function(e) {
            var event = $(this).is(':checked') ? 'taskdone' : 'taskundone';
            todoView.emit(event, $(this).parents('.item').data('id'));
        });

        $("#todo-list").on('dblclick', 'li', function(e) {
            todoView.emit('edittodo', $(this).data('id'));
        });

        $("#todo-list").on('keyup', 'input.todo-input', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                todoView.emit('taskedit', {
                    id : $(this).parents(".item").data('id'),
                    name : $(this).val()
                });
            }
        });

        $("#clear-completed").on('click', function() {
            todoView.emit('clearcompleted');
        });

        $("#toggle-all").on('click', function() {
            var isChecked = $(this).is(':checked');
            todoView.emit( isChecked ? 'doneall' : 'undoneall', isChecked === true);
        });
    }

    function loadTemplates(cb) {
        $.get(window.location + 'templates/task.html', function(tmpl) {
            cb(function(view) {
                return Mustache.to_html(tmpl, view);
            });
        });
    }

    todoView.extend({
        "clearInput" : function() {
            $("#new-todo").val('');
        },

        "hide" : function() {
            $("#main, footer").hide();
        },

        "init" : function() {
            bindEventHandlers();

            loadTemplates(function(tmpl) {
                taskTmpl = tmpl;
                todoView.emit('ready');
            });
        },

        "render" : function(tasks) {
            var html = taskTmpl({ "tasks" : tasks });
            $("#todo-list").html( html );
        },

        "show" : function() {
            $("#main, footer").show();
        },

        "showClearCompleted" : function(bool) {
            $("#clear-completed").toggle(bool);
        },

        "showLeft" : function(left) {
            var word = (left > 1) ? "items" : "item";
            $("#todo-count .number").text( left );
            $("#todo-count .word").text( word );
        }
    });

    window.TodoView = todoView;
})();