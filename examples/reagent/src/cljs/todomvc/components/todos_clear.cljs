(ns todomvc.components.todos-clear
  (:require [todomvc.session :as session]
            [todomvc.actions :as actions]
            [todomvc.helpers :as helpers]))

(defn component []
  [:button.clear-completed {:on-click #(actions/clear-completed-todos @session/todos)
                            :style {:display (helpers/display-elem (helpers/todos-any-completed?
                                                                    @session/todos))}}
   "Clear completed"])
