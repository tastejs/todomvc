package templates

// This package has been automatically generated with temple.
// Do not edit manually!

import (
	"github.com/go-humble/temple/temple"
)

var (
	GetTemplate     func(name string) (*temple.Template, error)
	GetPartial      func(name string) (*temple.Partial, error)
	GetLayout       func(name string) (*temple.Layout, error)
	MustGetTemplate func(name string) *temple.Template
	MustGetPartial  func(name string) *temple.Partial
	MustGetLayout   func(name string) *temple.Layout
)

func init() {
	var err error
	g := temple.NewGroup()

	if err = g.AddPartial("footer", `<span class="todo-count">
	<strong>{{ len .Todos.Remaining }}</strong>
	item{{ if ne (len .Todos.Remaining) 1}}s{{end}} left
</span>
<ul class="filters">
	<li>
		<a {{ if eq .Path "#/"}} class="selected" {{ end }} href="#/">All</a>
	</li>
	<li>
		<a {{ if eq .Path "#/active"}} class="selected" {{ end }} href="#/active">Active</a>
	</li>
	<li>
		<a {{ if eq .Path "#/completed"}} class="selected" {{ end }} href="#/completed">Completed</a>
	</li>
</ul>

<button class="clear-completed {{ if eq (len .Todos.Completed) 0}}hidden{{ end }}">
	Clear completed
</button>
`); err != nil {
		panic(err)
	}

	if err = g.AddPartial("todo", `<!-- <li {{ if .Completed }}class="completed"{{ end }}> -->
	<div class="view">
		<input class="toggle" type="checkbox" {{ if .Completed }}checked{{ end }}>
		<label>{{ .Title }}</label>
		<button class="destroy"></button>
	</div>
	<input class="edit" value="{{ .Title }}">
<!-- </li> -->
`); err != nil {
		panic(err)
	}

	if err = g.AddTemplate("app", `<header class="header">
	<h1>todos</h1>
	<input class="new-todo" placeholder="What needs to be done?" autofocus>
</header>
{{ if gt (len .Todos.All) 0 }}
<section class="main">
	<input class="toggle-all" type="checkbox" {{ if eq (len .Todos.All) (len .Todos.Completed) }}checked{{ end }}>
	<label for="toggle-all">Mark all as complete</label>
	<ul class="todo-list">
	</ul>
</section>
{{ end }}
{{ if gt (len .Todos.All) 0 }}
<footer class="footer">
	{{ template "partials/footer" . }}
</footer>
{{ end }}
`); err != nil {
		panic(err)
	}

	GetTemplate = g.GetTemplate
	GetPartial = g.GetPartial
	GetLayout = g.GetLayout
	MustGetTemplate = g.MustGetTemplate
	MustGetPartial = g.MustGetPartial
	MustGetLayout = g.MustGetLayout
}
