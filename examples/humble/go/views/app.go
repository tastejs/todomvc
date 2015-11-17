package views

import (
	"strings"

	"github.com/go-humble/examples/todomvc/go/models"
	"github.com/go-humble/examples/todomvc/go/templates"
	"github.com/go-humble/temple/temple"
	"github.com/go-humble/view"
	"honnef.co/go/js/dom"
)

const (
	// Constants for certain keycodes.
	enterKey  = 13
	escapeKey = 27
)

var (
	appTmpl  = templates.MustGetTemplate("app")
	document = dom.GetWindow().Document()
)

// App is the main view for the application.
type App struct {
	Todos *models.TodoList
	tmpl  *temple.Template
	// predicate will be used to filter the todos when rendering. Only
	// todos for which the predicate is true will be rendered.
	predicate models.Predicate
	view.DefaultView
	events []*view.EventListener
}

// UseFilter causes the app to use the given predicate to filter the todos when
// rendering. Only todos for which the predicate returns true will be rendered.
func (v *App) UseFilter(predicate models.Predicate) {
	v.predicate = predicate
}

// NewApp creates and returns a new App view, using the given todo list.
func NewApp(todos *models.TodoList) *App {
	v := &App{
		Todos: todos,
		tmpl:  appTmpl,
	}
	v.SetElement(document.QuerySelector(".todoapp"))
	return v
}

// tmplData returns the data that is passed through to the template for the
// view.
func (v *App) tmplData() map[string]interface{} {
	return map[string]interface{}{
		"Todos": v.Todos,
		"Path":  dom.GetWindow().Location().Hash,
	}
}

// Render renders the App view and satisfies the view.View interface.
func (v *App) Render() error {
	for _, event := range v.events {
		event.Remove()
	}
	v.events = []*view.EventListener{}
	if err := v.tmpl.ExecuteEl(v.Element(), v.tmplData()); err != nil {
		return err
	}
	listEl := v.Element().QuerySelector(".todo-list")
	for _, todo := range v.Todos.Filter(v.predicate) {
		todoView := NewTodo(todo)
		// NOTE: the todomvc tests require that the top-level element for the
		// todo view is an li element. Unfortunately there is no way to express
		// this while also having template logic determine whether or not the
		// li element should have the class "completed". I would prefer to have
		// the top-level element for each todo be a div wrapper, and to include
		// the li element inside the template. The workaround for now is to create
		// the li element and set it's class manually.
		todoView.SetElement(document.CreateElement("li"))
		if todo.Completed() {
			addClass(todoView.Element(), "completed")
		}
		view.AppendToEl(listEl, todoView)
		if err := todoView.Render(); err != nil {
			return err
		}
	}
	v.delegateEvents()
	return nil
}

// delegateEvents adds all the needed event listeners to the view.
func (v *App) delegateEvents() {
	v.events = append(v.events,
		view.AddEventListener(v, "keypress", ".new-todo",
			triggerOnKeyCode(enterKey, v.CreateTodo)))
	v.events = append(v.events,
		view.AddEventListener(v, "click", ".clear-completed", v.ClearCompleted))
	v.events = append(v.events,
		view.AddEventListener(v, "click", ".toggle-all", v.ToggleAll))
}

// CreateTodo is an event listener which creates a new todo and adds it to the
// todo list.
func (v *App) CreateTodo(ev dom.Event) {
	input, ok := ev.Target().(*dom.HTMLInputElement)
	if !ok {
		panic("Could not convert event target to dom.HTMLInputElement")
	}
	title := strings.TrimSpace(input.Value)
	if title != "" {
		v.Todos.AddTodo(title)
		document.QuerySelector(".new-todo").(dom.HTMLElement).Focus()
	}
}

// ClearCompleted is an event listener which removes all the completed todos
// from the list.
func (v *App) ClearCompleted(ev dom.Event) {
	v.Todos.ClearCompleted()
}

// ToggleAll toggles all the todos in the list.
func (v *App) ToggleAll(ev dom.Event) {
	input := ev.Target().(*dom.HTMLInputElement)
	if !input.Checked {
		v.Todos.UncheckAll()
	} else {
		v.Todos.CheckAll()
	}
}

// triggerOnKeyCode triggers the given event listener iff the keCode for the
// event matches the given keyCode. It can be used to gain finer control over
// which keys trigger a certain event.
func triggerOnKeyCode(keyCode int, listener func(dom.Event)) func(dom.Event) {
	return func(ev dom.Event) {
		keyEvent, ok := ev.(*dom.KeyboardEvent)
		if ok && keyEvent.KeyCode == keyCode {
			listener(ev)
		}
	}
}

// addClass adds class to the given element. It retains any other classes that
// the element may have.
func addClass(el dom.Element, class string) {
	newClasses := class
	if oldClasses := el.GetAttribute("class"); oldClasses != "" {
		newClasses = oldClasses + " " + class
	}
	el.SetAttribute("class", newClasses)
}

// removeClass removes the given class from the element it retains any other
// classes that the element may have.
func removeClass(el dom.Element, class string) {
	oldClasses := el.GetAttribute("class")
	if oldClasses == class {
		// The only class present was the one we want to remove. Remove the class
		// attribute entirely.
		el.RemoveAttribute("class")
	}
	classList := strings.Split(oldClasses, " ")
	for i, currentClass := range classList {
		if currentClass == class {
			newClassList := append(classList[:i], classList[i+1:]...)
			el.SetAttribute("class", strings.Join(newClassList, " "))
		}
	}
}
