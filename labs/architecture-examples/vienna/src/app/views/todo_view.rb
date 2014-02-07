require 'vienna/template_view'

class TodoView < Vienna::TemplateView
  template :todo
  RETURN_KEY = 13
  ESCAPE_KEY = 27

  on :dblclick, 'label' do
    @element.add_class 'editing'
    @input.focus
  end

  on :keyup, '.edit' do |e|
    case e.which
    when RETURN_KEY; finish_editing
    when ESCAPE_KEY; cancel_editing
    end
  end

  on :blur, '.edit' do
    finish_editing
  end

  on :click, '.destroy' do
    @todo.destroy
  end

  on :click, '.toggle' do
    @todo.update :completed => !@todo.completed
  end

  def initialize(todo)
    @todo = todo
    @todo.on(:update) { render }
    @todo.on(:destroy) { remove }
  end

  def clear
    @todo.destroy
  end

  def finish_editing
    value = @input.value.strip
    @element.remove_class 'editing'
    value.empty? ? clear : @todo.update(:title => value)
  end

  def cancel_editing
    @input.value = @todo.title
    @element.remove_class 'editing'
  end

  def remove
    element.remove
  end

  def render
    super
    @element.toggle_class 'completed', @todo.completed?
    @input = element.find '.edit'
  end

  def tag_name
    :li
  end
end
