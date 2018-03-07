(ns todomvc.components.todos-toggle
  (:require [todomvc.session :as session]
            [todomvc.actions :as actions]
            [todomvc.helpers :as helpers]))

(defn component []
  [:span
   [:input#toggle-all.toggle-all {:type "checkbox"
                       :checked (helpers/todos-all-completed? @session/todos)
                       :on-change #(actions/toggle-all-todos
                                    (helpers/todos-all-completed? @session/todos))}]
   [:label {:for "toggle-all"} "Mark all as complete"]])
