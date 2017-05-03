(defproject one "1.0.0-SNAPSHOT"

  :description "ClojureScriptOne . TodoMVC"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [ring "1.0.0-RC1"]
                 [compojure "0.6.4"]
                 [enlive "1.0.0"]
                 [enfocus "0.9.1-SNAPSHOT"]
                 [org.mozilla/rhino "1.7R3"]
                 [com.google.javascript/closure-compiler "r1592"]
                 [org.clojure/google-closure-library "0.0-790"]
                 ]

  :plugins [[lein-cljsbuild "0.2.4"]]
  :hooks [leiningen.cljsbuild]
  
  :cljsbuild {
              :builds [
                       {
                        :source-path "src/enfocus"
                        :compiler {
                                   :output-to "public/javascripts/out/enfocus/core.js"
                                   :optimizations :advanced
                                   :pretty-print true
                                   }
                        }
                       
                       ]
              }
  :dev-dependencies [[jline "0.9.94"]
                     [marginalia "0.7.0-SNAPSHOT"]
                     [lein-marginalia "0.7.0-SNAPSHOT"]]
  
  :git-dependencies [["https://github.com/clojure/clojurescript.git"
                      "16863e3e5cdf2d968fc8d90d2d8da6f00e2398c0"]
                     ["https://github.com/levand/domina.git"
                      "8933b2d12c44832c9bfaecf457a1bc5db251a774"]
                     ["https://github.com/ckirkendall/enfocus.git"
                      "2eb2aaf78fe9d73eb3ad8094c5b5fe31b7366c46"]
                     ]

  :repl-init one.todomvc.repl
  
  :source-path "src/app/clj"
  
  :extra-classpath-dirs [".lein-git-deps/clojurescript/src/clj"
                         ".lein-git-deps/clojurescript/src/cljs"
                         ".lein-git-deps/domina/src/cljs"
                         ".lein-git-deps/enfocus/project/cljs-src"
                         "src/app/cljs"
                         "src/app/shared"
                         "src/app/cljs-macros"
                         "src/lib/clj"
                         "src/lib/cljs"
                         "templates"])
