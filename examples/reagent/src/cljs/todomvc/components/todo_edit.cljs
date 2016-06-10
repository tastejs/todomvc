(ns todomvc.components.todo-edit
  (:require [reagent.core :as reagent]
            [todomvc.actions :as actions]
            [todomvc.helpers :as helpers]))

(defn on-key-down [k id title default editing]
  (let [key-pressed (.-which k)]
    (condp = key-pressed
      helpers/enter-key (actions/save-todo id title editing)
      helpers/escape-key (do (reset! title default)
                             (reset! editing false))
      nil)))

(defn component-render [{:keys [id title completed]} editing]
  (let [default title
        edit-title (reagent/atom default)]
    (fn []
      [:input.edit {:type "text"
                    :style {:display (helpers/display-elem @editing)}
                    :value @edit-title
                    :on-change #(reset! edit-title (-> % .-target .-value))
                    :on-blur #(actions/save-todo id edit-title editing)
                    :on-key-down #(on-key-down % id edit-title default editing)}])))

(defn component-did-update [x]
  (.focus (reagent/dom-node x)))

(defn component []
  (reagent/create-class {:reagent-render component-render
                         :component-did-update component-did-update}))
