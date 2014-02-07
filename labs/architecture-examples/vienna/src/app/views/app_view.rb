require 'views/footer_view'

class AppView < Vienna::View
  element '#todoapp'

  on :keypress, '#new-todo' do |e|
    value = @input.value.strip
    if e.which == 13 and !value.empty?
      Todo.create title: value, completed: false
      @input.value = ''
    end
  end

  on :click, '#toggle-all' do
    complete_all = Todo.all.all?(&:completed) ? false : true
    Todo.all.each { |t| t.update(completed: complete_all) }
  end

  on :click, '#clear-completed' do
    Todo.completed.each { |t| t.destroy }
  end

  def initialize
    @footer     = FooterView.new
    @input      = Element.find '#new-todo'
    @main       = Element.find '#main'
    @toggle_all = Element.find '#toggle-all'
    @list       = Element.find '#todo-list'

    Todo.on(:create)  { render }
    Todo.on(:update)  { render }
    Todo.on(:destroy) { render }

    Todo.adapter.find_all(Todo) do |models|
      models.each { |m| add_todo m }
    end

    self.element
    self.render
  end
  attr_reader :footer

  def add_todo(todo)
    view = TodoView.new todo
    view.render
    @list << view.element
  end

  def render
    @completed = Todo.completed.size
    @active    = Todo.active.size

    if @active == 0
      @toggle_all[:checked] = :checked
    else
      @toggle_all.remove_attribute :checked
    end

    footer.completed_count = @completed
    footer.active_count = @active
    footer.filter = filter
    footer.render

    if @active+@completed == 0
      @main.hide
    else
      @main.show
    end

    @list.html = ''
    Todo.filter_by(@filter).each do |todo|
      add_todo todo
    end
  end

  attr_accessor :filter
end
