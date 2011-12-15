class window.Task extends Spine.Model
  @configure 'Task', 'name', 'done'
  @extend Spine.Model.Local

  @active: ->
    @select (task) -> !task.done

  @done: ->
    @select (task) -> !!task.done

  @destroyDone: ->
    task.destroy() for task in @done()
