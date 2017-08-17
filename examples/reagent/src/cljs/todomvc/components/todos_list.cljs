(ns todomvc.components.todos-list
  (:require [todomvc.components.todo-item :as todo-item]))

(defn component [todos]
  [:ul.todo-list
   (for [todo todos]
     ^{:key (:id todo)}
     [todo-item/component todo])])
