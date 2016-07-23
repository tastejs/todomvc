package models

// Predicate is a function which takes a todo and returns a bool. It can be
// used in filters.
type Predicate func(*Todo) bool

// Predicates is a data structure with commonly used Predicates.
var Predicates = struct {
	All       Predicate
	Completed Predicate
	Remaining Predicate
}{
	All:       func(_ *Todo) bool { return true },
	Completed: (*Todo).Completed,
	Remaining: (*Todo).Remaining,
}

// All returns all the todos. It applies a filter using the All predicate.
func (list TodoList) All() []*Todo {
	return list.Filter(Predicates.All)
}

// Completed returns only those todos which are completed. It applies a filter
// using the Completed predicate.
func (list TodoList) Completed() []*Todo {
	return list.Filter(Predicates.Completed)
}

// Remaining returns only those todos which are remaining (or active). It
// applies a filter using the Remaining predicate.
func (list TodoList) Remaining() []*Todo {
	return list.Filter(Predicates.Remaining)
}

// Filter returns a slice todos for which the predicate is true. The returned
// slice is a subset of all todos.
func (list TodoList) Filter(f Predicate) []*Todo {
	results := []*Todo{}
	for _, todo := range list.todos {
		if f(todo) {
			results = append(results, todo)
		}
	}
	return results
}

// Invert inverts a predicate, i.e. a function which accepts a todo as an
// argument and returns a bool. It returns the inverted predicate. Where f would
// return true, the inverted predicate would return false and vice versa.
func invert(f Predicate) Predicate {
	return func(todo *Todo) bool {
		return !f(todo)
	}
}

// todoById returns a predicate which is true iff todo.id equals the given
// id.
func todoById(id string) Predicate {
	return func(t *Todo) bool {
		return t.id == id
	}
}

// todoNotById returns a predicate which is true iff todo.id does not equal
// the given id.
func todoNotById(id string) Predicate {
	return invert(todoById(id))
}
