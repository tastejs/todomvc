React = require 'react/addons'
{li,div,input,label,button} = React.DOM

ESCAPE_KEY = 27
ENTER_KEY = 13

TodoItem = React.createClass
  handleSubmit: ->
    val = this.state.editText.trim()
    if val
      @props.onSave(val)
      @setState({editText: val})
    else
      @props.onDestroy()
    return false

  # react optimizes renders by batching them. This means you cant call
  # parents onEdit (which in this case triggeres a re-render), and
  # immediately manipulate the DOM as if the renderings over. Put it as a
  # callback. Refer to app.js edit method
  handleEdit: ->
    @props.onEdit( () =>
      node = @refs.editField.getDOMNode()
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
      )
    @setState {editText: @props.todo.title}
    return

  handleKeyDown: (event) ->
    if event.which is ESCAPE_KEY
      @setState {editText: @props.todo.title}
      @props.onCancel()
    else if event.which is ENTER_KEY
      @handleSubmit()
    return

  handleChange: (event) ->
    @setState {editText: event.target.value}
    return

  getInitialState: ->
    {editText: @props.todo.title}

  # This is a completely optional performance enhancement that you can implement
  # on any React component. If you were to delete this method the app would
  # still work correctly (and still be very performant!), we just use it as
  # an example of how little code it takes to get an order of magnitude
  # performance improvement.
  shouldComponentUpdate:  (nextProps, nextState) ->
    nextProps.todo isnt @props.todo or
    nextProps.editing isnt @props.editing or
    nextState.editText isnt @state.editText

  render: ->
    cx = React.addons.classSet

    #console.log "item #{@props.todo.title}"

    li {className:cx({
      completed: @props.todo.completed,
      editing: this.props.editing})},
      div {className:'view'},
        input {
          className:'toggle'
          type:'checkbox'
          checked:@props.todo.completed
          onChange:@props.onToggle
          }
        label {onDoubleClick:@handleEdit},
          @props.todo.title
        button {className:'destroy',onClick:@props.onDestroy}
      input {
        ref:'editField'
        className:'edit'
        value:@state.editText
        onBlur:@handleSubmit
        onChange:@handleChange
        onKeyDown:@handleKeyDown
        }

module.exports = TodoItem
