class Batmanjs extends Batman.App
  # Make Batmanjs available in the global namespace so it can be used
  # as a namespace and bound to in views.
  @global yes

  # Source the AppController and set the root route to AppController#index.
  @model 'todo'
  @controller 'todos'
  @root 'todos#index'
