(ns one.todomvc.config
  "This namespace contains the configuration for a ClojureScript One
  application."
  (:use [one.reload :only [dependency clojure-reloads clojurescript-reloads watched-directory shared]])
  (:require [net.cgrand.enlive-html :as html]))

;; Set the location where all generated JavaScript will be stored.

(def public-js "public/javascripts")

;; Create transformations which will change the host page based on the
;; environment that we are running in.

(defn- production-transform [h]
  (html/transform h
                  [:ul#navigation]
                  (html/substitute (html/html-snippet ""))))

;; Configure code reloading for Clojure, ClojureScript and shared
;; code.

(def clj-reloads (clojure-reloads ["src/app/clj" "src/lib/clj"]
                                  "host_page.clj"
                                  "templates.clj"
                                  "api.clj"
                                  "config.clj"
                                  "core.cljs"))

(def cljs-reloads (clojurescript-reloads ["src/app/cljs"]
                                         :packages ["one"]
                                         :shared (shared "src/app/shared")
                                         :js "public/javascripts"))

(def macro-reloads (dependency (clojure-reloads ["src/app/cljs-macros"]
                                                "snippets.clj")
                               clj-reloads
                               cljs-reloads))

(def templates (watched-directory "templates" cljs-reloads))

;; Application configuration.
(def include-libs ["javascripts/out/cljs/core.js" "javascripts/out/clojure/string.js"])
(def ^{:doc "Configuration for the sample application."}
  config {;; Something which implements the Compilable protocol. Used
          ;; by one.tools to build the production application.
          :cljs-sources cljs-reloads
          ;; The location where all generated JavaScript will be
          ;; stored. Use in one.tools to determine where to output
          ;; compiled JavaScript.
          :js public-js
          :dev-js-file-name "main.js"
          :prod-js-file-name "mainp.js"
          :libs [] 
          :dev-js ["goog.require('one.todomvc.core');"
                   "goog.require('one.todomvc.view');"
                   "goog.require('one.todomvc.todomodel');"
                   "goog.require('one.todomvc.controller');"
                   "goog.require('one.todomvc.history');"
                   "goog.require('one.todomvc.logging');"
                   "one.todomvc.core.start();one.todomvc.core.repl();"]
          :prod-js ["one.todomvc.core.start();"]
          :prod-transform production-transform
          :reloadables [clj-reloads cljs-reloads macro-reloads templates]})
