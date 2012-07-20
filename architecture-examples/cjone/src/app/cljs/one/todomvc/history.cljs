(ns ^{:doc "When this library is loaded, a listener function is added
  which will be run when a :form or :greeting event is fired. This
  allows the use of the back button to navigate between views. This is
  accomplished by using library.browser.history to keep track of views
  that have previously been visited, and traversing them when
  navigation events are detected."}
  one.todomvc.history
  (:require [one.dispatch :as dispatch]
            [one.browser.history :as history]))

(defn nav-handler
  "Handle navigation events by firing the appropriate view token."
  [{:keys [token navigation?]}]
  (when navigation?
    (dispatch/fire token)))

(def ^{:doc "The global history object for this application."}
  history (history/history nav-handler))

(dispatch/react-to #{:init :all :completed-td :active-td}
                   (fn [t _]
                     (history/set-token history  (if (#{:init} t) :all t))))



