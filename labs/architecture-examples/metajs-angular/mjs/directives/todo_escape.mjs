(todomvc.directive 'todoEscape (di-fn ()
   (def escape-key 27)
   (fn (scope elem attrs)
     (elem.bind "keydown"
                (fn (event)
                  (when (= event.keyCode escape-key)
                    (scope.$apply attrs.todoEscape)))))))

