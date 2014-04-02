require 'vienna/adapters/local'

class Todo < Vienna::Model
  adapter Vienna::LocalAdapter

  attributes :title, :completed

  alias completed? completed

  # All active (not completed) todos
  def self.active
    all.reject(&:completed)
  end

  # All completed todos
  def self.completed
    all.select(&:completed)
  end

  def self.filter_by filter
    case filter
    when :completed; completed
    when :active;    active
    else             all
    end
  end
end
