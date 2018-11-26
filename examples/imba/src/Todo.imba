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
            <li .completed=(@todo.completed) .editing=(@editing)>
                <div.view>
                    <input .toggle :tap.toggleTodo type='checkbox' checked=(@todo.completed)>
                    <label :dblclick.editing> @todo.title
                    <button.destroy :tap.trigger('remove')>
                <input[@newTitle] .edit :blur.setTitle :keydown.enter.setTitle value=@todo.title>
