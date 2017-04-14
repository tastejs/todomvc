###
Sets up defaults for all the Template methods such as a default template

@constructor
###
class Template
    constructor: () ->
        @.defaultTemplate =  """
            <li data-id=\"{{id}}\" class=\"{{completed}}\">
                   <div class=\"view\">
                       <input class=\"toggle\" type=\"checkbox\" {{checked}}>
                       <label>{{title}}</label>
                       <button class=\"destroy\"></button>
                  </div>
            </li>
        """

    ###
    Creates an <li> HTML string and returns it for placement in your app.

    NOTE: In real life you should be using a templating engine such as Mustache
    or Handlebars, however, this is a vanilla JS example.

    @param {object} data The object containing keys you want to find in the
                         template to replace.
    @returns {string} HTML String of an <li> element

    @example
    view.show({
     id: 1,
     title: "Hello World",
     completed: 0,
    });
    ###
    show: (data) ->
        view = ''

        for item in data
            template = @.defaultTemplate;
            completed = '';
            checked = '';

            if item.completed
                completed = 'completed'
                checked = 'checked'

            template = template.replace '{{id}}', item.id
            template = template.replace '{{title}}', item.title
            template = template.replace '{{completed}}', completed
            template = template.replace '{{checked}}', checked

            view = view + template

        return view;

    ###
    Displays a counter of how many to dos are left to complete

    @param {number} activeTodos The number of active todos.
    @returns {string} String containing the count
    ###
    itemCounter: (activeTodos) ->
        plural = if activeTodos == 1 then '' else 's'

        return '<strong>' + activeTodos + '</strong> item' + plural + ' left'

    ###
    Updates the text within the "Clear completed" button

    @param  {[type]} completedTodos The number of completed todos.
    @returns {string} String containing the count
    ###
    clearCompletedButton: (completedTodos) ->
        if completedTodos > 0
            return 'Clear completed (' + completedTodos + ')'
        else
            return ''

window.app = window.app || {};
window.app.Template = Template;