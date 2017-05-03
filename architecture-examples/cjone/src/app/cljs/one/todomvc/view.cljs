(ns ^{:doc "Render the views for the application."}
  one.todomvc.view
  (:use [domina :only [value]])
  (:require-macros [enfocus.macros :as em])

  (:require [clojure.browser.event :as event]
            [goog.events.KeyCodes :as key-codes]
            [goog.events.KeyHandler :as key-handler]
            [one.dispatch :as dispatch]
            [one.todomvc.definitions :as def]
            [enfocus.core :as ef]))

(defn by-id [id] (.getElementById js/document id))

(defn add-input-event-listeners
  [field-id]
  (let [field (by-id field-id)
        keyboard (goog.events.KeyHandler. (by-id "todoapp"))]
    (event/listen field
                  "focus"
                  #(dispatch/fire [:editing-field field-id]))
    (event/listen field
                  "keyup"
                  #(dispatch/fire [:field-changed field-id] (value field)))
    (event/listen keyboard
                  "key"
                  (fn [e] (when (= (.-keyCode e) key-codes/ENTER)
                           (dispatch/fire :form-submit))))))

(defmulti render
  "Accepts a map which represents the current state of the application
  and renders a view based on the value of the `:state` key."
  :state)

(defmethod render :init [_]
  (def/start)
  (add-input-event-listeners "new-todo")
  (dispatch/fire :dom-loaded))

(defmethod render :all [_]
  (swap! !filter :all))

(defmethod render :active [_]
  (swap! !filter :active))

(defmethod render :completed [_]
  (swap! !filter :completed))


(dispatch/react-to #{:state-change} (fn [_ m] (render m)))
(dispatch/react-to #{:todos-change} (fn [_ m] (def/render (:new m) (:count m))))
(dispatch/react-to #{:filter-change} (fn [_ m] (def/render (:new m) (:count m))))

(defmulti render-form-field  :transition)

(defmethod render-form-field :default [_])
(defmethod render-form-field [:empty :editing] [{:keys [id]}]
  (em/fade-in (by-id id)))
(defmethod render-form-field [:editing :empty] [{:keys [id]}]
  (em/fade-out (by-id id)))

(defn- form-fields-status
  "Given a map of old and new form states, generate a map with `:id`,
  `:transition` and `:error` keys which can be passed to
  `render-form-field`."
  [m]
  (map #(hash-map :id %
                  :transition [(or (get-in m [:old :fields % :status]) :empty)
                               (get-in m [:new :fields % :status])]
                  :error (get-in m [:new :fields % :error]))
       (keys (get-in m [:new :fields]))))

(dispatch/react-to #{:form-change}
                   (fn [_ m]
                     (doseq [s (form-fields-status m)]
                       (render-form-field s))))

;; UTILS
