(ns one.todomvc.repl
  "The starting namespace for the project. This is the namespace that
  users will land in when they start a Clojure REPL. It exists to
  provide convenience functions like 'go' and 'dev-server'."
  (:use [clojure.repl])
  (:require [one.tools :as tools]
            [one.todomvc.dev-server :as dev]
            [clojure.java.browse :as browse]))

(def localhost "http://localhost:8090")
(defn go
  "Start a browser-connected REPL and launch a browser to talk to it."
  []
  (dev/run-server)
  (future (Thread/sleep 3000)
          (browse/browse-url (str localhost "/development" )))
  (tools/cljs-repl))

(defn dev-server
  "Start the development server and open the host application in the
  default browser."
  []
  (dev/run-server)
  (future (Thread/sleep 3000)
          (browse/browse-url (str localhost "/development"))))

;; This is a convenience function so that people can start a CLJS REPL
;; without having to type in (tools/cljs-repl)
(defn cljs-repl
  "Start a ClojureScript REPL."
  []
  (tools/cljs-repl))

(println)
(println "Type (go) to launch the development server and setup a browser-connected REPL.")
(println "Type (dev-server) to launch only the development server.")
(println)
