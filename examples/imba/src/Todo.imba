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
            # TODO: @todo.completed ? '.done' : '.editing'
            <li .done=(@todo.completed) .editing=(!@todo.completed)>
                <div .view>
                    <input .toggle :tap.toggleTodo checked=(@todo.completed)>
                    <label :dblclick.editing> @todo.title
                    <button.destroy :tap.trigger('remove')>
                <input[newTitle] .edit :blur.setTitle :keydown.enter.setTitle>
