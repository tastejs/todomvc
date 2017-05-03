(ns one.todomvc.todomodel
  (:use [clojure.string :only [blank?]]
        [cljs.reader :only [read-string]]
        [one.todomvc.logging :only [log-console]])
  (:require [one.dispatch :as dispatch]))


;; TODO datomic
(def data (atom {:sync false :data nil}))

;; TODO changer la place
(def query-params {:xpc {:cn "BpbDFiKtKD", "tp" nil}})

(def ^{:doc "An atom containing a map which is the application's current state."}
  state (atom {}))

(add-watch state :state-change-key
           (fn [k r o n]
             (dispatch/fire :state-change n)))


(def ^{:doc "An atom containing the state of the todo form and its fields."}
  !todo-form (atom {}))

(def ^{:doc "Atom containing the list of todos."}
  !todos (atom []))

(def ^{:doc "Used git for this project"}
  !used-git (atom []))

(def ^{:doc "Atom containing the new todo, used for updating view."}
  !new-todo (atom {:todo nil}))

(def ^{:doc "Count change event"}
  !count (atom {}))

(def ^{:doc "What to display: all, active, completed. Default all"}
  !filter (atom :all))

(add-watch !todos :todos-change-key
           (fn [k r o n]
             (save-todos!)
             (swap! !count assoc :count (todo-count) :left (todo-count false) :completed (todo-count true))
             (dispatch/fire :todos-change {:old o :new n :count @!count})
))

(add-watch !todo-form :todos-form-change-key
           (fn [k r o n]
             (dispatch/fire :form-change {:old o :new n})))

(add-watch !filter :todos-filter-key
           (fn [k r o n]
             (dispatch/fire :filter-change (case n
                                             :active {:new (remove :completed? @!todos) :count @!count}
                                             :completed {:new (filter :completed? @!todos) :count @!count}
                                             :all {:new @!todos :count @!count}))))
;;;;;;;;;;;;;;;;;;;;;
;;"Routing"

(defn update-filter!
  "Updates filter according to current location hash"
  []
  (let [[_ loc] (re-matches #"#/(\w+)" (.-hash js/location))]
    (reset! !filter (keyword loc))))

(set! (.-onhashchange js/window) update-filter!)

(defn title-exists?
  "Is there already a todo with that title?"
  [title]
  (some #(= title %)
        (map :title @!todos)))

(defn add-todo!
  "Add a new todo to the list."
  [title]
  (let [title (.trim title)]
    (when (not (or (blank? title)
                   (title-exists? title)))
      (swap! !todos conj {:title title :completed? false}))))


(defn clear-todo!
  "Remove a single todo from the list."
  [title]
  (swap! !todos
         (fn [todos]
           (remove #(= title (:title %)) todos))))

(dispatch/react-to #{:new-todo}
                   (fn [t d](add-todo! d)))

(defmulti ^:private new-status
  (fn [& args] (vec args)))

(defmethod new-status [:empty :focus :empty] [p e f]
  {:status :empty})
(defmethod new-status [:editing :focus :editing] [p e f]
  {:status :editing})
(defmethod new-status [:empty :change :valid] [p e f]
  {:status :editing-valid})
(defmethod new-status [:editing-valid :change :valid] [p e f]
  {:status :editing-valid})
(defmethod new-status [:editing-valid :focus :editing-valid] [p e f]
  {:status :editing-valid})

(defn- form-status
  "Calculates the status of the whole form based on the status of each
  field. Retuns `:finished` or `:editing`."
  [m]
  (if (every? #(or (= % :valid) (= % :editing-valid)) (map :status (vals (:fields m))))
    :finished
    :editing));; for todo app, no validation control

(defn- set-field-value
  "Accepts a field-id and value. Validates the field and updates the
  todos form atom."
  [field-id type value]
  (swap! !todo-form
         (fn [old]
           (let [field-status (assoc (new-status (get-in old [:fields field-id :status])
                                                 type
                                                 :valid) ;; no validation
                                :value value)
                 new (assoc-in old [:fields field-id] field-status)]
             (assoc new :status (form-status new))))))

(defn- set-editing
  "Update the form state for a given field to indicate that the form
  is still being edited."
  [id]
  (swap! !todo-form
         (fn [old]
           (let [field-map (or (get-in old [:fields id]) {})
                 status (or (:status field-map) :empty)
                 field-status (new-status status :focus status)]
             (-> old
                 (assoc-in [:fields id] (assoc field-status :value (:value field-map)))
                 (assoc :status (form-status old)))))))

(dispatch/react-to (fn [e] (= (first e) :field-changed))
                   (fn [[_ id] value]
                     (set-field-value id :change value)))

(dispatch/react-to (fn [e] (= (first e) :editing-field))
                   (fn [[_ id] _]
                     (set-editing id)))

(dispatch/react-to #{:form-submit}
  (fn [t d]
    (let [form-data @!todo-form]
      (when (= (:status form-data) :finished)
        (add-todo! (-> form-data :fields "new-todo" :value))))))

(dispatch/react-to #{:deltodo}
                   (fn [t d]
                     (clear-todo! d)))

(dispatch/react-to #{:clear-completed}
                   (fn [t d]
                     (clear-completed!)))

(dispatch/react-to #{:dom-loaded}
                   (fn [t d]
                     (load-todos!)))
;;;;;;;;;;;;;;;;;;;
;;Persistence

(def ls-key "todos-cjone")
(defn save-todos! []
  (aset js/localStorage ls-key
        (pr-str (map #(dissoc % :editing?) ;;Don't save editing state
                      @!todos))))
(defn load-todos! []
  (reset! !todos 
          (if-let [saved-str (aget js/localStorage ls-key)]
            (read-string saved-str)
            [])))

;;;;;;;;;;;;;;;;;;;

;; TODO interface
(defn todo-count
  ([] (count @!todos))
  ([completed?] (count (filter #(= completed? (% :completed?))
                               @!todos))))

(defn clear-completed!
  "Remove completed items from the todo list."
  []
  (swap! !todos #(remove :completed? %)))

(defn replace-todo! [old new]
  (swap! !todos #(replace {old new} %)))

(defn check-todo!
  "Mark an item as (un)completed."
  [todo completed?]
  (replace-todo! todo (assoc todo :completed? completed?)))

(dispatch/react-to #{:completed}
                   (fn [t d]
                     (check-todo! d (not (:completed? d)))))

(dispatch/react-to #{:toggle-all}
                   (fn [t d]
                     (check-all! d)))
(defn edit-todo!
  "Mark an item as curently being editing"
  [todo]
  (replace-todo! todo (assoc todo :editing? true)))

(defn check-all!
  "Mark all items as (un)completed."
  [completed?]
  (swap! !todos (fn [todos]
                  (map #(assoc % :completed? completed?)
                       todos))))

(defn clear-todo!
  "Remove the todo with title from the list."
  [title]
  (swap! !todos (fn [todos]
                  (remove #(= title (:title %)) todos))))



;; UTILS

(defn capitalize [string]
  (str (.toUpperCase (.charAt string 0))
       (.slice string 1)))

(defmulti ^:private validate
  "Accepts a form id and a value and returns a map
  with `:value`, `:status`, and `:error` keys. Status will be set to
  either `:valid` or `:error`. If there was an error, then there will be
  an error message associated with the `:error` key."
  (fn [id _] id))

(defmethod validate "new-todo" [_ v]
  (cond (= (count v) 0) :empty
        (= (count v) 1) :error
        :else :valid))





