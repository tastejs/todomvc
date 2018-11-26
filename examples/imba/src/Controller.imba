import { Model } from './Store'

class Controller
    # prop todos
    # prop newTodoTitle
    prop store

    def initialize
        @store = {
            newTodoTitle: '',
            todos: []
        }
        # @store:newTodoTitle = ''
        load

    # add todo
    def addTodo
        console.log @store:newTodoTitle
        # if @store:newTodoTitle
        #     @store:todos.push Model.new(@store:newTodoTitle)
        #     @store:newTodoTitle = ''
        #     persist
        # console.log @store:todos

    # # remove todo
    # def removeTodo todo
    #     @todos = @todos.filter(|t| t != todo)
    #     persist

    # def toggleAll e
    #     for todo in @todos
    #         todo.completed = e.target.checked
    #     persist


    # # get completed todos
    # def completed
    #     @todos.filter(|todo| todo.completed )

    # # get not completed todos
    # def remaining
    #     @todos.filter(|todo| !todo.completed )
    
    # # get location hash
    # def hash
    #     window:location:hash

    # # remove all completed todos from collection
    # def archive
    #     @todos = remaining
    #     persist

    # def edit id
    #     @editing = id

    # load todos from localstorage
    def load
        var items = JSON.parse(window:localStorage.getItem('todos-imba') or '[]')
        console.log(items)
        @store:todos = items.map do |todo| Model.new(todo:_title, todo:_completed)

    # # persist todos to localstorage
    # def persist
    #     var json = JSON.stringify(todos)
    #     if json != @json
    #         window:localStorage.setItem('todos-imba', @json = json)

module:exports:Controller = Controller.new