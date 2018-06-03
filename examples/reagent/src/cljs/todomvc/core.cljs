(ns todomvc.core
  (:require [reagent.core :as reagent]
            [todomvc.session :as session]
            [todomvc.actions :as actions]
            [todomvc.helpers :as helpers]
            [todomvc.components.title :as title]
            [todomvc.components.todo-input :as todo-input]
            [todomvc.components.footer :as footer]
            [todomvc.components.todos-toggle :as todos-toggle]
            [todomvc.components.todos-list :as todos-list]
            [todomvc.components.todos-count :as todos-count]
            [todomvc.components.todos-filters :as todos-filters]
            [todomvc.components.todos-clear :as todos-clear]))

(defn todo-app []
  [:div
   [:section.todoapp
    [:header.header
     [title/component]
     [todo-input/component]]
    [:div {:style
           {:display (helpers/display-elem (helpers/todos-any?
                                            @session/todos))}}
     [:section.main
      [todos-toggle/component]
      [todos-list/component (helpers/todos-all @session/todos)]]
     [:footer.footer
      [todos-count/component]
      [todos-filters/component]
      [todos-clear/component]
      ]]]
   [footer/component]])

(defn ^:export run []
  (reagent/render [todo-app]
                  (js/document.getElementById "app")))
