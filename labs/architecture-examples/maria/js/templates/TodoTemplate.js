// In a full development environment this template would be expressed
// in a file containing only HTML and be compiled to the following as part
// of the server/build functionality.
//
// Due to the limitations of a simple example that does not require
// any special server environment to try, the manually compiled version is
// included here.
//
checkit.TodoTemplate =
    '<li class="todo">' +
        '<div class="display">' +
            '<input class="check" type="checkbox">' +
            '<span class="todo-content"></span>' +
            '<span class="todo-destroy">delete</span>' +
        '</div>' +
        '<div class="edit">' +
            '<input class="todo-input" type="text">' +
            '<span class="ui-tooltip-top" style="display:none;">Press enter to update this task.</span>' +
        '</div>' +
    '</li>';
