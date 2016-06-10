(ns todomvc.session
  (:require [reagent.core :as reagent]
            [alandipert.storage-atom :refer [local-storage]]))

(reset! alandipert.storage-atom/storage-delay 0)

(def todos (local-storage (reagent/atom (sorted-map)) :todos-reagent))
;; will look like {id {:id _ :title _ :completed _ }}

(def todos-counter (local-storage (reagent/atom 0) :todos-counter-reagent))
;; will inc for each new todo

(def todos-display-type (reagent/atom :all))
;; the options are :all, :active, :completed
