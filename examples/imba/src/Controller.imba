import { Model } from './Model'

class Controller
    prop store

    def initialize
        store = {
            newTodoTitle: '',
            todos: []
        }
        load

    # add todo
    def addTodo input
        const newTodoTitle = store:newTodoTitle.trim
        if newTodoTitle
            store:todos.push Model(newTodoTitle)
            input.value = ''
            store:newTodoTitle = ''
            persist
            
    # remove todo
    def remove todo
        store:todos = store:todos.filter(|t| t != todo)
        persist

    def toggle todo
        todo:completed = !todo:completed
        persist

    def rename todo, title
        todo:title = title
        persist

    def toggleAll e
        for todo in store:todos
            todo:completed = e.target.checked
        persist

    # get completed todos
    def completed
        store:todos.filter(|todo| todo:completed )

    # get not completed todos
    def remaining
        store:todos.filter(|todo| !todo:completed )
    
    # get location hash
    def hash
        window:location:hash

    # remove all completed todos from collection
    def archive
        store:todos = remaining
        persist

    # load todos from localstorage
    def load
        const items = JSON.parse(window:localStorage.getItem('todos-imba') or '[]')
        store:todos = items.map do |todo| Model(todo:title, todo:completed)

    # persist todos to localstorage
    def persist
        const json = JSON.stringify(store:todos)
        if json != @json
            window:localStorage.setItem('todos-imba', @json = json)

module:exports:controller = Controller.new