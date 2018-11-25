export tag Todo
    prop todo
    prop remove

    def toggleTodo
        @todo.completed = !@todo.completed

    def editing
        # hm...
        @newTitle = @todo.title
        @editing = yes

    def setTitle
        @todo.title = @newTitle
        @editing = no

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