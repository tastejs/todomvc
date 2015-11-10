package views

import (
	"strings"

	"github.com/go-humble/examples/todomvc/go/models"
	"github.com/go-humble/examples/todomvc/go/templates"
	"github.com/go-humble/temple/temple"
	"github.com/go-humble/view"
	"honnef.co/go/js/dom"
)

var (
	todoTmpl = templates.MustGetPartial("todo")
)

// Todo is a view for a single todo item.
type Todo struct {
	Model *models.Todo
	tmpl  *temple.Partial
	view.DefaultView
	events []*view.EventListener
}

// NewTodo creates and returns a new Todo view, using the given todo as the
// model.
func NewTodo(todo *models.Todo) *Todo {
	return &Todo{
		Model: todo,
		tmpl:  todoTmpl,
	}
}

// Render renders the Todo view and satisfies the view.View interface.
func (v *Todo) Render() error {
	for _, event := range v.events {
		event.Remove()
	}
	v.events = []*view.EventListener{}
	if err := v.tmpl.ExecuteEl(v.Element(), v.Model); err != nil {
		return err
	}
	v.delegateEvents()
	return nil
}

// delegateEvents adds all the needed event listeners to the Todo view.
func (v *Todo) delegateEvents() {
	v.events = append(v.events,
		view.AddEventListener(v, "click", ".toggle", v.Toggle))
	v.events = append(v.events,
		view.AddEventListener(v, "click", ".destroy", v.Remove))
	v.events = append(v.events,
		view.AddEventListener(v, "dblclick", "label", v.Edit))
	v.events = append(v.events,
		view.AddEventListener(v, "blur", ".edit", v.CommitEdit))
	v.events = append(v.events,
		view.AddEventListener(v, "keypress", ".edit",
			triggerOnKeyCode(enterKey, v.CommitEdit)))
	v.events = append(v.events,
		view.AddEventListener(v, "keydown", ".edit",
			triggerOnKeyCode(escapeKey, v.CancelEdit)))
}

// Toggle toggles the completeness of the todo.
func (v *Todo) Toggle(ev dom.Event) {
	v.Model.Toggle()
}

// Remove removes the todo form the list.
func (v *Todo) Remove(ev dom.Event) {
	v.Model.Remove()
}

// Edit puts the Todo view into an editing state, changing it's appearance and
// allowing it to be edited.
func (v *Todo) Edit(ev dom.Event) {
	addClass(v.Element(), "editing")
	input := v.Element().QuerySelector(".edit").(*dom.HTMLInputElement)
	input.Focus()
	// Move the cursor to the end of the input.
	input.SelectionStart = input.SelectionEnd + len(input.Value)
}

// CommitEdit sets the title of the todo to the new title. After the edit has
// been committed, the todo is no longer in the editing state.
func (v *Todo) CommitEdit(ev dom.Event) {
	input := v.Element().QuerySelector(".edit").(*dom.HTMLInputElement)
	newTitle := strings.TrimSpace(input.Value)
	// If the newTitle is an empty string, delete the todo. Otherwise set the
	// new title.
	if newTitle != "" {
		v.Model.SetTitle(newTitle)
	} else {
		v.Model.Remove()
	}
}

// CancelEdit resets the title of the todo to its old value. It does not commit
// the edit. After the edit has been canceled, the todo is no longer in the
// editing state.
func (v *Todo) CancelEdit(ev dom.Event) {
	removeClass(v.Element(), "editing")
	input := v.Element().QuerySelector(".edit").(*dom.HTMLInputElement)
	input.Value = v.Model.Title()
	input.Blur()
}
