"use strict"

###
Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
###
window.todomvc.directive "todoFocus", ($timeout) ->
  (scope, elem, attrs) ->
    scope.$watch attrs.todoFocus, (newval) ->
      if newval
        $timeout (->
          elem[0].focus()
        ), 0, false


