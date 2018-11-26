import Controller from './Controller'

export tag Todo
    prop todo
    prop editing
    prop id
    prop edit

   

    def editing
        if !@editing
            @edit(id)
            @newTitle = @todo.title

    def exit
        @editing = no
        @newTitle = ''

    def setTitle
        if @editing
            @todo.title = @newTitle
            @editing = no
            trigger('changed')

    def render
        <self>
            <li .completed=(@todo.completed) .editing=(@editing)>
                <div.view>
                    <input .toggle :tap=(do Controller.toggle(@todo)) type='checkbox' checked=(@todo.completed)>
                    <label :dblclick.editing> @todo.title
                    <button.destroy :tap=(do Controller.remove(@todo))>
                <input[@newTitle] .edit :keydown.esc.exit :blur.setTitle :keydown.enter.setTitle>
