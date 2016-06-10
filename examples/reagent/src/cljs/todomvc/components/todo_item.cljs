(ns todomvc.components.todo-item
  (:require [reagent.core :as reagent]
            [todomvc.session :as session]
            [todomvc.actions :as actions]
            [todomvc.helpers :as helpers]
            [todomvc.components.todo-edit :as todo-edit]))

(defn todo-item-class [completed editing]
  (str (when completed "completed ")
       (when @editing "editing")))

(defn todo-checkbox [id completed]
  [:input.toggle {:type "checkbox" 
                  :checked completed
                  :on-change #(actions/toggle-todo id)}])

(defn component [todo]
  (let [editing (reagent/atom false)]
    (fn [{:keys [id title completed] :as todo}]
      [:li {:class (todo-item-class completed editing)
            :style {:display (helpers/display-elem
                              (helpers/todo-display-filter completed @session/todos-display-type))}}
       [:div.view
        [todo-checkbox id completed]
        [:label {:on-double-click #(reset! editing true)} title]
        [:button.destroy {:on-click #(actions/delete-todo id)}]]
       [todo-edit/component todo editing]])))
