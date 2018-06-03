<section class="todoapp">

    <header class="header">
        <h1>todos</h1>
        <input class="new-todo" class="newtodo" placeholder="What needs to be done?" autofocus>
    </header>

    <tpl if="values.length">
        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox" {[ this.controller.areAllComplete() ? "checked" : ""]}>
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">

                <tpl for=".">
                    <li class="todo {[ values.completed ? "completed" : "" ]} {[ values.editing ? "editing" : "" ]}">
                        <div class="view">
                            <input class="toggle" type="checkbox" {[ values.completed ? "checked" : ""]}>
                            <label>{ title }</label>
                            <button class="destroy"></button>
                        </div>
                        <input class="edit" value="{ title }">
                    </li>
                </tpl>

            </ul>
        </section>
    </tpl>

    <tpl if="values.length">
        <footer class="footer">
            <span class="todo-count"><strong>{[ this.controller.incompleteCount() ]}</strong> {[ ( this.controller.incompleteCount() == 1 ) ? "item" : "items" ]} left</span>
            <tpl if="this.controller.completedCount()">
                <button class="clear-completed">Clear completed</button>
            </tpl>
        </footer>
    </tpl>

</section>

<footer class="info">
    <p>Double-click to edit a todo</p>
    <p><a href="http://www.sencha.com" muse_scanned="true">ExtJS</a> with <a href="http://www.deftjs.com" muse_scanned="true">DeftJS</a> version created by <a href="http://www.briankotek.com" muse_scanned="true">Brian Kotek</a></p>
    <p>Part of <a href="http://todomvc.com" muse_scanned="true">TodoMVC</a></p>
</footer>
