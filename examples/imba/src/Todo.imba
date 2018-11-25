export tag Todo
    prop todo

    def toggleTodo
        @todo.completed = !@todo.completed
        trigger('changed')

    def editing
        @newTitle = @todo.title
        @editing = yes

    def setTitle
        @todo.title = @newTitle
        @editing = no
        trigger('changed')

    def render
        <self>
            if @editing
                <input[@newTitle] :keydown.enter.setTitle>
            <span .done=(@todo.completed)> @todo.title
            <button :tap.toggleTodo> !@todo.completed ? 'Completed' : 'ToDo'
            if !@editing
                <button :tap.editing> 'Rename'
            else
                <button :tap.setTitle> 'Save'
            <button :tap.trigger('remove')> 'Remove'
