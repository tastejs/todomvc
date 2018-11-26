import controller from './Controller'
import { Todo } from './Todo'

tag App
        
    def render
        var items = controller.store:todos
        var active = controller.remaining
        var done = controller.completed
        var hash = controller.hash

        if hash is '#/completed'
            items = done
        elif hash is '#/active'
            items = active

        <self>
            <header.header>
                <h1> 'todos'
                <input[controller.store:newTodoTitle] .new-todo :keydown.enter=(do controller.addTodo) placeholder="What needs to be done?" autofocus=true>

            <section.main>
                <input.toggle-all#toggle-all type='checkbox' :change=(do |e| controller.toggleAll(e)) checked=(active.len is 0)>
                <label for="toggle-all"> 'Mark all as complete'
            
            <ul.todo-list> for todo, id in items
                <Todo todo=todo>

            <footer.footer>
                <span.todo-count>
                    <strong> "{active.len} "
                    active.len == 1 ? 'item' : 'items'
                    ' left'
                <ul.filters>
                    <li> <a .selected=(items is controller.store:todos) href='#/'> 'All'
                    <li> <a .selected=(items is active) href='#/active'> 'Active'
                    <li> <a .selected=(items is done) href='#/completed'> 'Completed'

                if done.len > 0
                    <button.clear-completed :tap=(do controller.archive)> 'Clear completed'

    
Imba.mount <App.todoapp>
