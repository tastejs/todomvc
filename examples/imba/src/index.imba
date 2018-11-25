import { Model } from './Store'
import { Todo } from './Todo'

tag App
    prop todos

    def addTodo
        if @newTodoTitle is undefined or @newTodoTitle is ''
            return
        @todos.push Model.new(@newTodoTitle)
        @newTodoTitle = ''

    def removeTodo todo
        @todos = @todos.filter(|t| t != todo)

    def completed
        @todos.filter(|todo| todo.completed )

    def remaining
        @todos.filter(|todo| !todo.completed )

    def archive
        @todos = remaining

    def hash
        window:location:hash

    def render
        var items = @todos
        var active = remaining
        var done = completed

        if hash is '#/completed'
            items = done
        elif hash is '#/active'
            items = active

        <self>
            <form.header :submit.prevent.addTodo>
                <input[@newTodoTitle] placeholder="Add...">
                <button type='submit'> 'Add item'

            <div> for todo in items
                <Todo todo=todo :remove.removeTodo(todo)>

            <footer.footer>
                <span.todo-count>
                    <strong> "{active.len} "
                    active.len == 1 ? 'item' : 'items'
                    ' left'
                <ul.filters>
                    <li> <a .selected=(items is todos) href='#/'> 'All'
                    <li> <a .selected=(items is active) href='#/active'> 'Active'
                    <li> <a .selected=(items is done) href='#/completed'> 'Completed'

                if done.len > 0
                    <button.clear-completed :tap.archive> 'Clear completed'

    
Imba.mount <App todos=[]>
