(todomvc.directive 'todoFocus (di-fn ($timeout)
   (fn (scope elem attrs)
     (scope.$watch attrs.todoFocus
                   (fn (newVal)
                     (if newVal ($timeout #(elem @0 .focus) 0 false)))))))

