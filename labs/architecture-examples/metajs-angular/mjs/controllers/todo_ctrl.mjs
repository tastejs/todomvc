(todomvc.controller
 'TodoCtrl
 (scope-fn ($scope $location todoStorage filterFilter)
   (def todos (todoStorage.get))
   (def newTodo "")
   (def editedTodo null)
   (def originalTodo null)
   (def location $location)
   (def remainingCount null)
   (def completedCount null)
   (def allChecked null)
   (def statusFilter null)


   (defn todoIndex (todo)
     (todos.indexOf todo))

   (defn setTodo (index todo)
     (set (get todos index) todo))

   (defn addTodo ()
     (when-let text (newTodo.trim)
               (todos.push {title: text
                            completed: false})
               (set newTodo "")))

   (defn editTodo (todo)
     ;; Clone the original todo to restore it on demand.
     (set editedTodo todo
          originalTodo (angular.extend {} todo)))

   (defn removeTodo (todo)
     (todos.splice (todoIndex) 1))

   (defn doneEditing (todo)
     (set editedTodo null
          todo.title (todo.title.trim))
     (when-not todo.title
       (removeTodo todo)))

   (defn revertEditing (todo)
     (setTodo (todoIndex) originalTodo)
     (doneEditing originalTodo))


   (defn clearCompletedTodos ()
     (set todos (todos.filter #(not (get % 'completed)))))

   (defn markAll (completed)
     (todos.forEach #(set (get % 'completed) (not completed))))

   ($watch "todos"
           (fn (newValue oldValue)
             (set remainingCount (filterFilter todos {completed: false} @length)
                  completedCount (- todos.length remainingCount)
                  allChecked (not remainingCount))
             (when (!= newValue oldValue)
               (todoStorage.put todos)))
           true)

   (when (= ($location.path) "")
     ($location.path "/"))

   ($watch "location.path()"
           (fn (path)
             (set statusFilter
                  (switch path
                          "/active" {completed: false}
                          "/completed" {completed: true}
                          null))))))
