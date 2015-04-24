(ns todomvc.actions
  (:require [todomvc.session :as session]
            [todomvc.helpers :as helpers]))

(defn add-todo [title default]
  (let [id (helpers/create-todo-id)
        trimmed-title (helpers/trim-title @title)]
    (swap! session/todos assoc id {:id id
                                   :title trimmed-title
                                   :completed false})
    (reset! title default)))

(defn toggle-todo [id]
  (swap! session/todos update-in [id :completed] not))

(defn toggle-all-todos [bool]
  (doseq [todo (helpers/todos-all @session/todos)]
    (swap! session/todos assoc-in [(:id todo) :completed] (not bool))))

(defn delete-todo [id]
  (swap! session/todos dissoc id))

(defn save-todo [id title editing]
  (let [trimmed-title (helpers/trim-title @title)]
    (if-not (empty? trimmed-title)
      (swap! session/todos assoc-in [id :title] trimmed-title)
      (delete-todo id))
    (reset! editing false)))

(defn clear-completed-todos [todos]
  (doseq [todo (helpers/todos-completed todos)]
    (delete-todo (:id todo))))
