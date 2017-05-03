(ns one.test
  "Support for evaluating ClojureScript code from Clojure tests."
  (:refer-clojure :exclude [load-file])
  (:require [cljs.repl.browser :as browser])
  (:use clojure.test
        [clojure.java.browse :only (browse-url)]
        [cljs.analyzer :only (namespaces *cljs-ns*)]
        [cljs.repl :only (evaluate-form load-file load-namespace)]
        [cljs.repl :only (-setup -tear-down)]
        [one.fresh-server :only (start-fresh)]))

(def ^{:dynamic true
       :doc "The current JavaScript evaluation environment."}
  *eval-env* nil)
(def ^{:dynamic true
       :doc "The current JavaScript evaluation namespace."}
  *eval-ns* 'cljs.user)
(def ^{:dynamic true
       :doc "The current JavaScript evaluation namespace in which tests are running."}
  *js-test-ns* 'cljs.user)

(defn- wrap-fn
  "This function has been copied from cljs.repl in ClojureScript. If
  that function were made public we wouldn't need to repeat this here."
  [form]
  (cond (and (seq? form) (= 'ns (first form))) identity
        ('#{*1 *2 *3} form) (fn [x] `(cljs.core.pr-str ~x))
        :else (fn [x] `(cljs.core.pr-str
                       (let [ret# ~x]
                         (do (set! *3 *2)
                             (set! *2 *1)
                             (set! *1 ret#)
                             ret#))))))

(defn evaluate-cljs
  "Evaluate a ClojureScript form within the given evaluation
  environment. The form will also be evaluated in the passed namespace
  which defaults to `'cljs.user`."
  ([eval-env form]
     (evaluate-cljs eval-env 'cljs.user form))
  ([eval-env ns form]
     (binding [*cljs-ns* 'cljs.user]
       (let [env {:context :statement :locals {}}]
         (cond
          (and (seq? form) ('#{load-file clojure.core/load-file} (first form)))
          (load-file eval-env (second form))
          
          (and (seq? form) ('#{load-namespace} (first form)))
          (load-namespace eval-env (second form))
          
          :else
          (let [ret (evaluate-form eval-env
                                   (assoc env :ns (@namespaces ns))
                                   "<testing>"
                                   form
                                   (wrap-fn form))]
            (try (read-string ret)
                 (catch Exception e
                   (if (string? ret)
                     ret
                     nil)))))))))

(defn cljs-wait-for*
  "Using evaluation environment `eval-env` evaluate form in namespace
  `ns` in the browser until `pred` applied to the result returns `true` or
  the timeout expires. If `pred` returns logical true, returns the
  result of `pred`. Throws `Exception` if the timeout (in milliseconds)
  has expired."
  [eval-env pred ns form remaining]
  (if (pos? remaining)
    (if-let [result (pred (evaluate-cljs eval-env ns form))]
      result
      (do (Thread/sleep 10)
          (recur eval-env pred ns form (- remaining 10))))
    (throw (Exception.
            (str "Form "
                 form
                 " did not satisfy predicate before the timeout expired.")))))

(defmacro cljs-wait-for
  "Expands to a call to `cljs-wait-for*` using `*eval-env*` as the
  evaluation environment and a timeout of roughly one minute."
  [pred ns form]
  `(cljs-wait-for* *eval-env* ~pred (quote ~ns) (quote ~form) 60000))

(defn ensure-ns-loaded
  "Ensure that that browser has completely loaded namespace ns. We
   need this because in some situations, we wind up trying to run code
   that depends on a namespace that isn't available yet, due to
   asynchrony in the browser. Returns true if the namespace loads
   within the specified timeout (roughly 60 seconds by default), and
   throws `Exception` otherwise."
  ([eval-env ns] (ensure-ns-loaded eval-env ns 60000))
  ([eval-env ns remaining]
     (if (pos? remaining)
       (if (evaluate-cljs eval-env (list 'boolean ns))
         true
         (do (Thread/sleep 10)
             (recur eval-env ns (- remaining 10))))
       (throw (Exception. (str "Namespace " ns " did not load before the timeout expired."))))))

(defmacro cljs-eval
  "Evaluate forms in namespace `ns` in the evaluation environment
  `*eval-env*`."
  [ns & forms]
  (let [ns (if ('#{*js-test-ns* one.test/*js-test-ns*} ns) ns `(quote ~ns))]
    `(do
       (ensure-ns-loaded *eval-env* ~ns)
       ~@(map (fn [x] `(evaluate-cljs *eval-env* ~ns (quote ~x))) forms))))

(defn browser-eval-env
  "Create and set up a browser evaluation environment. Open a browser
  to connect to this client."
  []
  (let [eval-env (browser/repl-env)]
    (-setup eval-env)
    eval-env))

(defn within-browser-env
  "Evaluate f with `one.test/*eval-env*` bound to a browser evaluation
  environment. If `one.test/*eval-env*` is not already bound then open
  a browser window and navigate to `:url`. `:url` defaults to
  'http://localhost:8080/fresh'.

  You may also pass the optional arguments: `:init` and
  `:start-server`. `:init` is a function which will run before any
  tests are run and can be used to setup the JavaScript environment
  before the tests are run. `:start-server` is a function which will
  start a test server. `:start-server` defaults to
  `one.fresh-server/start-fresh`."
  [f & {:keys [init url start-server]}]
  (let [url (or url "http://localhost:8080/fresh")
        start-server (or start-server start-fresh)]
    (if *eval-env*
      (do (when init (init))
          (f))
      (let [server (start-server)
            eval-env (browser-eval-env)]
        (browse-url url)
        (binding [*eval-env* eval-env]
          (when init (init))
          (f))
        (-tear-down eval-env)
        (.stop server)))))

(defmacro js
  "Accepts a form and evaluates it in the current testing namespace
  and evaluation environment."
  [form]
  `(cljs-eval *js-test-ns* ~form))

(defn browser-eval-env
  "Create and set up a browser evaluation environment. Open a browser
  to connect to this client."
  [& options]
  (let [eval-env (apply browser/repl-env options)]
    (-setup eval-env)
    eval-env))

(defn bep-setup
  "Create the environment and start a socket listener for the
  BEP (Browser-Eval-Print).

  Valid options are :port"
  [& options]
  (alter-var-root #'*eval-env* (constantly (apply browser-eval-env options))))

(defn bep-teardown
  "Shutdown socket listener for the BEP (Browser-Eval-Print)."
  []
  (alter-var-root #'*eval-env* -tear-down))

(defn bep-in-ns
  "Switch the BEP (Browser-Eval-Print) environment to the namespace
  with the given name (a symbol)."
  [ns-name]
  (alter-var-root #'*eval-ns* (constantly ns-name)))

(defmacro bep
  "Evaluate forms in the browser."
  [& forms]
  `(evaluate-cljs *eval-env* *eval-ns* '(do ~@forms)))

(defmacro in-javascript [& forms]
  (let [[url forms] (if (string? (first forms)) [(first forms) (next forms)] [nil forms])
        [start-server forms] (if (symbol? (first forms)) [(first forms) (next forms)] [nil forms])
        [ns & forms] forms
        options [:url url :start-server start-server]
        [ns-name & deps] (rest ns)]
    `(do
       (defn setup# []
         
         (cljs-eval cljs.user ~ns)
         
         ~@(map (fn [f#] (list `cljs-eval ns-name f#)) forms))
       
       (use-fixtures :once
                     (fn [f#] (within-browser-env (fn [] (binding [*js-test-ns* (quote ~ns-name)]
                                                         (f#)))
                                                 :init setup#
                                                 ~@options))))))
