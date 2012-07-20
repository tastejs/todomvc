(ns one.todomvc.validation)

(defmulti validate
  "Accepts a field id and a value and returns one of :empty, :error
  or :valid."
  (fn [id _] id))

(defmethod validate "name-input" [_ v]
  (cond (= (count v) 0) :empty
        (= (count v) 1) :error
        :else :valid))
