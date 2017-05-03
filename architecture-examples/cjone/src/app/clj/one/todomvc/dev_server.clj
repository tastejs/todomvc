(ns one.todomvc.dev-server
  "Serve a friendly ClojureScript environment with code reloading and
   the ClojureScript application in both development and advanced
   compiled mode."
  (:use [ring.adapter.jetty :only (run-jetty)]
        [ring.middleware.file :only (wrap-file)]
        [ring.middleware.file-info :only (wrap-file-info)]
        [ring.middleware.stacktrace :only (wrap-stacktrace)]
        [ring.util.response :only (file-response)]
        [compojure.core :only (defroutes ANY)]
        [one.templates :only (apply-templates)]
        [one.host-page :only (default-one-routes)]
        [one.todomvc.api :only (api-routes)]
        [one.todomvc.config :only (config)])
  (:require [one.reload :as reload]
            [one.middleware :as middleware]))

(defroutes app-routes
  api-routes
  (default-one-routes config)
  (ANY "*" request (file-response "404.html" {:root "public"})))

(def ^:private app (-> app-routes
                       (reload/wrap-reload (reload/by-uri "/development" "/production" "/fresh")
                                           (:reloadables config))
                       (wrap-file "public")
                       middleware/rewrite-design-uris
                       wrap-file-info
                       apply-templates
                       middleware/js-encoding
                       middleware/set-active-menu
                       wrap-stacktrace))

(defn run-server
  "Start the development server on port 8090."
  []
  (run-jetty (var app) {:join? false :port 8090}))
