(ns todomvc.components.todos-filters
  (:require [todomvc.session :as session]))

(defn selected-class [display-type todos-display-type]
  (if (= display-type
         todos-display-type)
    "selected" ""))

(defn component []
  [:ul#filters
   [:li [:a {:class (selected-class :all @session/todos-display-type)  :href "#/"} "All"]]
   [:li [:a {:class (selected-class :active @session/todos-display-type) :href "#/active"} "Active"]]
   [:li [:a {:class (selected-class :completed @session/todos-display-type) :href "#/completed"} "Completed"]]])
