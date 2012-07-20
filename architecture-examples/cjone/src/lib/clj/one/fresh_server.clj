(ns one.fresh-server
  (:use [ring.adapter.jetty :only (run-jetty)]
        [ring.middleware.file :only (wrap-file)]
        [ring.middleware.file-info :only (wrap-file-info)]
        [ring.middleware.stacktrace :only (wrap-stacktrace)]
        [ring.util.response :only (file-response)]
        [compojure.core :only (defroutes ANY)]
        [one.templates :only (apply-templates)]
        [one.host-page :only (default-one-routes)])
  (:require [one.reload :as reload]
            [one.middleware :as middleware]))

(defroutes app-routes
  (default-one-routes {})
  (ANY "*" request (file-response "404.html" {:root "public"})))

(def ^:private app (-> app-routes
                       (wrap-file "public")
                       wrap-file-info
                       apply-templates
                       middleware/js-encoding
                       middleware/set-active-menu
                       wrap-stacktrace))

(defn start-fresh
  "Start the test server on port 8080."
  []
  (run-jetty (var app) {:join? false :port 8080}))
