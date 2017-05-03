(ns enfocus.macros
  (:require [clojure.java.io :as io]))

;##############################################
; All main transformations and functions are 
; represented here in order to give a single 
; entry point to the main protocol.  Many of
; these are just pass throughs but some 
; transforms require a macro.
;
; macros include:                            
;    defsnippit
;    deftemplate
;    defaction
;    at
;    wait-for-load
;    content
;    set-attr
;    remove-attr
;    add-class
;    remove-class
;    do->
;    append
;    prepend
;    after 
;    before
;    substitute
;    remove-node
;    set-style
;    remove-style
;    add-event
;    remove-event
;    effect
;##############################################

(defn- create-transform-call [id-sym pnod-sym forms]
  (map (fn [[sel tran]] (list 
                          (if tran tran  'enfocus.macros/remove-node) 
                          (list 'enfocus.core/css-select id-sym pnod-sym sel)))
       (partition 2 forms)))

(defn- create-extraction-call [id-sym pnod-sym map-sym forms]
  (map (fn [[ky sel tran]] 
         (list 'clojure.core/swap!
               map-sym
               'clojure.core/assoc ky (list
                                       (if tran tran  'enfocus.macros/remove-node) 
                                       (list 'enfocus.core/css-select id-sym pnod-sym sel))))
       (partition 3 forms)))


(defmacro create-dom-action [sym nod tmp-dom args & forms]  
  (let [id-sym (gensym "id-sym")
        pnode-sym (gensym "pnod")
        new-form (create-transform-call id-sym pnode-sym forms)]   
  `(defn ~sym ~args 
     (let [[~id-sym ~pnode-sym] (if (fn? ~nod) (~nod) ["" ~nod])
           ~pnode-sym (if ~tmp-dom
                        (enfocus.core/create-hidden-dom ~pnode-sym)
                        ~pnode-sym)]
       ~@new-form
       (if ~tmp-dom 
         (do
           (enfocus.core/reset-ids ~id-sym ~pnode-sym)
           (enfocus.core/remove-node-return-child ~pnode-sym))
         ~pnode-sym)))))

(defn find-url
  "Given a string, returns a URL. Attempts to resolve as a classpath-relative
  path, then as a path relative to the working directory or a URL string"
  [path-or-url]
  (or (io/resource path-or-url)
      (try (io/as-url path-or-url)
           (catch java.net.MalformedURLException e
             false))
      (io/as-url (io/as-file path-or-url))))


(defn ensure-mode
  " 'mode' argument is not required and defaults to :remote, for
    backward compatability"
  [[mode & _ :as body]]
  (if (keyword? mode)
    body
    (cons :remote body)))

(defn load-local-dom
  "same as 'load-remote-dom', but work for local files"
  [path]
  (let [text (slurp (io/reader (find-url path)))]
    `(when (nil? (@enfocus.core/tpl-cache ~path))
       (let [[sym# txt#] (enfocus.core/replace-ids ~text)
             data# (goog.dom/htmlToDocumentFragment txt#)]
         (swap! enfocus.core/tpl-cache assoc ~path [sym# data#])))))

(defmacro deftemplate [sym & body]
  (let [[mode uri args & forms] (ensure-mode body)]
    `(do
       ~(case mode
          :remote   `(enfocus.core/load-remote-dom ~uri)
          :compiled (load-local-dom uri))
       (enfocus.macros/create-dom-action
        ~sym
        #(enfocus.core/get-cached-dom ~uri)
        true ~args ~@forms))))

(defmacro defsnippet [sym & body]
  (let [[mode uri sel args & forms] (ensure-mode body)]
    `(do
       ~(case mode
          :remote   `(enfocus.core/load-remote-dom ~uri)
          :compiled (load-local-dom uri))
       (enfocus.macros/create-dom-action
        ~sym
        #(enfocus.core/get-cached-snippet ~uri ~sel)
        true ~args ~@forms))))
  
(defmacro defaction [sym args & forms]
  `(defn ~sym ~args (enfocus.macros/at js/document ~@forms)))


(defmacro at [nod & forms]
    (if (= 1 (count forms)) 
      `(do (~@forms ~nod) ~nod)
      (let [pnode-sym (gensym "pnod")
            new-form (create-transform-call "" pnode-sym forms)]
        `(let [nods# (enfocus.core/nodes->coll ~nod)] 
           (doall (map (fn [~pnode-sym] ~@new-form ~pnode-sym) nods#))
           ~nod))))

(defmacro transform 
  ([nod trans] `(enfocus.macros/at ~nod ~trans))
  ([nod sel trans] `(enfocus.macros/at ~nod ~sel ~trans)))

  
(defmacro from [nod & forms]
    (if (= 1 (count forms)) 
      `(~@forms ~nod)
      (let [pnode-sym (gensym "pnod")
            map-sym (gensym "map")
            new-form (create-extraction-call "" pnode-sym map-sym forms)]
        `(let [nods# (enfocus.core/nodes->coll ~nod)
               ~map-sym (atom {}) 
               map-list# (doall (map (fn [~pnode-sym] ~@new-form ~pnode-sym) nods#))]
           (deref ~map-sym)))))

(defmacro wait-for-load [& forms]
	`(enfocus.core/setTimeout (fn check# []
	                   (if (zero? (deref enfocus.core/tpl-load-cnt))
                      (do ~@forms)
                      (enfocus.core/setTimeout #(check#) 10))) 0))   
  


(defmacro select [& forms]
  `(enfocus.core/css-select ~@forms))

(defmacro filter [tst trans]
  `(enfocus.core/en-filter ~tst ~trans))

(defmacro content [& forms]
  `(enfocus.core/en-content ~@forms))

(defmacro html-content [& forms]
  `(enfocus.core/en-html-content ~@forms))

(defmacro set-attr [& forms] 
  `(enfocus.core/en-set-attr ~@forms))


(defmacro remove-attr [& forms] 
  `(enfocus.core/en-remove-attr ~@forms))


(defmacro add-class [& forms]
  `(enfocus.core/en-add-class ~@forms))


(defmacro remove-class [& forms]
  `(enfocus.core/en-remove-class ~@forms))

(defmacro do-> [& forms]
  `(enfocus.core/en-do-> ~@forms))

(defmacro append [& forms]
  `(enfocus.core/en-append ~@forms))

(defmacro prepend [& forms]
  `(enfocus.core/en-prepend ~@forms))

(defmacro after [& forms]
  `(enfocus.core/en-after ~@forms))

(defmacro before [& forms]
  `(enfocus.core/en-before ~@forms))

(defmacro substitute [& forms]
  `(enfocus.core/en-substitute ~@forms))

(defmacro remove-node [& forms]
  `(enfocus.core/en-remove-node ~@forms))

(defmacro wrap [elm mattrs]
  `(enfocus.core/en-wrap ~elm ~mattrs))

(defmacro unwrap []
  `(enfocus.core/en-unwrap))

(defmacro clone-for [[sym lst] & forms]
  `(enfocus.core/chainable-standard 
    (fn [pnod#]
      (let [div# (enfocus.core/create-hidden-dom 
                    (. js/document (~(symbol "createDocumentFragment"))))]
        (doseq [~(symbol (name sym)) ~lst]
          (do 
            (enfocus.macros/at div#  (enfocus.macros/append (. pnod# (~(symbol "cloneNode") true))))
            (enfocus.macros/at (goog.dom/getLastElementChild div#) ~@forms)))
        (enfocus.core/log-debug div#)
        (enfocus.macros/at 
          pnod# 
          (enfocus.macros/do-> (enfocus.macros/after (enfocus.core/remove-node-return-child div#))
                               (enfocus.macros/remove-node)))))))

(defmacro set-style [& forms]
  `(enfocus.core/en-set-style ~@forms))

(defmacro remove-style [& forms]
  `(enfocus.core/en-remove-style ~@forms))

(defmacro listen [& forms]
  `(enfocus.core/en-listen ~@forms))

(defmacro unlisten [& forms]
  `(enfocus.core/en-unlisten ~@forms))

(defmacro remove-listener [& forms]
  `(do
     (enfocus.core/log-debug "this method is deprecated should use remove-listeners")
     (enfocus.core/en-remove-listeners ~@forms)))

(defmacro remove-listeners [& forms]
  `(enfocus.core/en-remove-listeners ~@forms))

(defmacro fade-out 
  ([ttime] 
    `(enfocus.core/en-fade-out ~ttime nil nil))
  ([ttime callback]
    `(enfocus.core/en-fade-out ~ttime ~callback nil))
  ([ttime callback accel]
    `(enfocus.core/en-fade-out ~ttime ~callback nil)))

(defmacro delay [ttime & forms]
  `(enfocus.core/chainable-standard 
    (fn [pnod#] 
      (enfocus.core/setTimeout #((enfocus.macros/at ~@forms) pnod#) ~ttime))))

(defmacro fade-in  
  ([ttime] 
    `(enfocus.core/en-fade-in ~ttime nil nil))
  ([ttime callback]
    `(enfocus.core/en-fade-in ~ttime ~callback nil))
  ([ttime callback accel]
    `(enfocus.core/en-fade-in ~ttime ~callback nil)))

(defmacro resize 
  ([width height]
    `(enfocus.core/en-resize ~width ~height 0)) 
  ([width height ttime]
    `(enfocus.core/en-resize ~width ~height ~ttime nil nil))
  ([width height ttime callback]
    `(enfocus.core/en-resize ~width ~height ~ttime ~callback nil))
  ([width height ttime callback accel]
    `(enfocus.core/en-resize ~width ~height ~ttime ~callback ~accel))) 

(defmacro move 
  ([xpos ypos] 
    `(enfocus.core/en-move ~xpos ~ypos 0 nil nil))
  ([xpos ypos ttime] 
    `(enfocus.core/en-move ~xpos ~ypos ~ttime nil nil))
  ([xpos ypos ttime callback]
  `(enfocus.core/en-move ~xpos ~ypos ~ttime ~callback nil))
  ([xpos ypos ttime callback accel]
  `(enfocus.core/en-move ~xpos ~ypos ~ttime ~callback ~accel))) 

(defmacro chain [func & chains]
  (if (empty? chains)
    `(fn [pnod#] (~func pnod#))
    `(fn [pnod#] (~func pnod# (enfocus.macros/chain ~@chains)))))

(defmacro get-attr [attr]
  `(enfocus.core/en-get-attr ~attr))

(defmacro get-text []
  `(enfocus.core/en-get-text))

(defmacro get-prop [prop]
  `(enfocus.core/extr-multi-node
     (fn [pnod#]
       (~(symbol (str ".-" (name prop))) pnod#))))
