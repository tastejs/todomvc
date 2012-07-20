(ns ^{:doc "Contains the entry point for the ClojureScript sample application."}
  one.todomvc.core
  (:require [one.browser.repl-client :as repl-client]
            [one.dispatch :as dispatch]
            [enfocus.core :as ef])
  (:require-macros [enfocus.macros :as em]))

(defn ^:export repl
  "Connects to a ClojureScript REPL running on localhost port 9000.

  This allows a browser-connected REPL to send JavaScript to the
  browser for evaluation. This function should be called from a script
  in the development host HTML page."
  []
  (repl-client/repl))

(defn ^:export start
  "Start the application by firing a `:init` event which will cause the
  form view to be displayed.
  This function must be called from the host HTML page to start the
  application."
  []
  (em/wait-for-load (dispatch/fire :init)))
