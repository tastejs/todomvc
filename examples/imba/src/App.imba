import Controller from './Controller'
import { Todo } from './Todo'

tag App
    prop store
        
    def render
        var items = @store:todos
        var active = Controller.remaining
        var done = Controller.completed
        var hash = Controller.hash

        if hash is '#/completed'
            items = done
        elif hash is '#/active'
            items = active

        <self>
            <section.main>
                <header.header>
                    <h1> 'todos'
                    <input[@store:newTodoTitle] .new-todo :keydown.enter=(do Controller.addTodo) placeholder="What needs to be done?" autofocus=true>

                <input.toggle-all type='checkbox' :change=(do Controller.toggleAll) checked=(active.len is 0)>
                <ul.todo-list> for todo, id in items
                    <Todo todo=todo id=id editing=(@store:editing is id)>

                <footer.footer>
                    <span.todo-count>
                        <strong> "{active.len} "
                        active.len == 1 ? 'item' : 'items'
                        ' left'
                    <ul.filters>
                        <li> <a .selected=(items is @store:todos) href='#/'> 'All'
                        <li> <a .selected=(items is active) href='#/active'> 'Active'
                        <li> <a .selected=(items is done) href='#/completed'> 'Completed'

                    if done.len > 0
                        <button.clear-completed :tap=(do Controller.archive)> 'Clear completed'

    
Imba.mount <App.todoapp store=Controller.store>
