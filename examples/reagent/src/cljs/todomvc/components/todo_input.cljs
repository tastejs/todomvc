(ns todomvc.components.todo-input
  (:require [reagent.core :as reagent]
            [todomvc.actions :as actions]
            [todomvc.helpers :as helpers]))

(defn on-key-down [k title default]
  (let [key-pressed (.-which k)]
    (condp = key-pressed
      helpers/enter-key (actions/add-todo title default)
      nil)))

(defn component-render []
  (let [default ""
        title (reagent/atom default)]
    (fn []
      [:input.new-todo {:type "text"
                        :value @title
                        :placeholder "What needs to be done?"
                        :on-change #(reset! title (-> % .-target .-value))
                        :on-key-down #(on-key-down % title default)}])))

(defn component-did-mount [x]
  (.focus (reagent/dom-node x)))

(defn component []
  (reagent/create-class {:reagent-render component-render
                         :component-did-mount component-did-mount}))
