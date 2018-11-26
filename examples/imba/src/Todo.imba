import Controller from './Controller'

export tag Todo < li
    prop todo
    prop id
    prop editing

    def edit
        Controller.changeEditing(@id)
        @input.value = @todo.title
        setTimeout(&,10) do @input.focus

    def cancel
        Controller.changeEditing(null)

    def setTitle
        Controller.changeEditing(null)
        if let title = @input.value.trim
            Controller.rename(@todo,title)

    def render
        <self .completed=(@todo.completed) .editing=(@editing)>
            <div.view>
                <input .toggle :tap=(do Controller.toggle(@todo)) type='checkbox' checked=@todo.completed>
                <label :dblclick.edit> @todo.title
                <button.destroy :tap=(do Controller.remove(@todo))>
            <input@input.edit :keydown.enter.setTitle :keydown.esc.cancel :blur.setTitle>
