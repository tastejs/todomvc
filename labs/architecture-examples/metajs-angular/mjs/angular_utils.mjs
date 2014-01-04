;;; Generic utils and helpers for AngularJS.

(defmacro di-fn (signature & code)
  "Convert function to array for proper dependency injection even after js minification."
  (conj (quote* signature) `(fn ~signature ~@code)))


(defmacro within (parent & code)
  "Place all definitions from code inside parent and add entity bindings for them."
  (defn ns-form (type fst form)
    (def name (second form))
    (list 'statements
          ['entity parent (switch type
                                  'def ['has name]
                                  'fn ['fn name (form @2)])]
          (cons fst (cons (name .clone-with-ns parent) (form.slice 2)))))

  (defn mapper (form)
    (if (list-name? form 'def) (ns-form 'def 'set)
        (list-name? form 'defn) (ns-form 'fn (first form))
        form))
  `(statements ~@(map code mapper)))

;;(macrojs within)

(defmacro scope-fn (signature & code)
  "Use first form of signature as parent scope for code and then apply di-fn."
  `(di-fn ~signature (within ~(first signature) ~@code)))

