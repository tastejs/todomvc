(ns ^{:doc "Respond to user actions by updating local and remote
  application state."}
  one.todomvc.controller

  (:use [one.browser.remote :only [request]]
        [one.todomvc.todomodel :only [state data !filter]])
  (:require [cljs.reader :as reader]
            [clojure.browser.event :as event]
            [one.dispatch :as dispatch]
            [goog.uri.utils :as uri]))

(defmulti action
  "Accepts a map containing information about an action to perform.

  Actions may cause state changes on the client or the server. This
  function dispatches on the value of the `:type` key and currently
  supports `:init`, `:form`, and `:greeting` actions.

  The `:init` action will initialize the appliation's state.

  The `:todos` action will only update the status atom, setting its state
  to `:todos`.
"
  :type)

(defmethod action :init [_]
  (reset! state {:state :init}))

(defmethod action :all-td [_]
  (reset! !filter :all))

(defmethod action :active-td [_]
  (reset! !filter :active))

(defmethod action :completed-td [_]
  (reset! !filter :complete))


(defn host
  "Get the name of the host which served this script."
  []
  (uri/getHost (.toString window.location ())))

(defn remote
  "Accepts a function id (an identifier for this request), data (the
  data to send to the server) and a callback function which will be
  called if the transmission is successful. Perform an Ajax `POST`
  request to the backend API which sends the passed data to the
  server.

  A tranmission error will add an error message to the application's
  state."
  [f data on-success]
  (request f (str (host) "/remote")
           :method "POST"
           :on-success #(on-success (reader/read-string (:body %)))
           :on-error #(swap! state assoc :error "Error communicating with server.")
           :content (str "data=" (pr-str {:fn f :args data}))))

;; TODO used it to implement sync
(defmulti add-callback
  :name)
(defmethod add-callback :save [{:keys [data]}]
  (swap! data (fn [o n]
                (assoc n :sync true :data data))))
;;;;;;;;;;;;;;;;



(dispatch/react-to #{:init :all-td :active-td :completed-td}
                   (fn [t d] (action (assoc d :type t))))
