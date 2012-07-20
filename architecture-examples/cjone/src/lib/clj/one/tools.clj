(ns one.tools
  "Support for building deployment artifacts for a project."
  (:use [cljs.closure :only (build)]
        [one.host-page :only (application-host)]
        [cljs.repl :only (repl)]
        [cljs.repl.browser :only (repl-env)]
        [one.test :only (*eval-env*)])
  (:require [clojure.java.io :as io]
            [clojure.test :as test]))

(defn- cljs-build-opts
  "Return output directory options."
  [config]
  {:output-to (str (:js config) "/" (:dev-js-file-name config))
   :output-dir (str (:js config) "/out")
   :libs (:libs config)
   :externs (:externs config)
   :foreign-libs (:foreign-libs config)})

(defn- production-js
  "Return the path to the production Javascript file."
  [config]
  (str (:js config) "/" (:prod-js-file-name config)))

(defn build-project
  "Emit both a JavaScript file containing the compiled ClojureScript
  application and the host HTML page."
  [config]
  (build (:cljs-sources config) (assoc (cljs-build-opts config)
                                  :optimizations :advanced
                                  :output-to (str "out/" (production-js config))))
  (spit "out/public/index.html" (application-host config :production)))


(def ^{:private true
       :doc "Special functions which may be run in Clojure from the
  ClojureScript REPL."}
  repl-special-fns
  {'run-tests (fn [eval-env & nss]
                (doseq [ns nss]
                  (require (second ns) :reload))
                (binding [*eval-env* eval-env]
                  (apply test/run-tests (map second nss))))})

(defn cljs-repl
  "Start a ClojureScript REPL which can connect to the development
  version of the application. The REPL will not work until the
  development page connects to it, so you will need to either open or
  refresh the development page after calling this function.

  The REPL is configured to allow tests to be run by calling
  `(run-tests 'some.test.ns)` where `some.test.ns` is a namespace
  which contains tests that you would like to run."
  []
  (repl (repl-env) :special-fns repl-special-fns))



(defn copy-recursive-into
  "Recursively copy the files in src to dest."
  [src dest]
  (doseq [file (remove #(.isDirectory %) (file-seq (io/file src)))]
    (let [dest-file (io/file dest file)]
      (.mkdirs (.getParentFile dest-file))
      (io/copy file dest-file))))




(defn delete
  "Delete one or more files or directories. Directories are recursively
  deleted."
  [& paths]
  (doseq [path paths
          file (reverse (file-seq (io/file path)))]
    (.delete file)))


(defn init-config [config]
  (copy-recursive-into (:enfocus.core config) "out/enfocus"))
