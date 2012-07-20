(ns one.todomvc.api
  "The server side of the sample application. Provides a simple API for
  updating an in-memory database."
  (:use [ring.middleware.params :only (wrap-params)]
        [compojure.core :only (defroutes POST)]
        [one.todomvc.validation :only (validate)]))

(defonce ^:private next-id (atom 0))

(defonce ^:dynamic *database* (atom #{}))

(defmulti remote
  "Multimethod to handle incoming API calls. Implementations are
  selected based on the :fn key in the data sent by the client.
  Implementation are called with whatever data struture the client
  sends (which will already have been read into a Clojure value) and
  can return any Clojure value. The value the implementation returns
  will be serialized to a string before being sent back to the client."
  :fn)

(defmethod remote :default [data]
  {:status :error :message "Unknown endpoint."})

(defmethod remote :add-name [data]
  (let [n (-> data :args :name)
        response {:exists (contains? @*database* n)}]
    (when (= (validate "name-input" n) :valid)
      (swap! *database* conj n))
    response))

(defroutes remote-routes
  (POST "/remote" {{data "data"} :params}
        (pr-str
         (remote
          (binding [*read-eval* false]
            (read-string data))))))

(def api-routes (wrap-params remote-routes))
