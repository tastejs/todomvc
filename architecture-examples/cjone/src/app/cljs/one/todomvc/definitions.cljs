(ns one.todomvc.definitions
  (:require [enfocus.core :as ef]
            [clojure.browser.event :as event]
            [goog.events.KeyCodes :as key-codes]
            [goog.events.KeyHandler :as key-handler]
            [one.dispatch :as dispatch]
            [goog.dom.forms :as forms])
  (:require-macros [enfocus.macros :as em]))

;; UTILS
(defn by-id [id] (.getElementById js/document id))

(defn get-grandfather [node]
  (.-parentNode (.-parentNode node)))

(defn render-link [node]
  (em/at node (em/set-attr :class "selected")))

(defn clear-completed [event]
  (let [node (.-currentTarget event)]
    (em/at (get-grandfather node) ["#main > ul > li.completed"] (em/remove-node)))
  (dispatch/fire :clear-completed))

(defn del-todo [event]
  (let [node (.-currentTarget event)
        label (em/from (em/select (.-parentNode node) ["label"]) (em/get-text))]
    (dispatch/fire :deltodo label)))

(defn set-checked [checked?]
  (ef/chainable-standard
   (fn [node](set! (.-checked node) checked?))))

(defn set-value []
  (ef/chainable-standard
   (fn [node] (set! (.-value node) ""))))

(defn toggle-all [event]
  (let [node (.-currentTarget event)]
    (dispatch/fire :toggle-all (.-checked node))
    )
  )

(defn mark-done [event]
  (let [node (.-currentTarget event)
        completed? (.-checked node)
        label (em/from (em/select (.-parentNode node) ["label"]) (em/get-text))]
    (dispatch/fire :completed {:completed? (not completed?) :title label})))

;; TEMPLATES
(em/deftemplate todoapp "templates/todoapp.html" [])

(em/deftemplate todoitem "templates/todo-li.html" [label completed]
  ["input[name='done']"] (set-checked completed)
  ["#label"] (em/content label)
  ["li"](em/set-attr :class (if completed "completed" " ")))

;; ACTIONS
(em/defaction render [todos count]
  ["#main"] (em/set-attr :style (if (< 0 (:count count)) " " "display: none;"))
  ["input"] (set-value)
  ["ul#todo-list > li"] (em/remove-node)
  
  ["ul#todo-list"] (ef/chainable-standard
                    (fn [node](doseq [td todos]
                               (em/at node (em/append (todoitem (:title td) (:completed? td))))
                               (em/at node [":last-child button"](em/listen :click del-todo))
                               (em/at node [":last-child input"] (em/listen :click mark-done)))))
  
  ["section#todoapp > footer"] (if (= 0 (:count count))
                                 (em/set-attr :style "display: none;")
                                 (em/set-attr :style " "))
  
  ["span strong"] (em/content (str (:left count)))
  ["button#clear-completed"](em/content (str "Clear completed (" (:completed count) ")")))

(em/defaction add-destroy-action []
  ["#todo-list button"] (em/listen :click
                                   #(em/at (get-grandfather (.-currentTarget %)) 
                                           (em/remove-node))))

(em/defaction start []
  ["#container"](em/content (todoapp))
  ["button#clear-completed"] (em/listen :click clear-completed)
  ["input#toggle-all"] (em/listen :click toggle-all)
  ["#filters > li > a"] (em/listen :click #(em/do->
                                            (reset-class)
                                            (render-link (.-currentTarget %)))))

(em/defaction reset-class []
  ["#filters > li > a"] (em/set-attr :class " "))
