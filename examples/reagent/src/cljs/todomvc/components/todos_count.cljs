(ns todomvc.components.todos-count
  (:require [todomvc.session :as session]
            [todomvc.helpers :as helpers]))

(defn items-left [todos]
  (let [active-count (count (helpers/todos-active todos))]
    (str (if (= 1 active-count) " item " " items ")
         "left")))

(defn component []
  [:span.todo-count
   [:strong (count (helpers/todos-active @session/todos))]
   (items-left @session/todos)])
