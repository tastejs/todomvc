import controller from './Controller'

export tag Todo < li
    prop todo

    def edit
        flag('editing')
        @input.value = todo:title
        setTimeout(&,10) do @input.focus

    def cancel
        unflag('editing')
        @input.blur

    def setTitle
        unflag('editing')
        if const title = @input.value.trim
            controller.rename(todo,title)
        else
            controller.remove(todo)
    
    def onfocusout e
        setTitle if hasFlag('editing')

    def render
        <self .completed=(todo:completed) .editing=(@editing)>
            <.view>
                <input.toggle
                    :click=(do controller.toggle(todo))
                    type='checkbox'
                    checked=todo:completed
                >
                <label :dblclick.edit> todo:title
                <button.destroy :click=(do controller.remove(todo))>
            <input@input.edit :keydown.enter.setTitle :keydown.esc.cancel>
