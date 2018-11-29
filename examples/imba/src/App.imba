import controller from './Controller'
import { Todo } from './Todo'

tag App
        
    def render
        let items = controller.store:todos
        const active = controller.remaining
        const done = controller.completed
        const hash = controller.hash

        if hash is '#/completed'
            items = done
        elif hash is '#/active'
            items = active

        <self>
            <header.header>
                <h1> 'todos'
                <input.new-todo
                    @input
                    [controller.store:newTodoTitle]
                    :keydown.enter=(do controller.addTodo(@input))
                    placeholder="What needs to be done?"
                    autofocus=true
                >

            <section.main>
                if items.len
                    <input
                        #toggle-all.toggle-all
                        type='checkbox'
                        :change=(do |e| controller.toggleAll(e))
                        checked=(!active.len)
                    >
                    <label for="toggle-all"> 'Mark all as complete'
            
            <ul.todo-list> for todo, id in items
                <Todo todo=todo>

            if items.len
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
                        <button.clear-completed :click=(do controller.archive)> 'Clear completed'

    
Imba.mount <App.todoapp>
