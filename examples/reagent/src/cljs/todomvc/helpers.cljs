(ns todomvc.helpers
  (:require [todomvc.session :as session]))

(def enter-key 13)

(def escape-key 27)

(defn trim-title [title]
  (clojure.string/trim title))

(defn display-elem [bool] 
  (if bool "inline" "none"))

(defn todo-display-filter [completed display-type]
  (case display-type
    :completed completed
    :active (not completed)
    true))

(defn create-todo-id []
  (swap! session/todos-counter inc))

(defn todos-all [todos]
  (vals todos))

(defn todos-active [todos]
  (let [todos-all (todos-all todos)]
    (filter #(not (:completed %)) todos-all)))

(defn todos-completed [todos]
  (let [todos-all (todos-all todos)]
    (filter :completed todos-all)))

(defn todos-any? [todos]
  (pos? (count (todos-all todos))))

(defn todos-any-completed? [todos]
  (pos? (count (todos-completed todos))))

(defn todos-all-completed? [todos]
  (= (count (todos-all todos))
     (count (todos-completed todos))))
