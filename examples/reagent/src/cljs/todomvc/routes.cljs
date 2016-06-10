(ns todomvc.routes
  (:require [todomvc.session :as session]
            [secretary.core :as secretary :include-macros true]
            [goog.events :as events]
            [goog.history.EventType :as EventType])
  (:import goog.History))

(secretary/set-config! :prefix "#")

(secretary/defroute "/" []
  (reset! session/todos-display-type :all))

(secretary/defroute "/active" []
  (reset! session/todos-display-type :active))

(secretary/defroute "/completed" []
  (reset! session/todos-display-type :completed))

(doto (History.)
  (events/listen
   EventType/NAVIGATE
   (fn [event]
     (secretary/dispatch! (.-token event))))
  (.setEnabled true))
