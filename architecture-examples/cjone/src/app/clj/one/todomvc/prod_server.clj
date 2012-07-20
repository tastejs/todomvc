(ns one.todomvc.prod-server
  "Production server serves the backend API. This is only required if
  there is a backend API."
  (:use [ring.adapter.jetty :only (run-jetty)]
        [ring.middleware.file :only (wrap-file)]
        [ring.middleware.file-info :only (wrap-file-info)]
        [ring.middleware.params :only (wrap-params)]
        [ring.util.response :only (file-response)]
        [compojure.core :only (defroutes ANY)]
        [one.todomvc.api :only (api-routes)]))

(def ^:private root "out/public")

;; HACK: Something about the defroutes below requires that the
;; out/public directory exist, or we get a compile error.
(.mkdirs (java.io.File. "out/public"))

(defroutes app-routes
  api-routes
  (-> (ANY "*" request (file-response "404.html" {:root root}))
      (wrap-file root)
      wrap-file-info))

(def ^:private app app-routes)

(defn run-server []
  (let [port (Integer/parseInt (get (System/getenv) "PORT" "8080"))]
    (run-jetty (var app) {:join? false :port port})))
