require 'opal'
require 'vienna'
require 'models/todo'

RSpec.configure do |config|
  config.before { Todo.reset! }
end

describe Todo do
  before do
    @task_a = Todo.create(title: 'Foo', completed: true)
    @task_b = Todo.create(title: 'Bar', completed: false)
    @task_c = Todo.create(title: 'Baz', completed: true)
    @task_d = Todo.create(title: 'Buz', completed: false)
  end

  describe '.active' do
    it "returns all non-completed todos" do
      expect(Todo.active).to eq([@task_b, @task_d])
    end
  end

  describe '.completed' do
    it "returns all completed todos" do
      expect(Todo.completed).to eq([@task_a, @task_c])
    end
  end
end
