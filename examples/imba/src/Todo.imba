import Controller from './Controller'

export tag Todo < li
    prop todo

    def edit
        flag('editing')
        @input.value = @todo.title
        @input.focus

    def cancel
        unflag('editing')
        @input.blur

    def setTitle
        unflag('editing')
        let title = @input.value.trim
        if title != @todo.title
            Controller.rename(@todo,title)

    def render
        <self .completed=(@todo.completed) .editing=(@editing)>
            <div.view>
                <input .toggle :tap=(do Controller.toggle(@todo)) type='checkbox' checked=@todo.completed>
                <label :dblclick.edit> @todo.title
                <button.destroy :tap=(do Controller.remove(@todo))>
            <input@input.edit :keydown.enter.setTitle :keydown.esc.cancel :blur.setTitle>
