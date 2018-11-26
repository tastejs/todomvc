import controller from './Controller'

export tag Todo < li
    prop todo

    def edit
        flag('editing')
        @input.value = todo.title
        setTimeout(&,10) do @input.focus

    def cancel
        unflag('editing')
        @input.blur

    def setTitle
        unflag('editing')
        let title = @input.value.trim
        if title != todo.title
            controller.rename(todo,title)
    
    def onfocusout e
        setTitle if hasFlag('editing')

    def render
        <self .completed=(todo.completed) .editing=(@editing)>
            <div.view>
                <input .toggle :tap=(do controller.toggle(todo)) type='checkbox' checked=todo.completed>
                <label :dblclick.edit> todo.title
                <button.destroy :tap=(do controller.remove(todo))>
            <input@input.edit :keydown.enter.setTitle :keydown.esc.cancel>